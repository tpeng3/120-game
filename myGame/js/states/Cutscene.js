// I imagine this as some sort of on-the-way to work kind of cutscene

BasicGame.Cutscene = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.Cutscene.prototype = {
    loadSceneData: function (key) {
        //load scene data from .js file
        //.js file will contain:
        //filename is eventNum e.g rivalHangout1, caseGet1, friendMorningInterrupt1, etc
        //sceneName: any string
        //time: morning,day,night
        //background: any string.png
        //bgm: any string.ogg
        //lines: an array of line objects to be fed to the textbox
    },
    sceneData: Object.freeze({
        0121: loadSceneData('friendHangout0'),
    }),

    init: function (sceneKey)
    {
        scene = sceneData[sceneKey];
        currLine = 0;
    },
	preload: function() {
		console.log('Cutscene: preload');
		// load background assets of a generic daytime place and the textbox
	},

	create: function() {
		console.log('DaytimeHang: create');
		this.stage.backgroundColor = "#cccccc";
		// scripts and scripts and scripts
	},

	update: function () {
        //DIALOGUE BOX CODE HERE (if spacebar, sceneData.lines[++currLine]);

		// press ENTER to proceed to the next state
		// Choosing to hang means you'll skip any chance evening events but I realize you can still get morning events huh...
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Bedtime');
		}
	}
	
};
