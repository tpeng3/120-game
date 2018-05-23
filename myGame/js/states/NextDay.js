BasicGame.NextDay = function (game) {};

BasicGame.NextDay.prototype = {
    // create: function() {
    //     // text of the days for transition
    //     var dayTextStyle = { font: 'Trebuchet MS', fontSize: '60px', fill: '#fff' };
    //     var month = this.add.text(this.world.width/2 - 200, this.world.height/2 - 30, '3/', dayTextStyle);

    //     this.date1 = this.add.text(month.x+month.width, month.y, '1', dayTextStyle);
    //     this.date2 = this.add.text(month.x+month.width, month.y - 50, '2', dayTextStyle);
    //     this.date2.alpha = 0;
        
    //     this.today = this.add.text(month.x+month.width+80, month.y, calendar.printDay(), dayTextStyle);
    //     this.tomorrow = this.add.text(month.x+month.width+80, month.y, '', dayTextStyle);
    //     this.tomorrow.alpha = 0;

    //     this.game.time.events.add(1500, function(){
    //         game.add.tween(this.today).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
    //         calendar.nextDay();
    //         this.tomorrow.text = calendar.printDay();
    //         this.changeDay();
    //     }, this);

    //     var fade = new TransitionFade(game, 500);
    // },
    // changeDay: function() {
    //     this.game.time.events.add(200, function(){
    //         game.add.tween(this.date1).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true);
    //         game.add.tween(this.date1).to( { y: this.world.height/2 + 170 }, 600, Phaser.Easing.Linear.None, true);
            
    //         game.add.tween(this.date2).to( { alpha: 1}, 100, Phaser.Easing.Linear.None, true);
    //         var dateTween = game.add.tween(this.date2).to( { y: this.world.height/2 - 30}, 300, Phaser.Easing.Linear.None, true);
 
    //         this.game.time.events.add(500, function(){
    //             game.add.tween(this.tomorrow).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
    //         }, this);

    //         this.game.time.events.add(4000, function () {
    //             this.camera.fade();
    //             this.camera.onFadeComplete.addOnce(function () {
    //                 this.state.start('Bedtime', true, false);
    //             }, this);
    //         }, this);
    //     }, this);
    // }


    create: function () {
        game.sound.stopAll(); 
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
    },
    changeDay: function() {
        this.game.time.events.add(1000, function(){
            game.add.tween(this.today).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
            game.add.tween(this.today).to( { y: this.world.height/2 + 200 }, 600, Phaser.Easing.Linear.None, true);
            game.add.tween(this.tomorrow).to( { alpha: 1}, 100, Phaser.Easing.Linear.None, true);
            game.add.tween(this.tomorrow).to( { y: this.world.height/2}, 300, Phaser.Easing.Linear.None, true);
        
            this.game.time.events.add(2500, function () {
                this.camera.fade();
                this.camera.onFadeComplete.addOnce(function () {
                    if (calendar.date.getDay() == 0)
                        this.state.start('Results');
                    else
                        this.state.start('ActivityDecision', true, false);
                }, this);
            }, this);
        }, this);
    }
};
