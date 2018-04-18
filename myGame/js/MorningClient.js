// I'm imagining like a sorta visual novel-y interface where the player hears some whacky case from a client
// or wakes up and decides what they want to do for the day

BasicGame.MorningClient = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.MorningClient.prototype = {
	preload: function() {
		console.log('MorningClient: preload');
		// load background asset of the agency and the textbox
	},

	create: function() {
		console.log('MorningClient: create');
		this.stage.backgroundColor = "#aaaaaa";
		// pick which script to print I guess?
	},

	update: function () {
		if(this.client == false)
			// throw in some flavor text about some new case the mc has to solve
			this.client == true;

		// press ENTER to proceed to the next state
		// decide here whether that state should be DaytimeWork or DaytimeHang, based on player's choice
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('DaytimeWork');
		}
		// ofc enter and spacebar are temp buttons
		if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			this.state.start('DaytimeHang');
		}
	}

};
