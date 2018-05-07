// I imagine this as some sort of on-the-way to work kind of cutscene

BasicGame.Cutscene = function (game) {};

BasicGame.Cutscene.prototype = {
    init: function (sceneKey)
    {
        //Set the scene name (json file path) from the place that started the scene
        this.sceneName = sceneKey;
    },
	preload: function() {
		console.log('Cutscene: preload');
        //debug assets
        this.load.image('locke_default', 'assets/img/characters/templocke.png');
        this.load.image('locke_default_pixel', 'assets/img/characters/templocke_pixel.png');
        this.load.image('bg_agency', 'assets/img/bg/bg_agency.png');
        //load text box and fonts
        this.load.image('textbox', 'assets/img/ui/textbox.png');
        this.load.bitmapFont('btmfont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        // preload scene
        this.load.text('scene', 'js/scenes/' + this.sceneName + '.json');
	},

	create: function() {
		// initialize some variables/parameters
        this.TEXT_SPEED = 30; // 20ms per char

		console.log('Cutscene: create');
		this.stage.backgroundColor = "#aaaaaa";

		// scenes and scenes and scenes
        this.scene = JSON.parse(this.game.cache.getText('scene'));

        //load the initial bg
        this.bg = this.add.sprite(0, 0, this.scene.bg);

        // load the left character (usually locke)
        this.leftChara = this.add.sprite(this.world.width - 750, 570, this.scene.sprite_left);
        this.leftChara.anchor.setTo(1, 1);

        // load the right character (usually the-one-who-is-not-locke)
        this.rightChara = this.add.sprite(this.world.width - 500, 570, this.scene.sprite_right);
        this.rightChara.anchor.setTo(0, 1);

        // place the textbox
        this.textbox = this.add.sprite(25, 545, 'textbox');

        // initialize the textbox text
        this.btmText = this.add.bitmapText(40, 590, 'btmfont', '', 24); // 24 is the fontSize
        this.btmText.maxWidth = 800;
        this.game.cache.getBitmapFont('btmfont').font.lineHeight = 30; // change line spacing in a more roundabout way

        // initialize the nameTag text
        this.nameText = this.add.bitmapText(40, 548, 'btmfont', 'NAME', 24); // 24 is the fontSize
        this.nameText.maxWidth = 200;

        //Move the character sprites up in the render order
        this.world.moveUp(this.leftChara);
        this.world.moveUp(this.rightChara);

        // Start the scene
        this.textLine = -1;//current line in the scene
        this.charNum = 0; //current character of the line text
        this.textRun = false; //is text scrolling?
        this.advanceTextBox(); //show the first line of text (and trigger functions, and stuff)
        //Bind the text scrolling event to a timed event
        this.game.time.events.loop(this.TEXT_SPEED, this.unfoldDialogue, this);

        //Bind the line advancing function to the spacebar
        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.advanceTextBox, this);
	},

    update: function () {
		// press ENTER to proceed to the next state
		// Choosing to hang means you'll skip any chance evening events but I realize you can still get morning events huh...
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('Bedtime');
		}
	},
    unfoldDialogue: function () {
        if (this.textRun == true) {
            var line = this.scene.lines[this.textLine];
            // sprite dimming
            var dimColor = 0x555555;
            this.leftChara.tint = (line.pos == "l" ? 0xffffff : dimColor);
            this.rightChara.tint = (line.pos == "r" ? 0xffffff : dimColor);
            // show dialogue text
            if (line.text[this.charNum] != undefined) {
	            this.btmText.text += line.text[this.charNum];
	            this.charNum++;
	        }else{
	        	this.textRun = false;
	        }
		}
    },
    advanceTextBox: function () {
        // if there is still text unfolding, just load the whole thing
        if (this.textRun == true) {
            this.btmText.text = this.scene.lines[this.textLine].text;
            this.textRun = false;
        }
        else if (this.scene.lines[this.textLine + 1] != undefined) { // else load next line
            this.textLine++;
            this.charNum = 0;
            this.btmText.text = "";
            this.nameText.text = this.scene.lines[this.textLine].name;
            //Call all funtions (currently happens at line beginning)
            if (this.scene.lines[this.textLine].functions != undefined) {
                for (let i = 0; i < this.scene.lines[this.textLine].functions.length; i++) {
                    eval(this.scene.lines[this.textLine].functions[i]);
                }
            }
            this.textRun = true; 
        } else { // else clear textbox and end conversation (if no more lines)
            this.textbox.visible = false;
            this.btmText.text = "";
            this.state.start('Bedtime');
        }
    }
};
