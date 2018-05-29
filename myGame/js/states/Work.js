BasicGame.Work = function (game) {};

BasicGame.Work.prototype = {
    preload: function() {
        console.log('Work: preload');
        this.time.advancedTiming = true;

        // load images (no sprite atlas right now)
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

        // load bgm and sfx (now loaded in boot)
        //this.load.audio('bgm_touhou_stolen', 'assets/audio/bgm/ravel_nightstar_the_drums_and_bass_of_flower_bless.ogg');
        //this.load.audio('bgm_wonder_zone', 'assets/audio/bgm/Enter_the_WONDER_ZONE.ogg');
        //this.load.audio('sfx_player_laser', 'assets/audio/sfx/sfx_player_shot_laser.ogg');
        this.load.audio('sfx_enemy_death', 'assets/audio/sfx/sfx_enemy_death.ogg');
    },
    create: function () {
        console.log('Work: create');

        //Initialize lives based on the player's fatigue
        this.lives = Math.max(1, 3 - Math.floor((BasicGame.global.player_stats.fatigue - 1) / 2));

        // enable physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // add location bg
        this.add.sprite(0, 0, 'bg_agency');

        // add background/frame
        this.frame = this.add.sprite(200, 16, 'frame');
        // this.frame.tint = '0xfacade';
        this.hexagons = this.add.tileSprite(204, 20, 804, 684, 'hexagons');
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

        game.physics.arcade.setBounds(this.frame.x+8, this.frame.y+16, this.frame.width-32, this.frame.height-32);

        // create enemy group
        this.enemyGroup = this.add.group();

        // create the player sprite from the player prefab
        this.player = new Player(game, this.lives, this.enemyGroup);
        this.add.existing(this.player);
        this.player.body.collideWorldBounds = true; // player can't move outside of frame

        // create and spawn the boss enemy
        this.boss = new EnemyAI(game, this.world.width / 2, -300, 'boss', BasicGame.global.case.boss.curr_health, this.player, 150, 1500, EnemyAI['AI_' + BasicGame.global.case.boss.ai_pattern]);
        this.add.existing(this.boss);
        this.enemyGroup.add(this.boss);

        // spawn an enemy (placement not final)
        // EXAMPLE CODE FOR SPAWNING ENEMIES HERE
        this.spawnEnemy = function () {
            let xPos = game.rnd.integerInRange(80, game.width - 300);
            let yPos = game.rnd.integerInRange(60, game.height - 500);
            //Movement pattern of null makes the enemy stay still
            var enemy = new EnemyShooter(game, xPos, yPos, 'enemy', 3, this.player, null, EnemyShooter.shootingPattern_spiral, 150, 100);
            this.add.existing(enemy);
            this.enemyGroup.add(enemy);
            enemy = new EnemyShooter(game, xPos + 100, yPos, 'enemy', 3, this.player, Enemy.movementPattern_followTarget, EnemyShooter.shootingPattern_shootAtTarget, 150, 2000);
            this.add.existing(enemy);
            this.enemyGroup.add(enemy);
            enemy = new Enemy(game, game.rnd.integerInRange(80, game.width - 300), game.rnd.integerInRange(60, game.height - 2000), 'enemy', 3, this.player, Enemy.movementPattern_followTarget);
            this.add.existing(enemy);
            this.enemyGroup.add(enemy);
        }

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

        // some text for the players
        var textStyle = { fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: 200 };
        this.add.text(this.frame.x+this.frame.width+10, 40, 'Use arrow keys to move, SPACEBAR to shoot. Move to next stage via death or after 15 seconds.', textStyle);

        // timer before going on to the next stage
        this.game.time.events.add(60000, this.workEnd, this);
    },
    update: function () {
        this.hexagons.tilePosition.x += .1;
        this.hexagons.tilePosition.y += 1;

        // debug information
        this.game.debug.text(this.time.fps || '--', 2, 14, "#00ff00");
        this.physics.arcade.collide(this.player, this.frameBounds);

        if (!this.boss.alive) {
            this.workEndBossDeath();
        }

        if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER) || !this.player.alive){ // temporary code just to progress through the states for now
            this.workEnd();
        }
    },
    render: function () {
        if(this.player.showHitbox)
            game.debug.body(this.player);
        //if (Enemy.bulletGroup != null)
        //    game.debug.physicsGroup(Enemy.bulletGroup); 
        // game.debug.body(this.player);

        //Create some debug health text
        game.debug.text('Health = ' + this.player.currHealth, this.player.x, this.player.y, { fontSize: '32px', fill: '#00ee00' });

        //Create some debug health text
        game.debug.text('Boss Health = ' + this.boss.currHealth, this.boss.x, this.boss.y, { fontSize: '32px', fill: '#ff0000' });
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
            this.camera.onFadeComplete.add(function(){
                this.state.start('Bedtime');
            }, this);
    },
    workEndBossDeath: function () {
        BasicGame.global.case = undefined;
        Player.bulletGroup = null;
        Enemy.bulletGroup = null;
        this.camera.fade('#000');
        this.camera.onFadeComplete.add(function () {
            this.state.start('Cutscene', true, false, 'case/CaseClosed_' + (BasicGame.global.case_number));
        }, this);
    }
};