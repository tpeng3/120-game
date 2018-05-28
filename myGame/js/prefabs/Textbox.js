// Textbox prefab constructor function
function Textbox(game, changeState, scene, lines) {
    this.changeState = changeState;
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height - 25, 'bg_black', 0);
    //Sprite stuff
    this.anchor.setTo(0.5, 1);
    this.scale.setTo(1252, 160);
    this.alpha = 0.85;
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
    this.leftChara = this.callbackGame.add.sprite(350, this.callbackGame.world.height, this.scene.sprite_left, "");
    this.leftChara.anchor.setTo(0.5, 1);
    // add the right character (usually the-one-who-is-not-locke)
    // going to move the sprites down by a few pixels but will update the spritesheets later
    this.rightChara = this.callbackGame.add.sprite(this.callbackGame.world.width - 350, this.callbackGame.world.height+20, this.scene.sprite_right);
    this.rightChara.anchor.setTo(0.5, 1);

    // a black screen for reasons
    this.black = this.callbackGame.add.sprite(0, 0, 'bg_black');
    this.black.scale.setTo(this.callbackGame.world.width, this.callbackGame.world.height);
    this.black.visible = false;

    //add textbox to game (here for layering purposes)
    game.add.existing(this);

    // initialize the nameTag text
    this.nameText = this.callbackGame.add.text(this.left + 80, this.top + 20, '', { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
    // initialize the textbox text
    var textStyle = { font: 'Trebuchet MS', fontSize: '28px', fill: '#fff', wordWrap: true, wordWrapWidth: this.width - 200 };
    this.bodyText = this.callbackGame.add.text(this.left + 150, this.top + 60, '', textStyle);
    this.bodyText.lineSpacing = -8;
    // initialize the ctc (aka a blinking spacebar text to indicate next line)
    this.ctc = this.callbackGame.add.text(this.right-20, this.bottom-10, '[SPACEBAR]', textStyle);
    this.ctc.anchor.set(1);
    this.ctc.visible = false;
    // this.callbackGame.add.tween(this.ctc).to( { y: this.ctc.y-10 }, 200, Phaser.Easing.Linear.None, true, 0, 400, true);

    // this.game.time.events.loop(1000, function(){
    //     this.ctc.alpha = (this.ctc.alpha == 0? 1 : 0);
    // }, this);

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
        var italcount;
        // show dialogue text
        if (line.text[this.charNum] != undefined) {
            // check for text italics
            // jk italics was a mistake, it's not noticeable enough for all the effort
            // if(line.text.substring(this.charNum, this.charNum+3) == '[i]'){
            //     this.bodyText.addFontStyle('italic bold', this.charNum);
            //     this.charNum += 3;
            // }else if(line.text.substring(this.charNum, this.charNum+4) == '[/i]'){
            //     this.bodyText.addFontStyle('normal', this.charNum);
            //     this.charNum += 4;
            // }

            this.bodyText.text += line.text[this.charNum];
            this.charNum++;
            this.textScrollSfx.stop();
            this.textScrollSfx.play();
        } else {
            // add space to continue indicator
            this.ctc.visible = true;
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
        this.ctc.visible = false;
        this.textLine++;
        this.charNum = 0;
        var line = this.scene.lines[this.textLine];
        this.bodyText.text = "";
        // this.bodyText.addFontStyle('normal', 0); // reverting the styles back 
        this.nameText.text = line.name;
        // Call all funtions (currently happens at line beginning)
        if (line.functions != undefined) {
            for (let i = 0; i < line.functions.length; i++) {
                eval(line.functions[i]);
            }
        }
        // change character sprite expression
        if(line.expression != undefined){
            var chara = (line.name == this.leftChara.key? this.leftChara : this.rightChara);
            chara.frameName = line.name + '_' + line.expression;
        }
        // sprite dimming
        var dimColor = 0x555555;
        var name = this.scene.lines[this.textLine].name;
        this.leftChara.tint = ( (name == "") || (name == this.scene.sprite_left) ? 0xffffff : dimColor);
        this.rightChara.tint = ( (name == "") || (name == this.scene.sprite_right) ? 0xffffff : dimColor);
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