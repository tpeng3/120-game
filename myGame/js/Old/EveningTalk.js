// More random character interactions wow

BasicGame.EveningTalk = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.EveningTalk.prototype = {
	preload: function() {
		console.log('EveningTalk: preload');
		// load background asset of the agency and the textbox
	},

	create: function() {
		console.log('EveningTalk: create');
		this.stage.backgroundColor = "#654321";
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
