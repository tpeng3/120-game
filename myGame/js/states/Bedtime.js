// Hooray for more interactions and choices, and fake social media messages/text
// And stat level ups

BasicGame.Bedtime = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.Bedtime.prototype = {
	preload: function() {
        console.log('Bedtime: preload');
		// load phone screen image ... and textbox.... and b-bedroom image bg? and level up screens
        
        this.load.image('ui_ribbitter', 'assets/img/ui/ui_socialmedia.png');
        this.load.image('icon_locke', 'assets/img/ui/icon_locke.png');
        this.load.image('icon_tai', 'assets/img/ui/icon_tai.png');
        this.load.image('icon_keyna', 'assets/img/ui/icon_keyna.png');
        this.load.image('icon_lynn', 'assets/img/ui/icon_lynn.png');
        this.load.text('scene', 'js/scenes/' + 'Ribbits' + '.json');

        // this.load.image('bg_bedroom', 'assets/img/bg/bg_bedroom.png');
        this.load.image('bg_bedroom', 'assets/img/bg/bg_bedroom_temp.png');

        this.load.spritesheet('sprite_locke', 'assets/img/bedtime/sprite_locke.png', 64, 64);
        this.load.image('sprite_bed', 'assets/img/bedtime/sprite_bed.png');
        this.load.image('sprite_desk', 'assets/img/bedtime/sprite_desk.png');

        this.load.audio('bgm_temp_paino', 'assets/audio/bgm/paino.ogg');
	},

	create: function() {
		// variables
		this.spriteSpeed = 200;

        console.log('Bedtime: create');
        game.sound.stopAll(); 

        bgm = game.add.audio('bgm_temp_paino');
        bgm.loopFull()

        // add background
		this.stage.backgroundColor = "#000";
		var bg = this.add.sprite(64*2, 64*1, 'bg_bedroom');

		this.physics.startSystem(Phaser.Physics.ARCADE);

		// add locke
		sprite = this.add.sprite(game.width/2, game.height/2, 'sprite_locke');
		sprite.anchor.set(0.5);
		this.physics.arcade.enable(sprite);
		sprite.animations.add('down', [0, 1, 2, 1], 10, true);
		sprite.animations.add('left', [3, 4, 5], 10, true);
		sprite.animations.add('right', [6, 7, 8], 10, true);
		sprite.animations.add('up', [9, 10, 11, 10], 10, true);
		this.spriteDirection = 1; // facing down is default

		// add a "sensor" for locke
		sensor = this.add.sprite(sprite.x, sprite.y, 'bg_black');
		sensor.scale.setTo(64, 64);
		sensor.anchor.set(0.5);
		sensor.alpha = 0;
		this.physics.arcade.enable(sensor);

		// create boundaries player basically collides with
		game.physics.arcade.setBounds(bg.x, bg.y + 64*2, bg.width, bg.height);
		sprite.body.collideWorldBounds = true;

		// add room objects
		this.bed = this.add.sprite(64*2, 195, 'sprite_bed');
		this.physics.arcade.enable(this.bed);
		this.physics.arcade.collide(sprite, this.bed);
		this.bed.body.immovable = true;

		this.desk = this.add.sprite(64*2, 64*6, 'sprite_desk');
		this.physics.arcade.enable(this.desk);
		this.physics.arcade.collide(sprite, this.desk);
	 	this.desk.body.immovable = true;

	 	// add debug text
	 	var textStyle = { fontSize: '16px', fill: '#000', wordWrap: true, wordWrapWidth: 500 };
        this.add.text(600, 400, 'Use Arrow Keys or WASD to navigate. Press SPACEBAR to interact with objects.', textStyle);

	 	// add ribbitter
	 	this.ribbitter = this.add.group();
	 	this.ui_ribbitter = this.add.sprite(256, 120, 'ui_ribbitter');
	 	this.ui_ribbitter.alpha = 0.97;
	 	this.ribbitter.add(this.ui_ribbitter);

	 	// parse those ribbits
        this.ribbits = JSON.parse(this.game.cache.getText('scene'));

	 	titleStyle = { font: 'italics Trebuchet MS', fontSize: '18px', fill: '#333'};
	 	textStyle = { font: 'Trebuchet MS', fontSize: '16px', fill: '#333', wordWrap: true, wordWrapWidth: 64*7 };

	 	var prevHeight = 236;
	 	for(i=0; i<this.ribbits.length; i++){
	 		if(this.ribbits[i].condition == null || eval(this.ribbits[i].condition)){
		 		var handle, icon = this.ribbits[i].icon;
		 		var ribbitIcon = this.add.sprite(500, prevHeight, icon);
		 		// ribbitIcon.anchor.set(0, 0);
		 		if(icon == 'icon_locke') handle = '@5urelocke';
				else if(icon == 'icon_tai') handle = '@trainger_yellow';
				else if(icon == 'icon_keyna') handle = '@DetectiveK';
				else if(icon == 'icon_lynn') handle = '@tiredmomcop';
				var ribbitHandle = this.add.text(545, prevHeight, handle, titleStyle);
		        var ribbitText = this.add.text(540, prevHeight + 24, this.ribbits[i].text, textStyle);
		        ribbitText.lineSpacing = -8;
		        prevHeight = prevHeight + ribbitText.height + 32;
		        console.log(prevHeight);
		        this.ribbitter.add(ribbitIcon);
		        this.ribbitter.add(ribbitHandle);
		        this.ribbitter.add(ribbitText);
		    }
	    }
	    this.ribbitter.visible = false;

		// fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
	},

    update: function () {
        //Movement code
        var dir = new Phaser.Point(0, 0);
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
            game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            dir.y -= this.spriteSpeed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
            game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            dir.y += this.spriteSpeed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
            game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            dir.x += this.spriteSpeed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
            game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            dir.x -= this.spriteSpeed;
        }
        dir.normalize();
        dir.setMagnitude(this.spriteSpeed);
        sprite.body.velocity = dir;
		// update player sprite Animation
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
            game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            sprite.animations.play('right');
            this.spriteDirection = 7;
            sensor.anchor.setTo(.25, .5);
        }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
            game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            sprite.animations.play('left');
            this.spriteDirection = 4;
            sensor.anchor.setTo(.75, .5);
        }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
	    	game.input.keyboard.isDown(Phaser.Keyboard.W)) {
	    	sprite.animations.play('up');
	    	this.spriteDirection = 10;
            sensor.anchor.setTo(.5, .75);
		}
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
	    	game.input.keyboard.isDown(Phaser.Keyboard.S)) {
	    	sprite.animations.play('down');
	    	this.spriteDirection = 1;
	        sensor.anchor.setTo(.5,.25);
	    }
	    else{
	    	sprite.animations.stop();
	    	sprite.animations.frame = this.spriteDirection;
	        sprite.body.velocity.setTo(0, 0);
	    }
	    // update sensor positions
	    sensor.x = sprite.x;
	    sensor.y = sprite.y;
	    // if player checks bed, go to sleep and proceed back to activity decision
	    // I keep forgetting results screen is on Sunday and not like, at the end of the day
        this.physics.arcade.collide(sprite, this.bed);
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && game.physics.arcade.overlap(sensor, this.bed)) {
            calendar.nextDay();
            if (calendar.date.getDay() == 0)
                this.state.start('Results');
            else
	    	    this.state.start('ActivityDecision');
	    }
	    // if player check desks, opens up social media
	    // should we make tweets like a prefab or function like the textbox?
        this.physics.arcade.collide(sprite, this.desk);
	    if(this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && game.physics.arcade.overlap(sensor, this.desk)){
	    	if(this.ribbitter.visible == false){
	    		this.ribbitter.visible = true;
	    		sprite.body.moves = false;
	    	}else{
	    		this.ribbitter.visible = false;
	    		sprite.body.moves = true;
	    	}
	    }

		// press ENTER to proceed to the next state
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
            calendar.nextDay();
            if (calendar.date.getDay() == 0)
                this.state.start('Results');
            else
                this.state.start('ActivityDecision');
		}
	}
};
