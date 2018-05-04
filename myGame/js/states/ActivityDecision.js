// I imagine this as some sort of on-the-way to work kind of cutscene

BasicGame.ActivityDecision = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.ActivityDecision.prototype = {
	preload: function() {
		console.log('ActivityDecision: preload');
		// load background assets of a generic daytime place and the textbox
	},

	create: function() {
		console.log('ActivityDecision: create');
		this.stage.backgroundColor = "#cccccc";
		// scripts and scripts and scripts
	},

	update: function () {
		// press W to proceed to work
        if (this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.state.start(Work, calendar.getSceneData());
        }
        // press H to hangout
        if (this.input.keyboard.isDown(Phaser.Keyboard.H)) {
            this.state.start('Cutscene', calendar.getSceneData());
        }
		// Choosing to hang means you'll skip any chance evening events but I realize you can still get morning events huh...
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Bedtime');
		}
	}
	
};
