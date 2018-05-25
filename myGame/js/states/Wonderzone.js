BasicGame.Wonderzone = function (game) {};

BasicGame.Wonderzone.prototype = {
    create: function () {
        game.sound.stopAll(); 
        
        var bg = game.add.sprite(0, 0, 'bg_agency');
        this.cutin1 = game.add.sprite(0, 300, 'ui_wonderzone');
        this.cutin1.alpha = 0;

        this.cutin2 = game.add.sprite(0, 150, 'ui_wonderzone2');
        this.cutin2.alpha = 0;

        game.add.tween(this.cutin1).to( { alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
        var tweenCutin = game.add.tween(this.cutin1).to( { y: 150 }, 300, Phaser.Easing.Linear.None, true);

        tweenCutin.onComplete.add(this.timeToWork, this);
    },
    timeToWork: function() {
        this.game.time.events.add(500, function(){
            // idk we can add some sort of transition here?
            game.add.tween(this.cutin2).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            
            this.game.time.events.add(1000, function () {
                this.camera.fade();
                this.camera.onFadeComplete.addOnce(function () {
                    this.state.start('Work', true, false);
                }, this);
            }, this);
        }, this);
    }
};
