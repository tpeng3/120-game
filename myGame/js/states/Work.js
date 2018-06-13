BasicGame.Work = function (game) {};

BasicGame.Work.prototype = {
    preload: function() {
        this.time.advancedTiming = true;

        // bullet hell images
        this.load.spritesheet('bh_locke', 'assets/img/bh/bh_locke.png', 64, 64);
        this.load.image('bh_locke_core', 'assets/img/bh/bh_locke_core.png');
        this.load.image('locke_bullet', 'assets/img/bh/bh_bullet_locke.png');
        this.load.image('enemy_bullet', 'assets/img/bh/bh_bullet_bright.png');
        this.load.image('enemy_bullet_l', 'assets/img/bh/bh_bullet_lbright.png');
        this.load.image('enemy', 'assets/img/bh/bh_enemy.png');
        this.load.image('boss', 'assets/img/bh/' + BasicGame.global.case.boss.sprite + '.png');

        this.load.image('frame', 'assets/img/ui/ui_bhframe.png');
        // this.load.image('frame', 'assets/img/ui/ui_bhframe_test.png');
        this.load.image('hexagons', 'assets/img/bg/bg_hexagons.png');

        // ui images
        this.load.atlas('bh_sprite_locke', 'assets/img/bh/bh_sprite_locke.png', 'assets/img/bh/bh_sprite_locke.json');
        this.load.image('bh_clock', 'assets/img/bh/bh_clock.png');
        this.load.image('bh_tick', 'assets/img/bh/bh_tick.png');
        this.load.image('bh_lives', 'assets/img/bh/bh_lives.png');
        // this.load.image('bh_boss_health', 'assets/img/bh/bh_boss_health.png');
        this.load.spritesheet('bh_boss_health', 'assets/img/bh/bh_boss_health.png', 2, 16);

        this.load.image('bh_boss_hcontainer', 'assets/img/bh/bh_boss_health_container.png');

        this.load.audio('sfx_enemy_death', 'assets/audio/sfx/sfx_enemy_death.ogg');
    },
    create: function () {
        this.BH_TIME = 90000; //time limit for the bullet hell is currently a minute

        //Initialize lives based on the player's fatigue
        this.lives = Math.max(1, 3 - Math.floor((BasicGame.global.player_stats.fatigue - 1) / 2));

        // enable physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // add location bg
        this.add.sprite(0, 0, 'bg_agency');

        // add background/frame
        this.frame = this.add.sprite(200, 16, 'frame');
        this.frame.tint = .8 * 0xffffff;
        this.hexagons = this.add.tileSprite(204, 20, 800, 680, 'hexagons');
        this.hexagons.alpha = 0.6;

        this.blackframes = this.add.group();
        var black5 = this.add.sprite(this.frame.x+6, this.frame.y+4, 'bg_black');
        black5.scale.setTo(64, 64);
        this.blackframes.add(black5);
        var black6 = this.add.sprite(this.frame.x+this.frame.width-70, this.frame.y+4, 'bg_black');
        black6.scale.setTo(black5.width, black5.height);
        this.blackframes.add(black6);
        var black7 = this.add.sprite(this.frame.x+6, this.frame.y+this.frame.height-70, 'bg_black');
        black7.scale.setTo(black5.width, black5.height);
        this.blackframes.add(black7);
        var black8 = this.add.sprite(this.frame.x+this.frame.width-70, this.frame.y+this.frame.height-70, 'bg_black');
        black8.scale.setTo(black5.width, black5.height);
        this.blackframes.add(black8);

        this.world.bringToTop(this.frame);
        this.world.bringToTop(this.hexagons);

        game.physics.arcade.setBounds(this.frame.x+24, this.frame.y+32, this.frame.width-48, this.frame.height-48);

        // create enemy group
        this.enemyGroup = this.add.group();
        Enemy.group = this.enemyGroup;

        // create the player sprite from the player prefab
        this.player = new Player(game, this.lives, this.enemyGroup);
        this.add.existing(this.player);
        this.player.body.collideWorldBounds = true; // player can't move outside of frame

        let bossDat = BasicGame.global.case.boss;
        // create and spawn the boss enemy
        this.boss = new EnemyAI(game, this.world.width / 2 + bossDat.pos.x, 30 + bossDat.pos.y, 'boss', bossDat.curr_health, bossDat.max_health, this.player, 150, 1500, EnemyAI['AI_' + bossDat.ai_pattern]);
        this.add.existing(this.boss);
        this.enemyGroup.add(this.boss);

        game.sound.stopAll();
        bgm = game.add.audio(BasicGame.global.case.bgm);
        bgm.loopFull()

        // add more black frames and information
        var black1 = this.add.sprite(0, 0, 'bg_black');
        black1.scale.setTo(this.frame.x+6, game.height);
        this.blackframes.add(black1);
        var black2 = this.add.sprite(this.frame.x+this.frame.width-6, 0, 'bg_black');
        black2.scale.setTo(game.width-black2.x+6, black1.height);
        this.blackframes.add(black2);
        var black3 = this.add.sprite(black1.x+black1.width, 0, 'bg_black');
        black3.scale.setTo(black2.x-black1.width, 20);
        this.blackframes.add(black3);
        var black4 = this.add.sprite(black1.x+black1.width, this.frame.y+this.frame.height-6, 'bg_black');
        black4.scale.setTo(black3.width, game.height - black4.y);
        this.blackframes.add(black4);

        this.blackframes.alpha = 0.85;

        // add ui locke sprite
        spriteLocke = this.add.sprite(1020, 100, 'bh_sprite_locke', 'bh_locke_'+this.player.currHealth);

        // add bullet hell information
        var clock = this.add.sprite(100, 150, 'bh_clock');
        clock.anchor.setTo(0.5, 0.5);
        clock.scale.setTo(2.5, 2.5);
        this.tick = this.add.sprite(100, 150, 'bh_tick');
        this.tick.anchor.setTo(0.5, 0.5);
        this.tick.scale.setTo(2.5, 2.5);

        lives = this.add.group();
        for(let i=0; i<this.player.currHealth; i++){
            lives.add(this.add.sprite(120, 410+(i*70), 'bh_lives'));
        }

        let pos = new Phaser.Point(this.world.width/2, this.world.height - this.world.height / 3)
        this.introText = new Textbox(game, false, null, [{ name: '', text: 'Arrow keys or WASD to move, Hold [SPACEBAR] (or [Z]) to shoot, and Hold [SHIFT] for more precise movement!' }], pos, new Phaser.Point(0.5,0.5), new Phaser.Point(1000, 200));

        //Bind the line advancing function to the spacebar
        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.addOnce(this.workStart, this);
    },
    update: function () {
        this.hexagons.tilePosition.x += .1;
        this.hexagons.tilePosition.y += 1;
        // this.physics.arcade.collide(this.player, this.frameBounds);

        if (!this.boss.alive) {
            this.workEndBossDeath();
        }

        if(!this.player.alive){ // temporary code just to progress through the states for now
            this.workEnd();
        }
    },
    workStart: function () {
        // timer before going on to the next stage
        this.game.time.events.add(this.BH_TIME, this.workEnd, this);
        // update clock/tick ui
        this.game.time.events.loop(this.BH_TIME/360, function(){
            this.tick.angle += 1;
        }, this);
        this.player.pause = false;
        this.boss.pause = false;
        this.introText.hide();
    },
    workEnd: function () {
        if (!this.boss.alive) {
            this.workEndBossDeath();
            return;
        }
        Player.bulletGroup = null;
        Enemy.bulletGroup = null;
        BasicGame.global.case.boss.curr_health = this.boss.currHealth;
        this.camera.fade('#000');
        this.camera.onFadeComplete.addOnce(function () {
            let dateNum = calendar.date.getDate();
            if ((dateNum == 9 && BasicGame.global.case_flags['Case_1'] != true) || (dateNum == 16 && BasicGame.global.case_flags['Case_2'] != true)) {
                this.state.start('Cutscene', true, false, 'WorkFail');
            } else
                this.state.start('Bedtime');
        }, this);
    },
    workEndBossDeath: function () {
        BasicGame.global.case = undefined;
        Player.bulletGroup = null;
        Enemy.bulletGroup = null;
        this.camera.fade('#000');
        this.camera.onFadeComplete.addOnce(function () {
            BasicGame.global.case_flags['Case_' + BasicGame.global.case_number] = true;
            if (BasicGame.global.case_number != 'final')
                this.state.start('Cutscene', true, false, 'case/CaseClosed_' + (BasicGame.global.case_number));
            else
                this.state.start('Cutscene', true, false, 'case/CaseClosed_final_' + BasicGame.global.final_chara_route);
        }, this);
    }
};