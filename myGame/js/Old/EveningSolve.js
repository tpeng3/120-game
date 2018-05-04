// More visual novel-y interface where the mc gets all dramatic in their reveal of the culprit... or something but not really,

BasicGame.EveningSolve = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.EveningSolve.prototype = {
	preload: function() {
		console.log('EveningSolve: preload');
		// load background asset of the agency and the textbox
	},

	create: function() {
		console.log('EveningSolve: create');
		this.stage.backgroundColor = "#225578";
		// pick which script to print I guess?
	},

	update: function () {
		// flavor text flavor text

		// press ENTER to proceed to the next state
		// Bedtime is the only option
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Bedtime');
		}
	}

};
