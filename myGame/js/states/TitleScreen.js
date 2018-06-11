BasicGame.TitleScreen = function (game) {
	this.music = null;
	//this.playButton = null;
};
BasicGame.TitleScreen.prototype = {
	preload: function() {
		console.log('TitleScreen: preload');
		// basically load a title screen image and assets
		this.load.image('title', 'assets/img/ui/ui_title.png');
		// this is just for transitions
        this.load.image('bg_black', 'assets/img/bg/bg_black.png');
	},
    create: function () {
        game.sound.stopAll();
        //Create and/or reset global object
        BasicGame.global = {
            case_number: -1,
            case: undefined,
            case_flags: {},
            event_flags: {},
            player_stats: {
                fatigue: 0,
                relationships: {
                    Tai: 0,
                    Keyna: 0,
                    Fedelynn: 0
                }
            },
            debug: 0,
            etcrib: 0
        }
        calendar = new Calendar();
        console.log('TitleScreen: create');
        this.stage.backgroundColor = "#000";
        this.typeSfx = game.add.audio('sfx_text_scroll_default');
        // set fullscreen when you click on the game window
        // I'll keep this commented out while debugging because otherwise it's a pain
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.input.onDown.add(this.goFullscreen, this);

        bgm = this.add.audio('bgm_temp_detective', 1, true);
        bgm.play();

        this.add.sprite(0, 0, 'title');

        var titleStyle = { font: 'Consolas', fontSize: '50px', fill: '#fff' };
        var titleText = this.add.text(450, 400, '', titleStyle);
        var subtitle = 'Tactical Schedule Management';
        var charNum = 0;
        this.game.time.events.add(1000, function () {
            this.game.time.events.loop(100, function () {
                if (charNum != subtitle.length) {
                    if (subtitle[charNum] != ' ') {
                        this.typeSfx.stop();
                        this.typeSfx.play();
                    }
                    titleText.text += subtitle[charNum];
                    charNum++;
                }
            }, this);
        }, this);

        var startStyle = { font: 'Trebuchet MS', fontSize: '32px', fill: '#51FFD4' };
        if (BasicGame.save.end_any) {
            var startText = this.add.text(this.world.width / 2, 550, '-Press SPACEBAR to Play Again-', startStyle);
            startText.anchor.set(0.5);
            this.game.time.events.loop(1000, function () {
                startText.visible = (startText.visible == false ? true : false);
            }, this);
            var endSkip = '-Press ENTER to Go Back To Final Case Selection-';
            if (BasicGame.save.end_Fedelynn == 'complete' && BasicGame.save.end_Tai == 'complete' && BasicGame.save.end_Keyna == 'complete') {
                endSkip = 'All Endings are Complete! Locke and their friends are all Happy :)';
            }
            var endSkipText = this.add.text(this.world.width / 2, 680, endSkip, startStyle);
            endSkipText.anchor.set(0.5);
        }
        else {
            var startText = this.add.text(this.world.width / 2, 550, '-Press SPACEBAR to Start-', startStyle);
            startText.anchor.set(0.5);
            startText.visible = false;
            this.game.time.events.add(3000, function () {
                this.game.time.events.loop(1000, function () {
                    startText.visible = (startText.visible == false ? true : false);
                }, this);
            }, this);
        }

		// Capture certain keys to prevent their default actions in the browser.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER,
            Phaser.Keyboard.SHIFT
        ]);

        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game, 1000);
	},
	update: function () {
		// start the game with the cutscene of Intro_0
		if(this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			this.camera.fade('#000');
			this.camera.onFadeComplete.addOnce(function(){
                this.state.start('Cutscene', true, false, 'Intro');
			}, this);
        }
        if (this.input.keyboard.justPressed(Phaser.Keyboard.ENTER) && BasicGame.save.end_any) {
            if (BasicGame.save.date != undefined)
                calendar.date = BasicGame.save.date;
            this.state.start('FinalCaseDecision', true, false);
        }
	},
	goFullscreen: function(){
		if(game.scale.isFullScreen){
			game.scale.stopFullScreen();
		}else{
			game.scale.startFullScreen(false);
		}
	}
};
