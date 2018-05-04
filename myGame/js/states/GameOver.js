
BasicGame.GameOver = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.GameOver.prototype = {
	preload: function() {
		console.log('GameOver: preload');
	},

	create: function() {
		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		//this.music = this.add.audio('titleMusic');
		//this.music.play();
		console.log('GameOver: create');
		this.stage.backgroundColor = "#facade";
		//this.add.sprite(0, 0, 'titlepage');

		//this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

	},

	update: function () {
		//	Do some nice funky main menu effect here

		// press ENTER to switch to MainMenu state
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('MainMenu');
		}
	},

    quitGame: function (pointer) {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    //this.state.start('MainMenu');
    }

};
