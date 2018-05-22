BasicGame.CharacterDecision = function (game) { };

BasicGame.CharacterDecision.prototype = {

    init: function (characters) {
        //An array of all the characters to choose from (their names, no more than 2, no greater than 3)
        this.characters = characters
    },
    preload: function () {
        this.characterSprites = [];
        this.load.image('textbox', 'assets/img/ui/textbox.png');
        for (let i = 0; i < this.characters.lenth; ++i) {
            this.load.image(this.characters[i].toLowerCase() + '_default', 'assets/img/characters/vn_' + this.characters[i].toLowerCase() + '.png');
        }
    },
    create: function () {
        console.log('CharacterDecision!')
        this.selected = 0;
        this.exit = false;
        this.dimColor = 0x666666;
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
        this.characterSprites[this.selected].tint = 0xffffff;
        // PLACEHOLDER CHARACTER DECISON DISPLAY
        this.add.text(200, 80, 'Use arrow keys to change selection', textStyle);

        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
        console.log(this.characterSprites);
    },

    update: function () {
        // choice selection
        if ((this.input.keyboard.justPressed(Phaser.Keyboard.A) ||
            this.input.keyboard.justPressed(Phaser.Keyboard.LEFT)) &&
            this.selected != 0) {
            this.characterSprites[this.selected].tint = this.dimColor;
            this.selected--;
            this.characterSprites[this.selected].tint = 0xffffff;
            console.log(this.selected);
        }
        if ((this.input.keyboard.justPressed(Phaser.Keyboard.D) ||
            this.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)) &&
            this.selected < (this.characters.length - 1)) {
            this.characterSprites[this.selected].tint = this.dimColor;
            this.selected++;
            this.characterSprites[this.selected].tint = 0xffffff;
            console.log(this.selected);
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