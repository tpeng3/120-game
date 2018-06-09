// add the states to Basic Game
var BasicGame = {};

//globals now set in title screen so the reset on gameover or restating the game

BasicGame.Boot = function (game) {};

BasicGame.Boot.prototype = {
    init: function () {
        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;
        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop){
            //  If you have any desktop specific settings, they can go in here
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.setMinMax(480, 260, 800, 600);
            this.scale.pageAlignVertically = true;
            this.scale.updateLayout(true);
        }else{
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }
    },

    preload: function () {
        console.log('Boot: preload');
        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        //this.load.image('preloaderBackground', 'images/preloader_background.jpg');
        //this.load.image('preloaderBar', 'images/preloadr_bar.png');

    },

    create: function () {
        console.log('Boot: create');
        //  So now let's start the real preloader going
        this.state.start('Preloader');
    },
    update: function () {
        //if (Phaser.Loader.hasLoaded)
        //this.state.start('Preloader');
    }

};
