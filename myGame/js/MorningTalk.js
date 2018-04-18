// I imagine this as some sort of on-the-way to work kind of cutscene

BasicGame.MorningTalk = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.MorningTalk.prototype = {
	preload: function() {
		console.log('MorningTalk: preload');
		// load background asset of the agency and the textbox
	},

	create: function() {
		console.log('MorningTalk: create');
		this.stage.backgroundColor = "#bbbbbb";
		// pick which script to print I guess?
	},

	update: function () {
		// generate some flavor text thing about the other characters

		// press ENTER to proceed to the next state
		// go back to MorningClient to decide what to do with the day
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('MorningClient');
		}
	}
	
};
