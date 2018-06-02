BasicGame.CharacterDecision = function (game) { };

BasicGame.CharacterDecision.prototype = {

    init: function (characters) {
        //An array of all the characters to choose from (their names, no more than 2, no greater than 3)
        this.characters = characters
    },
    preload: function () {
        this.characterSprites = [];
        this.load.image('bg_agency', 'assets/img/bg/bg_agency.png');
        for (let i = 0; i < this.characters.lenth; ++i) {
            this.load.image(this.characters[i].toLowerCase() + '_default', 'assets/img/characters/vn_' + this.characters[i].toLowerCase() + '.png');
        }
    },
    create: function () {
        console.log('CharacterDecision!')
        // add the initial bg
        this.bg = this.add.sprite(0, 0, 'bg_agency');
        this.selected = 0;
        this.exit = false;
        this.dimColor = 0x111111;
        this.unDimColor = 0x777777;
        // some text for the players
        var textStyle = { fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: 700 };
        this.add.text(200, 40, 'CharacterDecision:', textStyle);

        for (let i = 0; i < this.characters.length; ++i) {
            let newSprite = this.add.sprite(0, this.world.height, this.characters[i].toLowerCase() + '_default');
            newSprite.anchor.setTo(0.5, 1);
            newSprite.x = ((this.world.width / (this.characters.length + 1)) * (i + 1));
            newSprite.tint = this.dimColor;
            this.characterSprites.push(newSprite);
        }
        if (this.characters.length == 2) {
            this.characterSprites[0].x -= 50;
            this.characterSprites[1].x += 50;
        } else {
            this.characterSprites[0].x -= 75;
            this.characterSprites[2].x += 75;
            this.selected = 1;
        }
        this.characterSprites[this.selected].tint = this.unDimColor;
        this.characterSprites[this.selected].scale = new Phaser.Point(1.05, 1.05);

        // add textbox and text, we don't have to keep this but for now give some explanations to the players
        this.textbox = new Textbox(game, false, null, [{ name: '', text: 'Hang out with ' + this.characters[this.selected] + '?' }]);
        // place the dateTimeBox
        var dateBox = this.add.sprite(this.textbox.left, 20, 'bg_black');
        dateBox.alpha = 0.75;
        // initialize the dateTime text
        this.dateText = this.add.text(this.textbox.left + 60, 20, calendar.print(), { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
        dateBox.scale.setTo(this.dateText.width+90, this.dateText.height+6);
        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
    },

    update: function () {
        // choice selection
        if ((this.input.keyboard.justPressed(Phaser.Keyboard.A) ||
            this.input.keyboard.justPressed(Phaser.Keyboard.LEFT)) &&
            this.selected != 0) {
            this.characterSprites[this.selected].tint = this.dimColor;
            this.characterSprites[this.selected].scale = new Phaser.Point(1, 1);
            this.selected--;
            this.characterSprites[this.selected].tint = this.unDimColor;
            this.characterSprites[this.selected].scale = new Phaser.Point(1.05, 1.05);
            this.textbox.startNewScene(false, null, [{ name: '', text: 'Hang out with ' + this.characters[this.selected] + '?' }]);
        }
        if ((this.input.keyboard.justPressed(Phaser.Keyboard.D) ||
            this.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)) &&
            this.selected < (this.characters.length - 1)) {
            this.characterSprites[this.selected].tint = this.dimColor;
            this.characterSprites[this.selected].scale = new Phaser.Point(1, 1);
            this.selected++;
            this.characterSprites[this.selected].tint = this.unDimColor;
            this.characterSprites[this.selected].scale = new Phaser.Point(1.05, 1.05);
            this.textbox.startNewScene(false, null, [{ name: '', text: 'Hang out with ' + this.characters[this.selected] + '?' }]);
        }
        //@Tina you don't need to change any of this code, just set this.selected appropriately
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) || this.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
            if (this.exit)
                return;
            this.exit = true;
            this.camera.fade('#000', 1000);
            this.camera.onFadeComplete.addOnce(function () {
                console.log('incrementing ' + this.characters[this.selected] + '_ind: ' + (calendar.scenes[this.characters[this.selected] + '_ind'] + 1));
                calendar.scenes[this.characters[this.selected] + '_ind']++;
                this.state.start('Cutscene', true, false, this.characters[this.selected] + '_' + calendar.scenes[this.characters[this.selected] + '_ind']);
            }, this);
        }
    }

};