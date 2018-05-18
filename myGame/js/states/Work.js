BasicGame.Work = function (game) {};

BasicGame.Work.prototype = {
    preload: function() {
        console.log('Work: preload');
        this.time.advancedTiming = true;

        // load images (no sprite atlas right now)
        this.load.image('bh_locke', 'assets/img/bh/bh_locke.png');
        this.load.image('locke_bullet', 'assets/img/bh/bh_bullet_locke.png');
        this.load.image('enemy_bullet', 'assets/img/bh/bh_bullet_bright.png');
        this.load.image('enemy_bullet_l', 'assets/img/bh/bh_bullet_lbright.png');
        this.load.image('enemy', 'assets/img/bh/bh_enemy.png');
        this.load.image('boss', 'assets/img/bh/' + BasicGame.global.case.boss.sprite + '.png');
        this.load.image('frame', 'assets/img/ui/ui_bhframe.png');

        // load bgm and sfx
        this.load.audio('bgm_touhou_stolen', 'assets/audio/bgm/ravel_nightstar_the_drums_and_bass_of_flower_bless.ogg');
        this.load.audio('sfx_player_laser', 'assets/audio/sfx/sfx_player_shot_laser.ogg');
        this.load.audio('sfx_enemy_death', 'assets/audio/sfx/sfx_enemy_death.ogg');
    },
    create: function () {
        console.log('Work: create');

        //Initialize lives based on the player's fatigue
        this.lives = Math.max(1, 3 - Math.floor((BasicGame.global.player_stats.fatigue - 1) / 2));

        // enable physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // add background/frame, I'm actually going to seperate this into two images later I think
        this.add.sprite(0, 0, 'frame');
        game.physics.arcade.setBounds(80, 60, 900, 600); // gonna change these to parameters later when I redraw the bg

        // create enemy group
        this.enemyGroup = this.add.group();

        // create the player sprite from the player prefab
        this.player = new Player(game, this.lives, this.enemyGroup);
        this.add.existing(this.player);
        this.player.body.collideWorldBounds = true; // player can't move outside of frame

        // create and spawn the boss enemy
        this.boss = new EnemyShooter(game, this.world.width / 2, -300, 'boss', BasicGame.global.case.boss.curr_health, this.player, null, EnemyShooter.shootingPattern_flower, 150, 1500);
        this.add.existing(this.boss);
        this.enemyGroup.add(this.boss);

        // spawn an enemy (placement not final)
        // EXAMPLE CODE FOR SPAWNING ENEMIES HERE
        this.spawnEnemy = function () {
            let xPos = game.rnd.integerInRange(80, game.width - 300);
            let yPos = game.rnd.integerInRange(60, game.height - 500);
            //Movement patter of null makes the enemy stay still
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

        // spawn debug enemies (on a timer) (NOT ON A TIMER RIGHT NOW FOR OTHER DEBUG REASONS)
        this.game.time.events.add(1000, this.spawnEnemy, this);

        // LOL I TOTALLY DIDN'T STEAL THIS AMAZING MUSIC
        game.sound.stopAll();
        bgm = game.add.audio(BasicGame.global.case.bgm);
        bgm.loopFull()

        // some text for the players
        var textStyle = { fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: 200 };
        this.add.text(1000, 40, 'Use arrow keys to move, SPACEBAR to shoot. Move to next stage via death or after 15 seconds.', textStyle);

        // timer before going on to the next stage
        this.game.time.events.add(45000, this.workEnd, this);
    },
    update: function () {
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