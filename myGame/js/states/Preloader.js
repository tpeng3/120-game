
BasicGame.Preloader = function (game) { };

BasicGame.Preloader.prototype = {

    preload: function () {
        //BGM
        // @Tino 6/6/18 I'm gonna load a bunch of jazzy royalty free songs to see which ones I should use
        this.load.audio('bgm_locke', 'assets/audio/bgm/Locke_And_Load.ogg');
        this.load.audio('bgm_oldtemp_locke', 'assets/audio/bgm/old_Locke_And_Load.ogg');
        this.load.audio('bgm_wonder_zone', 'assets/audio/bgm/Enter_the_WONDER_ZONE.ogg');
        this.load.audio('bgm_temp_detective', 'assets/audio/bgm/bgm_startscreen.ogg');
        this.load.audio('bgm_fedelynn', 'assets/audio/bgm/Dont_Fuck_With_Fedelynn_ver_2.ogg');
        this.load.audio('bgm_temp_paino', 'assets/audio/bgm/paino.ogg');

        this.load.audio('bgm_seaside', 'assets/audio/bgm/yoiyaminoseaside.ogg');
        this.load.audio('bgm_sadserious', 'assets/audio/bgm/katamukikaketahizashi.ogg');

        this.load.audio('bgm_sweetvermouth', 'assets/audio/bgm/tw007.ogg');
        this.load.audio('bgm_vientodelsol', 'assets/audio/bgm/tw009.ogg');
        this.load.audio('bgm_strigiformes', 'assets/audio/bgm/tw018.ogg');
        this.load.audio('bgm_popup', 'assets/audio/bgm/tw034.ogg');
        this.load.audio('bgm_gunshotstraight', 'assets/audio/bgm/tw042.ogg');
        this.load.audio('bgm_sofa', 'assets/audio/bgm/tw044.ogg');
        this.load.audio('bgm_radio', 'assets/audio/bgm/tw056.ogg');
        this.load.audio('bgm_dbd', 'assets/audio/bgm/tw062.ogg');
        this.load.audio('bgm_blend', 'assets/audio/bgm/tw082.ogg');

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
	},

    create: function () {
        var sprite = this.add.sprite(game.width / 2, game.height / 2, 'sprite_locke');
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.setTo(1.5, 1.5);
        sprite.animations.add('right', [6, 7, 8], 10, true);
        sprite.animations.play('right');
        var instrStyle = { font: 'bold Trebuchet MS', fontSize: '36px', fill: '#fff', wordWrap: true, wordWrapWidth: 800, boundsAlignH: 'center' };
        var instrText = this.add.text(game.width / 2, sprite.y + 100, 'Loading...', instrStyle);
        instrText.anchor.set(0.5, 0.5);
	},

	update: function () {
        if (game.cache.isSoundDecoded('bgm_temp_detective')) {//&& game.cache.isSoundDecoded('sfx_type')) {
            game.state.start('TitleScreen', true, false);
        }
    }
};
