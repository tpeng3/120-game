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
        this.load.image('textbox', 'assets/img/textbox.png');
        this.load.bitmapFont('btmfont', 'assets/img/font.png', 'assets/img/font.fnt');

		// if we want to do bitmap fonts
		// this.load.bitmapFont('btmfont', 'assets/img/font.png', 'assets/img/font.fnt');
        // preload script
        this.load.text('script', 'js/Script.json');
	},

	create: function() {
		// initialize some variables/parameters
		this.TEXT_SPEED = 20; // 20ms per char

		console.log('DaytimeHang: create');
		this.stage.backgroundColor = "#cccccc";

		// scripts and scripts and scripts
        this.script = JSON.parse(this.game.cache.getText('script'));

        // load the sprites
        this.locke = this.add.sprite(25, 480, 'locke');
        this.locke.anchor.setTo(1, 1);
        this.locke.visible = false;
        // var character = idk whatever character Locke is speaking with
        this.chara = this.add.sprite(this.world.width - 25, 480, character);
        this.chara.anchor.setTo(0, 1);
        this.chara.visible = false;

        // place the textbox (but keep it hidden)
        this.textbox = this.add.sprite(25, 480, 'key', 'textbox');
        this.textbox.visible = false;

        // initialize the text
        this.btmText = this.add.bitmapText(150, 500, 'btmfont', '', 24); // 24 is the fontSize
        this.btmText.maxWidth = 800;
        this.game.cache.getBitmapFont('btmfont').font.lineHeight = 30; // change line spacing in a more roundabout way

        this.world.moveUp(this.locke);
        this.world.moveUp(this.chara);

        // Start the first dialogue event
        textKey = Math.round(Math.random() * 10); // here I'll just spew random lines from harold
        textLine = 0;
        charNum = 0;
        this.textRun = false;
        this.game.time.events.loop(this.TEXT_SPEED, this.unfoldDialogue, this, textKey, textLine, charNum);
	},

	update: function () {
        //DIALOGUE BOX CODE HERE (if spacebar, sceneData.lines[++currLine]);
        if(this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
        	// if there is still text unfolding, just load the whole thing
        	if(this.textRun == true){
        		this.btmText.text = this.script[textKey][textLine].dialogue;
        	}
			// if there are more lines to read in a conversation
	        }else if(this.script[textKey][textLine+1] != undefined){
                textLine++;
                charNum = 0;
                this.btmText.text = "";  
	        // else clear textbox and end conversation
	        }else{
                this.textbox.visible = false;
                this.btmText.text = "";
                // evaluate the function from the dialogue if there is one
                if(line.function != undefined){
                    eval(line.function);
                }
	        }
        
		// press ENTER to proceed to the next state
		// Choosing to hang means you'll skip any chance evening events but I realize you can still get morning events huh...
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Bedtime');
		}
	},
	unfoldDialogue: function(){
		if(this.textRun == true){
			// show sprites
			// of course, we'll change this visibility effect later when I get some sprites in
	        this.locke.visible = (line.sprite == "locke"? true : false);
	        this.chara.visible = (line.sprite == character? true : false);

	        // function argument variables: textKey, textLine, charNum
	        var line = this.script[textKey][textLine];
	        // show dialogue text
	        if(line.dialogue[charNum] != undefined){
	            this.btmText.text += line.dialogue[charNum];
	            charNum++;
	        }else{
	        	this.textRun = false;
	        }
		}
    }
};
