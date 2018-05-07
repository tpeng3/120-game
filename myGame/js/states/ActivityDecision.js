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
        this.add.text(this.world.width / 2 - 110, 250, 'Press W to work', { fontSize: '32px', fill: '#00ee00' });
        this.add.text(this.world.width / 2 - 110, 450, 'Press H to hangout', { fontSize: '32px', fill: '#00ee00' });
		// scripts and scripts and scripts
	},

	update: function () {
		// press W to proceed to work
        if (this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.state.start('Work', true, false, calendar.getSceneKey());
        }
        // press H to hangout
        if (this.input.keyboard.isDown(Phaser.Keyboard.H)) {
            this.state.start('Cutscene', true, false, 'testScene');//calendar.getSceneKey());
        }
		// Choosing to hang means you'll skip any chance evening events but I realize you can still get morning events huh...
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Bedtime');
		}
	}
	
};
