BasicGame.Results = function (game) { };

BasicGame.Results.prototype = {

    preload: function () {

    },

    create: function () {
        calendar.week++;
        console.log('Results!')
        // some text for the players
        var textStyle = { fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: 900 };
        this.add.text(200, 40, 'Rest day: ' + calendar.print() + ': Results (Placeholder)', textStyle);
        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
        // fade transition (It has to be placed at the end for layering reasons)
        // camera.fade has some weird bug where it's reloading the state every time it fades
        // I hate that I have to do this
        this.black = this.add.sprite(0, 0, 'bg_black');
        this.black.scale.setTo(this.world.width, this.world.height);
        this.world.bringToTop(this.black);
        this.black.alpha = 1;
        this.add.tween(this.black).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        this.exit = true;

        // text of the days for transition
        var dayTextStyle = { font: 'Trebuchet MS', fontSize: '60px', fill: '#fff' };
        this.today = this.add.text(this.world.width / 2, this.world.height / 2, calendar.printDay(), dayTextStyle);
        this.today.anchor.set(0.5);
        this.today.alpha = 0;
        this.tomorrow = this.add.text(this.world.width / 2, this.world.height / 2 - 50, '', dayTextStyle);
        this.tomorrow.anchor.set(0.5);
        this.tomorrow.alpha = 0;

        this.game.time.events.add(1000, function () { this.exit = false; }, this);

        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game, 1000);
    },

    update: function () {
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            if (this.exit)
                return;
            bgm.fadeOut(500);
            this.camera.fade('#000', 500);
            this.camera.onFadeComplete.addOnce(function () {
                if (calendar.date.getDay() == 0)
                    this.state.start('Results');
                else
                    this.state.start('NextDay');
            }, this);
        }
    },
};