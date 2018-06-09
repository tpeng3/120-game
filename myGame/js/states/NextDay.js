BasicGame.NextDay = function (game) {};

BasicGame.NextDay.prototype = {
    create: function () {
        //game.sound.stopAll(); 
        // text of the days for transition
        var dayTextStyle = { font: 'Trebuchet MS', fontSize: '60px', fill: '#fff' };
        this.today = this.add.text(this.world.width / 2, this.world.height / 2, calendar.printDay(), dayTextStyle);
        this.today.anchor.set(0.5);
        this.today.alpha = 0;
        this.tomorrow = this.add.text(this.world.width / 2, this.world.height / 2 - 50, '', dayTextStyle);
        this.tomorrow.anchor.set(0.5);
        this.tomorrow.alpha = 0;

        var tweenToday = game.add.tween(this.today).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true);
        calendar.nextDay();
        this.tomorrow.text = calendar.printDay();
        tweenToday.onComplete.add(this.changeDay, this);

        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.advanceState, this);
    },
    changeDay: function() {
        this.game.time.events.add(1000, function(){
            game.add.tween(this.today).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
            game.add.tween(this.today).to( { y: this.world.height/2 + 200 }, 600, Phaser.Easing.Linear.None, true);
            game.add.tween(this.tomorrow).to( { alpha: 1}, 100, Phaser.Easing.Linear.None, true);
            game.add.tween(this.tomorrow).to( { y: this.world.height/2}, 300, Phaser.Easing.Linear.None, true);
        
            this.game.time.events.add(2500, function () {
                this.camera.fade();
                this.camera.onFadeComplete.addOnce(this.advanceState, this);
            }, this);
        }, this);
    },
    advanceState: function () {
        let p = BasicGame.global.player_stats.relationships;
        if (calendar.date.getDate() == 17 && !(p.Tai >= 3 || p.Keyna >= 3 || p.Fedelynn >= 3)) {
            this.state.start('Cutscene', true, false, 'HangoutFail');
        } else if (calendar.date.getDay() == 0)
            this.state.start('Bedtime', true, false);
        else if (calendar.date.getDate() == 18)
            this.state.start('FinalCaseDecision', true, false);
        else
            this.state.start('ActivityDecision', true, false);
    }
};
