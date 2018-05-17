BasicGame.TitleScreen = function (game) {
	this.music = null;
	//this.playButton = null;
};
BasicGame.TitleScreen.prototype = {
	preload: function() {
		console.log('TitleScreen: preload');
		// basically load a title screen image and assets
		this.load.image('bg_black', 'assets/img/bg/bg_black.png');
	},
	create: function() {
		console.log('TitleScreen: create');
		this.stage.backgroundColor = "#000";

		// set fullscreen when you click on the game window
		// I'll keep this commented out while debugging because otherwise it's a pain
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.input.onDown.add(this.goFullscreen, this);

        var titleText = this.add.text(this.world.width/2, this.world.height/2, '(Insert Title Screen Here)\nPress SPACEBAR to start.\n\n*Clicking on the game will start in Fullscreen. \nThis is a one-time thing, use keyboard keys to play!\n\nIn the "work" portion, keep in mind\n that you will use arrow keys, SPACEBAR, and SHIFT.', { fontSize: '32px', fill: '#fff' });
		titleText.anchor.setTo(0.5);
		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		//this.add.sprite(0, 0, 'titlepage');

		// Capture certain keys to prevent their default actions in the browser.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER,
            Phaser.Keyboard.SHIFT
        ]);
	},
	update: function () {
		// press ENTER to proceed to the Calendar state
		if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			this.camera.fade('#000');
			this.camera.onFadeComplete.add(function(){
                // this.state.start('ActivityDecision');
                this.state.start('Cutscene', true, false, 'Intro_0')
			}, this);
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
