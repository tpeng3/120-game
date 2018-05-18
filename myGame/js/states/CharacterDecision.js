BasicGame.CharacterDecision = function (game) { };

BasicGame.CharacterDecision.prototype = {

    init: function (characters) {
        //An array of all the characters to choose from (their names, no more than 2, no greater than 3)
        this.characters = characters
    },
    preload: function () {

    },

    create: function () {
        console.log('CharacterDecision!')
        this.selected = 0;
        this.exit = false;

        // some text for the players
        var textStyle = { fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: 700 };
        this.add.text(200, 40, 'CharacterDecision:', textStyle);

        // PLACEHOLDER CHARACTER DECISON DISPLAY
        this.add.text(200, 80, 'Press Q to select: ' + this.characters[0], textStyle);
        this.add.text(200, 120, 'Press W to select: ' + this.characters[1], textStyle);
        if (this.characters.length > 2)
            this.add.text(200, 160, 'Press E to select: ' + this.characters[2], textStyle);
        this.add.text(200, 200, 'Press Enter/Space to confirm: ', textStyle);

        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
    },

    update: function () {
        //DEBUG INPUT
        if (this.input.keyboard.justPressed(Phaser.Keyboard.Q))
            this.selected = 0;
        if (this.input.keyboard.justPressed(Phaser.Keyboard.W))
            this.selected = 1;
        if (this.input.keyboard.justPressed(Phaser.Keyboard.Q) && this.characters.length > 2)
            this.selected = 2;
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