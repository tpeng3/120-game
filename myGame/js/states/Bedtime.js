// Hooray for more interactions and choices, and fake social media messages/text
// And stat level ups

BasicGame.Bedtime = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.Bedtime.prototype = {
	preload: function() {
        console.log('Bedtime: preload');
		// load ribbitter
        this.load.image('ui_ribbitter', 'assets/img/ui/ui_socialmedia.png');
        this.load.image('icon_locke', 'assets/img/ui/icon_locke.png');
        this.load.image('icon_tai', 'assets/img/ui/icon_tai.png');
        this.load.image('icon_keyna', 'assets/img/ui/icon_keyna.png');
        this.load.image('icon_lynn', 'assets/img/ui/icon_lynn.png');
        this.load.text('scene', 'js/scenes/' + 'Ribbits' + '.json');

        // load sprite furniture and locke
        this.load.spritesheet('sprite_locke', 'assets/img/bedtime/sprite_locke.png', 64, 64);
        this.load.image('bg_bedroom', 'assets/img/bedtime/bg_bedroom.png');
        this.load.atlas('furniture', 'assets/img/bedtime/bedroom.png', 'assets/img/bedtime/bedroom.json');

        // load music and sfx
        this.load.audio('bgm_temp_paino', 'assets/audio/bgm/paino.ogg');
	},

	create: function() {
		// variables
		this.spriteSpeed = 500;

        console.log('Bedtime: create');
        game.sound.stopAll(); 

        bgm = game.add.audio('bgm_temp_paino');
        bgm.loopFull()

        // add background
		this.stage.backgroundColor = "#000";
		var bg = this.add.sprite(128, 64, 'bg_bedroom');

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

		// create room walls player collides with
		game.physics.arcade.setBounds(bg.x, bg.y+150, bg.width, bg.height-150);
		sprite.body.collideWorldBounds = true;

		// add room objects
		this.addFurniture();

		// add notification
		this.notification = this.add.sprite(64*2+10, 64*6+6, 'furniture', 'sprite_notification');

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
		        this.ribbitter.add(ribbitIcon);
		        this.ribbitter.add(ribbitHandle);
		        this.ribbitter.add(ribbitText);
		    }
	    }
	    this.ribbitter.visible = false;

		// fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game, 1000);
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
        if ((this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && game.physics.arcade.overlap(sensor, this.bed)) || this.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
            bgm.fadeOut(500);
            this.camera.fade('#000', 500);
            this.camera.onFadeComplete.addOnce(function () {
                	this.state.start('NextDay');
            }, this);
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
	},
	addFurniture: function(){
		this.bed = this.add.sprite(64*2+8, 64*3+10, 'furniture', 'sprite_bed');
		this.physics.arcade.enable(this.bed);
		this.physics.arcade.collide(sprite, this.bed);
		this.bed.body.immovable = true;

		var desk = this.add.sprite(64*2+4, 64*6+32, 'furniture', 'sprite_desk');
		this.physics.arcade.enable(desk);
		this.physics.arcade.collide(sprite, desk);
	 	desk.body.immovable = true;

	 	var bookshelf1 = this.add.sprite(64*9+6, 64*2+32, 'furniture', 'sprite_bookshelf1');
		this.physics.arcade.enable(bookshelf1);
		this.physics.arcade.collide(sprite, bookshelf1);
	 	bookshelf1.body.immovable = true;

	 	var bookshelf2 = this.add.sprite(64*9+6, 64*6+60, 'furniture', 'sprite_bookshelf2');
		this.physics.arcade.enable(bookshelf2);
		this.physics.arcade.collide(sprite, bookshelf2);
	 	bookshelf2.body.immovable = true;
	 	
	 	var cabinet = this.add.sprite(64*17+10, 64*7+4, 'furniture', 'sprite_cabinet');
		this.physics.arcade.enable(cabinet);
		this.physics.arcade.collide(sprite, cabinet);
	 	cabinet.body.immovable = true;
	 	
	 	this.calendar = this.add.sprite(64*11+2, 64*2+24, 'furniture', 'sprite_calendar');
		this.physics.arcade.enable(this.calendar);
		this.physics.arcade.collide(sprite, this.calendar);
	 	this.calendar.body.immovable = true;

	 	var dresser = this.add.sprite(64*7+38, 64*3+32, 'furniture', 'sprite_dresser');
		this.physics.arcade.enable(dresser);
		this.physics.arcade.collide(sprite, dresser);
	 	dresser.body.immovable = true;

	 	var filecab = this.add.sprite(64*5+6, 64*7+46, 'furniture', 'sprite_file');
		this.physics.arcade.enable(filecab);
		this.physics.arcade.collide(sprite, filecab);
	 	filecab.body.immovable = true;

	 	var friend = this.add.sprite(64*6+48, 64*3+32, 'furniture', 'sprite_friend');
		this.physics.arcade.enable(friend);
		this.physics.arcade.collide(sprite, friend);
	 	friend.body.immovable = true;

	 	var hat = this.add.sprite(64*7+46, 64*4+9, 'furniture', 'sprite_hat');
		this.physics.arcade.enable(hat);
		this.physics.arcade.collide(sprite, hat);
	 	hat.body.immovable = true;

	 	this.lamp = this.add.sprite(64*4+4, 64*3+0, 'furniture', 'sprite_lamp');
		this.physics.arcade.enable(this.lamp);
		this.physics.arcade.collide(sprite, this.lamp);
	 	this.lamp.body.immovable = true;

	 	this.laptop = this.add.sprite(64*2+2, 64*6+44, 'furniture', 'sprite_laptop');
		this.physics.arcade.enable(this.laptop);
		this.physics.arcade.collide(sprite, this.laptop);
	 	this.laptop.body.immovable = true;

	 	var plant1 = this.add.sprite(64*11+8, 64*7+16, 'furniture', 'sprite_plant');
		this.physics.arcade.enable(plant1);
		this.physics.arcade.collide(sprite, plant1);
	 	plant1.body.immovable = true;

	 	var plant2 = this.add.sprite(64*17+8, 64*3+0, 'furniture', 'sprite_plant');
		this.physics.arcade.enable(plant2);
		this.physics.arcade.collide(sprite, plant2);
	 	plant2.body.immovable = true;

	 	var sofa = this.add.sprite(64*14+32, 64*6+24, 'furniture', 'sprite_sofa');
		this.physics.arcade.enable(sofa);
		this.physics.arcade.collide(sprite, sofa);
	 	sofa.body.immovable = true;
	 	
	 	var table = this.add.sprite(64*17+4, 64*4+42, 'furniture', 'sprite_table');
		this.physics.arcade.enable(table);
		this.physics.arcade.collide(sprite, table);
	 	table.body.immovable = true;

	 	var trashcan = this.add.sprite(64*4+12, 64*8+14, 'furniture', 'sprite_trashcan');
		this.physics.arcade.enable(trashcan);
		this.physics.arcade.collide(sprite, trashcan);
	 	trashcan.body.immovable = true;

	 	var tv = this.add.sprite(64*14+36, 64*2+62, 'furniture', 'sprite_tv');
		this.physics.arcade.enable(tv);
		this.physics.arcade.collide(sprite, tv);
	 	tv.body.immovable = true;
	}
};
