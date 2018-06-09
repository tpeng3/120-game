
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

        // load bgm and sfx
        //BGM
        // @Tino 6/6/18 I'm gonna load a bunch of jazzy royalty free songs to see which ones I should use
        this.load.audio('bgm_locke', 'assets/audio/bgm/Locke_And_Load.ogg');
        this.load.audio('bgm_oldtemp_locke', 'assets/audio/bgm/old_Locke_And_Load.ogg');
        this.load.audio('bgm_wonder_zone', 'assets/audio/bgm/Enter_the_WONDER_ZONE.ogg');
        this.load.audio('bgm_temp_detective', 'assets/audio/bgm/bgm_startscreen.ogg');
        this.load.audio('bgm_fedelynn', 'assets/audio/bgm/Dont_Fuck_With_Fedelynn_ver_2.mp3');
        this.load.audio('bgm_temp_paino', 'assets/audio/bgm/paino.ogg');

        this.load.audio('bgm_seaside', 'assets/audio/bgm/yoiyaminoseaside.ogg');
        this.load.audio('bgm_sadserious', 'assets/audio/bgm/katamukikaketahizashi.mp3');

        this.load.audio('bgm_sweetvermouth', 'assets/audio/bgm/tw007.mp3');
        this.load.audio('bgm_vientodelsol', 'assets/audio/bgm/tw009.mp3');
        this.load.audio('bgm_strigiformes', 'assets/audio/bgm/tw018.mp3');
        this.load.audio('bgm_popup', 'assets/audio/bgm/tw034.mp3');
        this.load.audio('bgm_gunshotstraight', 'assets/audio/bgm/tw042.mp3');
        this.load.audio('bgm_sofa', 'assets/audio/bgm/tw044.mp3');
        this.load.audio('bgm_radio', 'assets/audio/bgm/tw056.mp3');
        this.load.audio('bgm_dbd', 'assets/audio/bgm/tw062.mp3');
        this.load.audio('bgm_blend', 'assets/audio/bgm/tw082.mp3');

        //SFX
        this.load.audio('sfx_player_laser', 'assets/audio/sfx/sfx_player_shot_laser.ogg');
        this.load.audio('sfx_bedtime', 'assets/audio/sfx/sfx_bedtime.ogg');
        this.load.audio('sfx_menu_select', 'assets/audio/sfx/sfx_menu_select.ogg');
        this.load.audio('sfx_menu_open', 'assets/audio/sfx/sfx_menu_open.ogg');
        this.load.audio('sfx_menu_close', 'assets/audio/sfx/sfx_menu_close.ogg');
        this.load.audio('sfx_menu_enter_bad', 'assets/audio/sfx/sfx_menu_enter_bad.ogg');
        this.load.audio('sfx_text_scroll_locke', 'assets/audio/sfx/sfx_text_scroll6.ogg');
        this.load.audio('sfx_text_scroll_tai', 'assets/audio/sfx/sfx_ts_tai2.ogg');
        this.load.audio('sfx_text_scroll_keyna', 'assets/audio/sfx/sfx_ts_keyna2.ogg');
        this.load.audio('sfx_text_scroll_fedelynn', 'assets/audio/sfx/sfx_ts_fedelynn2.ogg');
        this.load.audio('sfx_text_scroll_client_f', 'assets/audio/sfx/sfx_ts_rando2.ogg');
        this.load.audio('sfx_text_scroll_client_m', 'assets/audio/sfx/sfx_ts_rando4.ogg');
        this.load.audio('sfx_text_scroll_default', 'assets/audio/sfx/sfx_type3.ogg');
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
        if (game.cache.isSoundDecoded('bgm_temp_detective')) {//&& game.cache.isSoundDecoded('sfx_type')) {
            game.state.start('TitleScreen', true, false);
        }
    }
};
