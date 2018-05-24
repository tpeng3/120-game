BasicGame.Cutscene = function (game) {};

BasicGame.Cutscene.prototype = {
    init: function (sceneKey)
    {
        this.stage.backgroundColor = "#000";

        //Set the scene name (json file path) from the place that started the scene
        this.sceneName = sceneKey;
        console.log('starting scene: ' + sceneKey);
    },
	preload: function() {
		console.log('Cutscene: preload');
        // load backgrounds
        this.load.image('bg_agency', 'assets/img/bg/bg_agency.png');

        // load the sprites
        // this.load.image('locke_default', 'assets/img/characters/vn_locke.png');
        // this.load.spritesheet('Locke', 'assets/img/characters/sprite_locke.png', 584, 637);
        this.load.atlas('Locke', 'assets/img/characters/sprite_locke.png', 'assets/img/characters/sprite_locke.json');
        this.load.image('locke_posing', 'assets/img/characters/vn_locke2draft.png');
        this.load.image('keyna_default', 'assets/img/characters/vn_keyna.png');
        this.load.image('tai_default', 'assets/img/characters/vn_tai.png');
        this.load.image('fedelynn_default', 'assets/img/characters/vn_fedelynn.png');

        // load textbox and font
        this.load.image('textbox', 'assets/img/ui/textbox.png');

        // load script
        this.load.text('scene', 'js/scenes/' + this.sceneName + '.json');

        // load music and sfx
        this.load.audio('bgm_temp_locke', 'assets/audio/bgm/Locke_And_Load.ogg');
        this.load.audio('bgm_oldtemp_locke', 'assets/audio/bgm/old_Locke_And_Load.ogg');
        this.load.audio('bgm_temp_talk', 'assets/audio/bgm/yoiyaminoseaside.ogg');
        this.load.audio('sfx_text_scroll', 'assets/audio/sfx/sfx_text_scroll4.ogg');
	},
    create: function () {
        console.log('Cutscene: create');
        game.sound.stopAll(); 

        // create SFX
        this.textScrollSfx = game.add.audio('sfx_text_scroll');

		// parse the scene script
        this.scene = JSON.parse(this.game.cache.getText('scene'));

        // add music, it'll be late but I'm lazy rn to change that
        var bgm = game.add.audio(this.scene.bgm);
        bgm.loopFull();

        // add the initial bg
        bg = this.add.sprite(0, 0, this.scene.bg);

        // add textbox
        var textbox = new Textbox(game, true, this.scene);

        // place the dateTimeBox
        var dateBox = this.add.sprite(textbox.left, 20, 'textbox');
        dateBox.anchor.setTo(0, 0);
        dateBox.scale.setTo(0.27, 0.25);
        dateBox.alpha = 0.75

        // initialize the dateTime text
        this.dateText = this.add.text(textbox.left + 60, 20, calendar.print(), { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });

        //Bind the line advancing function to the spacebar
        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(textbox.advance, textbox);
        //Bind the line advancing function to the spacebar
        var enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.add(textbox.skipScene, textbox);
        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game, 1000);
	},
    update: function () {

	},
};
