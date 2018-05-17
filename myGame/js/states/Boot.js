// add the states to Basic Game
var BasicGame = {};

BasicGame.global = {
    case_number: -1,
    case: undefined,
    player_stats: {
        fatigue: 0, 
        relationships: {
            Tai: 0,
            Keyna: 0,
            Fedelynn: 0
        }
    },
    debug: 0
}

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            this.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }
    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        //this.load.image('preloaderBackground', 'images/preloader_background.jpg');
        //this.load.image('preloaderBar', 'images/preloadr_bar.png');
    },

    create: function () {
        //BasicGame.global.case = JSON.parse(this.game.cache.getText('starting_case'))
        //  So now let's start the real preloader going
        //this.state.start('Preloader');
        this.state.start('TitleScreen');
    }

};
