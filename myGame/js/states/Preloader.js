
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function () {
        console.log('Preloader: preload');
		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		//this.background = this.add.sprite(0, 0, 'preloaderBackground');
		//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		//this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
        // load bgm and sfx
        //BGM
        this.load.audio('bgm_temp_locke', 'assets/audio/bgm/Locke_And_Load.ogg');
        this.load.audio('bgm_oldtemp_locke', 'assets/audio/bgm/old_Locke_And_Load.ogg');
        this.load.audio('bgm_temp_talk', 'assets/audio/bgm/yoiyaminoseaside.ogg');
        this.load.audio('bgm_touhou_stolen', 'assets/audio/bgm/ravel_nightstar_the_drums_and_bass_of_flower_bless.ogg');
        this.load.audio('bgm_wonder_zone', 'assets/audio/bgm/Enter_the_WONDER_ZONE.ogg');
        //SFX
        this.load.audio('sfx_player_laser', 'assets/audio/sfx/sfx_player_shot_laser.ogg');
        this.load.audio('sfx_text_scroll_locke', 'assets/audio/sfx/sfx_text_scroll6.ogg');
        this.load.audio('sfx_text_scroll_tai', 'assets/audio/sfx/sfx_ts_tai2.ogg');
        this.load.audio('sfx_text_scroll_keyna', 'assets/audio/sfx/sfx_ts_keyna1.ogg');
        this.load.audio('sfx_text_scroll_fedelynn', 'assets/audio/sfx/sfx_text_scroll6.ogg');
        this.load.audio('sfx_text_scroll_default', 'assets/audio/sfx/sfx_ts_rando2.ogg');
		//	+ lots of other required assets here

	},

    create: function () {
        console.log('Preloader: create');
		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        // this.preloadBar.cropEnabled = false;
	},

	update: function () {
		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		//if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		//{
		//	this.ready = true;
		//	this.state.start('MainMenu');
		//}
        if (game.cache.isSoundDecoded('bgm_oldtemp_locke')) {//&& game.cache.isSoundDecoded('sfx_type')) {
            game.state.start('TitleScreen', true, false);
        }
    }
};
