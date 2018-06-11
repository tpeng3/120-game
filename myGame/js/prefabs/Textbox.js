// Textbox prefab constructor function
function Textbox(game, changeState, scene, lines, position, anchor, scale, sceneKey) {
    this.changeState = changeState;
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    if (position == undefined || position == null)
        Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height - 25, 'bg_black', 0);
    else
        Phaser.Sprite.call(this, game, position.x, position.y, 'bg_black', 0);
    //Sprite stuff
    if (anchor == null || anchor == undefined)
        var anchor = new Phaser.Point(0.5, 1);
    this.anchor.setTo(anchor.x, anchor.y);
    if (scale == null || scale == undefined)
        var scale = new Phaser.Point(1252, 200);
    this.sceneKey = sceneKey;
    this.scale.setTo(scale.x, scale.y);
    this.alpha = 0.85;
    //Game and scene stuff
    this.callbackGame = game;
    //call the camera
    this.camera = game.camera;
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
    this.textScrollKeys = {
        Locke: 'sfx_text_scroll_locke',
        Tai: 'sfx_text_scroll_tai',
        Keyna: 'sfx_text_scroll_keyna',
        Lynn: 'sfx_text_scroll_fedelynn',
        Fedelynn: 'sfx_text_scroll_fedelynn',
        'Allie Catt': 'sfx_text_scroll_client_f',
        'Sophie Moore': 'sfx_text_scroll_client_f',
        'Client': 'sfx_text_scroll_client_f',
        'Earl Leebird': 'sfx_text_scroll_client_m',
        'Announcer': 'sfx_text_scroll_client_m',
        'Trainger Red': 'sfx_text_scroll_locke',
        'Trainger Blue': 'sfx_text_scroll_keyna',
        'Trainger Yellow': 'sfx_text_scroll_tai',
        'Trainger Black': 'sfx_text_scroll_fedelynn',
        default: 'sfx_text_scroll_default'
    }
    this.skipNum = 4;
    this.playsfx = this.skipNum;
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
    this.nameText = this.callbackGame.add.text(this.left + 250, this.top + 20, '', { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
    this.nameText.anchor.setTo(0.75, 0);
    // initialize the textbox text
    var textStyle = { font: 'Trebuchet MS', fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: this.width - 400 };
    this.bodyText = this.callbackGame.add.text(this.left + 220, this.top + 60, '', textStyle);
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
    this.advance(); // show the first line of text (and trigger functions, and stuff)
    //Bind the text scrolling event to a timed event
    this.callbackGame.time.events.loop(Settings.TEXT_SCROLL_DELAY, this.unfoldDialogue, this);
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
            if (this.playsfx >= this.skipNum) {
                if (this.textScrollSfx.isPlaying)
                    this.textScrollSfx.restart()
                else
                    this.textScrollSfx.play('', 0, 1, false, true);
                this.playsfx = 0;
            }
            else
                ++this.playsfx;
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
        this.ctc.visible = true;
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
        // start the music, if there is an update
        if(line.music != undefined){
            if(line.music.song != undefined){
                bgm = game.add.audio("bgm_" + line.music.song, 1, true);
                let fadeIn = line.music.fadeIn || 0;
                bgm.fadeIn(fadeIn, true);
            }
        }
        // Call all funtions (currently happens at line beginning)
        if (line.functions != undefined) {
            for (let i = 0; i < line.functions.length; i++) {
                eval(line.functions[i]);
            }
        }
        // change character sprite expression
        if(line.expression != undefined){
            let chara = (line.name == this.leftChara.key? this.leftChara : this.rightChara);
            if(line.name == 'Fedelynn') chara.frameName = 'Lynn_' + line.expression; // just for you fedelynn
            else chara.frameName = line.name + '_' + line.expression;
        }
        // sprite dimming
        var dimColor = 0x555555;
        var name = this.scene.lines[this.textLine].name;
        // im being lazy with the name checking
        this.leftChara.tint = ((name == "Locke and Keyna") || (name == "") || (name == this.scene.sprite_left) ? 0xffffff : dimColor);
        this.rightChara.tint = ((name == "Fedelynn") || (name == "Locke and Keyna") || (name == "") || (name == this.scene.sprite_right) ? 0xffffff : dimColor);
        //set talk sfx
        this.playsfx = this.skipNum;
        if (line.text_sfx != undefined)
            this.textScrollSfx = game.add.audio(this.textScrollKeys[line.text_sfx]);
        else if (this.textScrollKeys[name] == undefined)
            this.textScrollSfx = game.add.audio(this.textScrollKeys['default']);
        else
            this.textScrollSfx = game.add.audio(this.textScrollKeys[name]);
        this.textRun = true;
    } else { // else end conversation (if no more lines)
        if (this.changeState) {
            this.callbackGame.camera.fade('#000');
            this.callbackGame.camera.onFadeComplete.addOnce(function () {
                if (this.sceneKey != null && this.sceneKey != undefined)
                    BasicGame.global.event_flags[this.sceneKey] = true;
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
    this.callbackGame.camera.onFadeComplete.addOnce(function () {
        if (this.sceneKey != null && this.sceneKey != undefined)
            BasicGame.global.event_flags[this.sceneKey] = true;
        this.callbackGame.state.start(this.scene.next_state);
    }, this);
}

Textbox.prototype.hide = function () {
    this.visible = false;
    this.bodyText.visible = false;
    this.nameText.visible = false;
    this.ctc.visible = false;
    this.textRun = false;
}

Textbox.prototype.show = function () {
    this.visible = true;
    this.bodyText.visible = true;
    this.nameText.visible = true;
}