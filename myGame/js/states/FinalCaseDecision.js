BasicGame.CharacterDecision = function (game) { };

BasicGame.CharacterDecision.prototype = {

    init: function (characters) {
        this.characters = ['Tai', 'Keyna', 'Fedelynn'];
        this.selectionText = [
            [{ name: '', text: 'Check on Tai?'}],
            [{ name: '', text: 'Help Keyna with her case?' }],
            [{ name: '', text: 'Help Fedelynn with Deuce Evidens?' }]
        ]
    },
    preload: function () {
        this.characterSprites = [];
        this.load.image('button_Tai', 'assets/img/ui/button_tai.png');
        this.load.image('button_Keyna', 'assets/img/ui/button_keyna.png');
        this.load.image('button_Lynn', 'assets/img/ui/button_lynn.png');
        this.load.text('final_case_Fedelynn', 'js/cases/Case_final_fedelynn.json');
        this.load.text('final_case_Keyna', 'js/cases/Case_final_keyna.json');
        this.load.text('final_case_Tai', 'js/cases/Case_final_tai.json');
    },
    create: function () {
        console.log('CharacterDecision!')
        this.menuSelectSfx = this.add.audio('sfx_menu_select');
        this.menuEnterGoodSfx = this.add.audio('sfx_menu_open');
        this.menuEnterBadSfx = this.add.audio('sfx_menu_enter_bad');
        // add the initial bg
        this.bg = this.add.sprite(0, 0, 'bg_agency');
        this.selected = 1;
        this.exit = false;
        this.dimColor = 0x555555;
        this.unDimColor = 0xffffff;
        let p = BasicGame.global.player_stats.relationships;
        this.endingUnlocked = [true,  true, true];
        for (let i = 0; i < this.characters.length; ++i) {
            let newSprite = this.add.sprite(this.world.width / 2 - 200, this.world.height / 2 - 50, 'button_'+this.characters[i]);
            newSprite.anchor.setTo(0.5);
            newSprite.scale.setTo(0.85, 0.85);
            newSprite.x = ((this.world.width / (this.characters.length + 1)) * (i + 1));
            newSprite.tint = this.dimColor;
            this.characterSprites.push(newSprite);
            if (p[this.characters[i]] < 3) {
                this.selectionText[i] = [{ name: '', text: 'Your relationship with ' + this.characters[i] + "isn't good enough to select this option." }];
                this.endingUnlocked[i] = true;
            }
        }
        //     this.characterSprites[0].x -= 20;
        //     this.characterSprites[2].x += 20;
        //     this.selected = 1;
        this.characterSprites[this.selected].tint = this.unDimColor;
        this.characterSprites[this.selected].scale = new Phaser.Point(1, 1);

        // add textbox and text, we don't have to keep this but for now give some explanations to the players
        this.textbox = new Textbox(game, false, null, this.selectionText[this.selected]);
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
            this.textbox.startNewScene(false, null, this.selectionText[this.selected]);
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
            this.textbox.startNewScene(false, null, this.selectionText[this.selected]);
            if (this.menuSelectSfx.isPlaying)
                this.menuSelectSfx.restart()
            else
                this.menuSelectSfx.play('', 0, 0.5, false, true);
        }
        //@Tina you don't need to change any of this code, just set this.selected appropriately
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) || this.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
            if (!this.endingUnlocked[this.selected]) {
                this.menuEnterBadSfx.play();
                return;
            }
            if (this.exit)
                return;
            this.exit = true;
            this.camera.fade('#000', 1000);
            this.menuEnterGoodSfx.play('', 0, 0.75);
            this.camera.onFadeComplete.addOnce(function () {
                BasicGame.global.case_number = 'final';
                BasicGame.global.case = JSON.parse(this.game.cache.getText('final_case_' + this.characters[this.selected]));
                this.state.start('Cutscene', true, false, 'case/CaseStart_final' + this.characters[this.selected]);
            }, this);
        }
    }

};