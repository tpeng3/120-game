BasicGame.Results = function (game) { };

BasicGame.Results.prototype = {

    preload: function () {

    },

    create: function () {
        console.log('Results!')
        // some text for the players
        var textStyle = { fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: 200 };
        this.add.text(200, 40, 'Rest day: Results (The programmers should put something here)', textStyle);
        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
    },

    update: function () {
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            calendar.nextDay();
            this.state.start('ActivityDecision');
        }
    }

};