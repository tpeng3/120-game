// Hooray for more interactions and choices, and fake social media messages/text
// And stat level ups

BasicGame.Bedtime = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.Bedtime.prototype = {
	preload: function() {
        console.log('Bedtime: preload');
		// load phone screen image ... and textbox.... and b-bedroom image bg? and level up screens
	},

	create: function() {
        console.log('Bedtime: create');
        game.sound.stopAll(); 
		this.stage.backgroundColor = "#9842df";
	},

	update: function () {
		// idk when do you guys want to pull out the stats, when the mc enters the room?
		// or when they're asleep? mystery...

		// what I would REALLY love would be like, an small pixel room with the mc and you can move around and
		// interact with the furniture in the room for random flavor text
		// and then pressing 'z' in front of the bedside table will open up the phone conversations with other characters
		// and pressing 'z' in front of the bed => next day
		// I can do pixel art for small rooms so this isn't too ambitious right...

		// press ENTER to proceed to the next state
		// decide here whether that state should be MorningClient, MorningTalk, DaytimeWork or DaytimeHang
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			// if mc finished case, the client flag should be false and state 100% goes to MorningClient
			// OR
			// if it's a something% chance that a morning event doesn't trigger, also go to MorningClient
			// so the player can decide whether they want to work on the case or hang out with people

            // another day begins
            calendar.nextDay();
			this.state.start('ActivityDecision');
		}
	}

};
