BasicGame.CharacterDecision = function (game) { };

BasicGame.CharacterDecision.prototype = {

    init: function (characters) {
        //An array of all the characters to choose from (their names, no more than 2, no greater than 3)
        this.characters = characters
    },
    preload: function () {
        this.characterSprites = [];
        this.load.image('button_Tai', 'assets/img/ui/button_tai.png');
        this.load.image('button_Keyna', 'assets/img/ui/button_keyna.png');
        this.load.image('button_Fedelynn', 'assets/img/ui/button_lynn.png');
    },
    create: function () {
        console.log('CharacterDecision!')
        this.menuSelectSfx = this.add.audio('sfx_menu_select');
        this.menuEnterGoodSfx = this.add.audio('sfx_menu_open');
        // add the initial bg
        this.bg = this.add.sprite(0, 0, 'bg_agency');
        this.selected = 0;
        this.exit = false;
        this.dimColor = 0x555555;
        this.unDimColor = 0xffffff;

        for (let i = 0; i < this.characters.length; ++i) {
            // let newSprite = this.add.sprite(0, this.world.height, this.characters[i], this.characters[i]+'_default');
            let newSprite = this.add.sprite(this.world.width / 2 - 200, this.world.height / 2 - 50, 'button_'+this.characters[i]);
            // newSprite.anchor.setTo(0.5, 1);
            newSprite.anchor.setTo(0.5);
            newSprite.scale.setTo(0.85, 0.85);
            newSprite.x = ((this.world.width / (this.characters.length + 1)) * (i + 1));
            newSprite.tint = this.dimColor;
            this.characterSprites.push(newSprite);
        }
        if (this.characters.length == 3) {
            this.characterSprites[0].x -= 20;
            this.characterSprites[2].x += 20;
            this.selected = 1;
        } 
        this.characterSprites[this.selected].tint = this.unDimColor;
        this.characterSprites[this.selected].scale = new Phaser.Point(1, 1);

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
            this.characterSprites[this.selected].scale = new Phaser.Point(0.85, 0.85);
            this.selected--;
            this.characterSprites[this.selected].tint = this.unDimColor;
            this.characterSprites[this.selected].scale = new Phaser.Point(1, 1);
            this.textbox.startNewScene(false, null, [{ name: '', text: 'Hang out with ' + this.characters[this.selected] + '?' }]);
            if (this.menuSelectSfx.isPlaying)
                this.menuSelectSfx.restart()
            else
                this.menuSelectSfx.play('', 0, 0.5, false, true);
        }
        else if ((this.input.keyboard.justPressed(Phaser.Keyboard.D) ||
            this.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)) &&
            this.selected < (this.characters.length - 1)) {
            this.characterSprites[this.selected].tint = this.dimColor;
            this.characterSprites[this.selected].scale = new Phaser.Point(0.85, 0.85);
            this.selected++;
            this.characterSprites[this.selected].tint = this.unDimColor;
            this.characterSprites[this.selected].scale = new Phaser.Point(1, 1);
            this.textbox.startNewScene(false, null, [{ name: '', text: 'Hang out with ' + this.characters[this.selected] + '?' }]);
            if (this.menuSelectSfx.isPlaying)
                this.menuSelectSfx.restart()
            else
                this.menuSelectSfx.play('', 0, 0.5, false, true);
        }
        //@Tina you don't need to change any of this code, just set this.selected appropriately
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) || this.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
            if (this.exit)
                return;
            this.exit = true;
            this.camera.fade('#000', 1000);
            this.menuEnterGoodSfx.play('', 0, 0.75);
            this.camera.onFadeComplete.addOnce(function () {
                console.log('incrementing ' + this.characters[this.selected] + '_ind: ' + (calendar.scenes[this.characters[this.selected] + '_ind'] + 1));
                calendar.scenes[this.characters[this.selected] + '_ind']++;
                BasicGame.global.player_stats.relationships[this.characters[this.selected]]++;
                console.log(BasicGame.global.player_stats.relationships);
                this.state.start('Cutscene', true, false, this.characters[this.selected] + '_' + calendar.scenes[this.characters[this.selected] + '_ind']);
            }, this);
        }
    }

};