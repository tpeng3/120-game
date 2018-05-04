// I imagine this as some sort of on-the-way to work kind of cutscene

BasicGame.DaytimeHang = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.DaytimeHang.prototype = {
	preload: function() {
		console.log('DaytimeHang: preload');
		// load background assets of a generic daytime place and the textbox
	},

	create: function() {
		console.log('DaytimeHang: create');
		this.stage.backgroundColor = "#cccccc";
		// scripts and scripts and scripts
	},

	update: function () {
		// considering daytime hangouts are longer cutscenes well, g o o d l u c k coding that

		// press ENTER to proceed to the next state
		// Choosing to hang means you'll skip any chance evening events but I realize you can still get morning events huh...
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Bedtime');
		}
	}
	
};