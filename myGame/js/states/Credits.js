BasicGame.Credits = function (game) {};

BasicGame.Credits.prototype = {
    preload: function(){
        this.load.image('ending_tai', 'assets/img/bg/ending_tai.png');
        this.load.image('ending_keyna', 'assets/img/bg/ending_keyna.png');
        this.load.image('ending_lynn', 'assets/img/bg/ending_lynn.png');

        this.load.image('ending_credits', 'assets/img/bg/credits.png');
    },
    create: function () {
        game.sound.stopAll(); 
        
        // var bg = game.add.sprite(0, 0, 'bg_agency');
        // this.cutin1 = game.add.sprite(0, 300, 'ui_wonderzone');
        // this.cutin1.alpha = 0;

        // this.cutin2 = game.add.sprite(0, 150, 'ui_wonderzone2');
        // this.cutin2.alpha = 0;

        // game.add.tween(this.cutin1).to( { alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
        // var tweenCutin = game.add.tween(this.cutin1).to( { y: 150 }, 300, Phaser.Easing.Linear.None, true);

        // tweenCutin.onComplete.add(this.timeToWork, this);

        // var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // spaceKey.onDown.add(this.advanceState, this);
    }
};
