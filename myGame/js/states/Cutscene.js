BasicGame.Cutscene = function (game) {};

BasicGame.Cutscene.prototype = {
    init: function (sceneKey)
    {
        this.stage.backgroundColor = "#000";

        //Set the scene name (json file path) from the place that started the scene
        this.sceneName = sceneKey;
        console.log('starting scene: ' + sceneKey);
    },
	preload: function() {
		console.log('Cutscene: preload');
        // load backgrounds
        this.load.image('bg_agency', 'assets/img/bg/bg_agency.png');

        // load the sprites
        this.load.image('locke_default', 'assets/img/characters/vn_locke.png');
        this.load.image('locke_posing', 'assets/img/characters/vn_locke2draft.png');
        this.load.image('keyna_default', 'assets/img/characters/vn_keyna.png');
        this.load.image('tai_default', 'assets/img/characters/vn_tai.png');
        this.load.image('fedelynn_default', 'assets/img/characters/vn_fedelynn.png');

        // load textbox and font
        this.load.image('textbox', 'assets/img/ui/textbox.png');

        // load script
        this.load.text('scene', 'js/scenes/' + this.sceneName + '.json');

        // load music and sfx
        this.load.audio('bgm_temp_locke', 'assets/audio/bgm/Locke_And_Load.ogg');
        this.load.audio('bgm_temp_talk', 'assets/audio/bgm/yoiyaminoseaside.mp3');
        this.load.audio('sfx_text_scroll', 'assets/audio/sfx/sfx_text_scroll4.ogg');
	},
    create: function () {
        game.sound.stopAll(); 

        // create SFX
        this.textScrollSfx = game.add.audio('sfx_text_scroll');

		console.log('Cutscene: create');

		// parse the scene script
        this.scene = JSON.parse(this.game.cache.getText('scene'));

        // add music, it'll be late but I'm lazy rn to change that
        var bgm = game.add.audio(this.scene.bgm);
        bgm.loopFull()

        // what does the cutscene transition to
        this.nextState = this.scene.next_state;

        // add the initial bg
        this.bg = this.add.sprite(0, 0, this.scene.bg);

        // add the left character (usually locke)
        this.leftChara = this.add.sprite(150, this.world.height, this.scene.sprite_left);
        this.leftChara.anchor.setTo(0, 1);
        // add the right character (usually the-one-who-is-not-locke)
        this.rightChara = this.add.sprite(this.world.width - 150, this.world.height, this.scene.sprite_right);
        this.rightChara.anchor.setTo(1, 1);

        // place the textbox
        var textbox = this.add.sprite(this.world.width/2, this.world.height - 10, 'textbox');
        textbox.anchor.setTo(0.5, 1);
        textbox.alpha = 0.75

        // initialize the nameTag text
        this.nameText = this.add.text(textbox.left+60, textbox.top+20, '', {font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff'});

        // initialize the textbox text
        var textStyle = { font: 'Trebuchet MS', fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: textbox.width-200 };
        this.bodyText = this.add.text(textbox.left+100, textbox.top+60, '', textStyle);
        this.bodyText.lineSpacing = -8;

        // place the dateTimeBox
        var dateBox = this.add.sprite(textbox.left, 20, 'textbox');
        dateBox.anchor.setTo(0, 0);
        dateBox.scale.x = 0.27;
        dateBox.scale.y = 0.25;
        dateBox.alpha = 0.75

        // initialize the dateTime text
        this.dateText = this.add.text(textbox.left + 60, 20, calendar.print(), { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });

        // Start the scene
        this.textLine = -1;// current line in the scene
        this.charNum = 0; // current char of the line text
        this.textRun = false; // text scrolling
        this.firstTalker = this.scene.lines[0].name; // To get rid of that l/r pos thing
        //Bind the text scrolling event to a timed event
        this.game.time.events.loop(Settings.TEXT_SCROLL_DELAY, this.unfoldDialogue, this);
        this.advanceTextBox(); // show the first line of text (and trigger functions, and stuff)

        //Bind the line advancing function to the spacebar
        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.advanceTextBox, this);

        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
	},
    update: function () {
		// press ENTER to skip to the next state
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start(this.nextState);
		}
	},
    unfoldDialogue: function () {
        if (this.textRun == true) {
            var line = this.scene.lines[this.textLine];

            // sprite dimming
            var dimColor = 0x555555;
            this.leftChara.tint = (line.name == this.firstTalker? 0xffffff : dimColor);
            this.rightChara.tint = (line.name == this.firstTalker? dimColor : 0xffffff);

            // show dialogue text
            if (line.text[this.charNum] != undefined) {
	            this.bodyText.text += line.text[this.charNum];
                this.charNum++;
                this.textScrollSfx.stop();
                this.textScrollSfx.play();
	        }else{
	        	this.textRun = false;
	        }
		}
    },
    advanceTextBox: function () {
        // if there is still text unfolding, just load the whole thing
        if (this.textRun == true) {
            this.bodyText.text = this.scene.lines[this.textLine].text;
            this.textRun = false;
        }
        else if (this.scene.lines[this.textLine + 1] != undefined) { // else load next line
            this.textLine++;
            this.charNum = 0;
            this.bodyText.text = "";
            this.nameText.text = this.scene.lines[this.textLine].name;
            // Call all funtions (currently happens at line beginning)
            if (this.scene.lines[this.textLine].functions != undefined) {
                for (let i = 0; i < this.scene.lines[this.textLine].functions.length; i++) {
                    eval(this.scene.lines[this.textLine].functions[i]);
                }
            }
            this.textRun = true; 
        } else { // else end conversation (if no more lines)
            this.camera.fade('#000');
            this.camera.onFadeComplete.addOnce(function () {
                this.state.start(this.nextState);
            }, this);
        }
    }
};
