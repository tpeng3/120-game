// add the states to Basic Game
var BasicGame = {};

BasicGame.TitleScreen = function (game) {
	//this.music = null;
	//this.playButton = null;
};
BasicGame.TitleScreen.prototype = {
	preload: function() {
		console.log('TitleScreen: preload');
		// basically load a title screen image and assets
	},
	create: function() {
		console.log('TitleScreen: create');
		this.stage.backgroundColor = "#ccddaa";

		// set fullscreen when you click on the game window
		// I'll keep this commented out while debugging because otherwise it's a pain
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.input.onDown.add(this.goFullscreen, this);

        var titleText = this.add.text(this.world.width/2, this.world.height/2, '(Insert Title Screen Here)\nPress ENTER to start.\n\n*Clicking on the game will start in Fullscreen.', { fontSize: '32px', fill: '#000' });
		titleText.anchor.setTo(0.5);
		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		//this.add.sprite(0, 0, 'titlepage');
	},
	update: function () {
		// press ENTER to proceed to the Calendar state
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('ActivityDecision');
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
