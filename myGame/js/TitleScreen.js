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

		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		//this.add.sprite(0, 0, 'titlepage');
	},

	update: function () {
		// press ENTER to proceed to the Calendar state
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Calendar');
		}
	}

};
