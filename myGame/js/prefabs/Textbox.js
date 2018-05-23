// Textbox prefab constructor function
function Textbox(game, changeState, scene, lines) {
    this.changeState = changeState;
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height - 10, 'textbox', 0);
    //Sprite stuff
    this.anchor.setTo(0.5, 1);
    this.alpha = 0.75
    //Game and scene stuff
    this.callbackGame = game;
    //set scene of make dummy scene if null
    if (scene != null)
        this.scene = scene;
    else {
        this.scene = {
            lines: lines,
            sprite_left: "",
            sprite_right: ""
        }
    }
    // create SFX
    this.textScrollSfx = game.add.audio('sfx_text_scroll');
    // add the left character (usually locke)
    this.leftChara = this.callbackGame.add.sprite(150, this.callbackGame.world.height, this.scene.sprite_left);
    this.leftChara.anchor.setTo(0, 1);
    // add the right character (usually the-one-who-is-not-locke)
    this.rightChara = this.callbackGame.add.sprite(this.callbackGame.world.width - 150, this.callbackGame.world.height, this.scene.sprite_right);
    this.rightChara.anchor.setTo(1, 1);

    //add textbox to game (here for layering purposes)
    game.add.existing(this);

    // initialize the nameTag text
    this.nameText = this.callbackGame.add.text(this.left + 60, this.top + 20, '', { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
    // initialize the textbox text
    var textStyle = { font: 'Trebuchet MS', fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: this.width - 200 };
    this.bodyText = this.callbackGame.add.text(this.left + 100, this.top + 60, '', textStyle);
    this.bodyText.lineSpacing = -8;

    // Start the scene
    this.textLine = -1;// current line in the scene
    this.charNum = 0; // current char of the line text
    this.textRun = false; // text scrolling
    this.firstTalker = this.scene.lines[0].name; // To get rid of that l/r pos thing
    //Bind the text scrolling event to a timed event
    this.callbackGame.time.events.loop(Settings.TEXT_SCROLL_DELAY, this.unfoldDialogue, this);
    this.advance(); // show the first line of text (and trigger functions, and stuff)
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Textbox)
Textbox.prototype = Object.create(Phaser.Sprite.prototype);
Textbox.prototype.constructor = Textbox;

Textbox.prototype.unfoldDialogue = function () {
    if (this.textRun == true) {
        var line = this.scene.lines[this.textLine];
        // show dialogue text
        if (line.text[this.charNum] != undefined) {
            this.bodyText.text += line.text[this.charNum];
            this.charNum++;
            this.textScrollSfx.stop();
            this.textScrollSfx.play();
        } else {
            this.textRun = false;
        }
    }
}

Textbox.prototype.advance = function () {
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
        // change character sprite expression
        if(this.scene.lines[this.textLine].)
        // sprite dimming
        var dimColor = 0x555555;
        this.leftChara.tint = (this.scene.lines[this.textLine].name == this.firstTalker ? 0xffffff : dimColor);
        this.rightChara.tint = (this.scene.lines[this.textLine].name == this.firstTalker ? dimColor : 0xffffff);
        this.textRun = true;
    } else { // else end conversation (if no more lines)
        if (this.changeState) {
            this.callbackGame.camera.fade('#000');
            this.callbackGame.camera.onFadeComplete.add(function () {
                this.callbackGame.state.start(this.scene.next_state);
            }, this);
        }
    }
}

Textbox.prototype.startNewScene = function (changeState, scene, lines) {
    this.textRun = false;
    this.changeState = changeState;
    //set scene of make dummy scene if null
    if (scene != null)
        this.scene = scene;
    else {
        this.scene = {
            lines: lines,
            sprite_left: "",
            sprite_right: ""
        }
    }
    // Start the scene
    this.textLine = -1;// current line in the scene
    this.charNum = 0; // current char of the line text
    this.textRun = false; // text scrolling
    this.firstTalker = this.scene.lines[0].name; // To get rid of that l/r pos thing
    this.advance(); // show the first line of text (and trigger functions, and stuff)
}

Textbox.prototype.skipScene = function () {
    this.callbackGame.camera.fade('#000');
    this.callbackGame.camera.onFadeComplete.add(function () {
        this.callbackGame.state.start(this.scene.next_state);
    }, this);
}