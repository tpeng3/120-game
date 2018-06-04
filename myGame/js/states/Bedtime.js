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
        this.load.text('scene', 'js/scenes/ribbits/Ribbits.json');

        // load sprite furniture and locke
        this.load.spritesheet('sprite_locke', 'assets/img/bedtime/sprite_locke.png', 64, 64);
        this.load.spritesheet('arrow', 'assets/img/bedtime/temp_arrow.png', 12, 16);
        this.load.image('bg_bedroom', 'assets/img/bedtime/bg_bedroom.png');
        this.load.image('bg_grey', 'assets/img/bedtime/bg_grey.png');
        this.load.atlas('furniture', 'assets/img/bedtime/bedroom.png', 'assets/img/bedtime/bedroom.json');

        // load music and sfx
        this.load.audio('bgm_temp_paino', 'assets/audio/bgm/paino.ogg');
	},

	create: function() {
		// variables
		this.spriteSpeed = Settings.BEDROOM_SPRITE_SPEED;

        console.log('Bedtime: create');
        game.sound.stopAll(); 

        bgm = game.add.audio('bgm_temp_paino');
        bgm.loopFull()

        this.exit = false;
        this.bedtimeSfx = game.add.audio('sfx_bedtime');
        // add background
		this.stage.backgroundColor = "#000";
		var bg = this.add.sprite(128, 64, 'bg_bedroom');

		// add some instruction text
	 	instrStyle = { font: 'bold Trebuchet MS', fontSize: '22px', fill: '#fff', wordWrap: true, wordWrapWidth: 800, boundsAlignH: 'center' };
		this.add.text(16, 16, 'Use Arrow Keys or WASD to move. Press SPACEBAR at the Bed to sleep.', instrStyle);

		this.physics.startSystem(Phaser.Physics.ARCADE);

		// add room objects
		this.addFurniture();

		// set up furniture flavor text
		var flavor = this.add.text(game.width/2, game.height - 100, '', instrStyle);
		flavor.anchor.setTo(0.5, 0);
		// flavor.setTextBounds(300, 100, 800, 100);
		this.flavorText = '';
		var oldText = '';

		var charNum = 0;
	    this.game.time.events.loop(10, function(){
	    	if(this.flavorText != oldText){
	    		oldText = this.flavorText;
	    		flavor.text = '';
	    		charNum = 0;
	    	}else if(this.flavorText != ''){
	        	if(charNum < this.flavorText.length){
	        		flavor.text += this.flavorText[charNum];
	        		charNum++;
	        	}
	        }else{
	        	flavor.text = '';
	        	charNum = 0;
	        }
      	}, this);

		// add locke
		sprite = this.add.sprite(game.width/2, game.height/2, 'sprite_locke');
		sprite.anchor.set(0.5);
		this.physics.arcade.enable(sprite);
		sprite.body.setSize(sprite.width-6, 20, 6, 44);
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
		game.physics.arcade.setBounds(bg.x, bg.y+186, bg.width, bg.height-186);
		sprite.body.collideWorldBounds = true;

		// for fun
		this.frontFurniture = this.add.group();
		this.frontFurniture.add(this.sofa);
		this.frontFurniture.add(this.bookshelf2);
		this.frontFurniture.add(this.filecab);
		this.frontFurniture.add(this.plant1);
		this.world.bringToTop(this.frontFurniture);
		
		// add notification
		this.notification = this.add.sprite(64*2+10, 64*6+0, 'furniture', 'sprite_notification');
		this.add.tween(this.notification).to( { y: 64*6+6 }, 500, Phaser.Easing.Linear.None, true, 0, 500, true);

		// add arrow pointing to focused furniture
		this.focus = "";
		this.arrow = this.add.sprite(-50, -50, 'arrow');
		this.arrow.animations.add('default', [0, 1], 2, true);
		this.arrow.animations.play('default');

	 	// add ribbitter
	 	this.ribbitter = this.add.group();
	 	var ui_ribbitter = this.add.sprite(256, 120, 'ui_ribbitter');
	 	ui_ribbitter.alpha = 0.97;
	 	this.ribbitter.add(ui_ribbitter);

	 	// add ribbit instructions
	 	var ribbitInstr = this.add.text(game.width/2, game.height - 60, 'Press SPACEBAR or move to close window.', instrStyle);
		ribbitInstr.anchor.set(0.5, 1);
		this.ribbitter.add(ribbitInstr);

	 	// parse those ribbits
        var ribbits = JSON.parse(this.game.cache.getText('scene'));
        var date = calendar.printDate() - 1;

	 	titleStyle = { font: 'bold Trebuchet MS', fontSize: '22px', fill: '#333'};
	 	textStyle = { font: 'Trebuchet MS', fontSize: '18px', fill: '#333', wordWrap: true, wordWrapWidth: 64*7 };

	 	var prevHeight = 240;
	 	var ribbitCount = 0; // max ribbits per day is 3
	 	for(i=0; i<ribbits[date].length; i++){
	 		if( (ribbits[date][i].condition == null || eval(ribbits[date][i].condition) 
	 			&& ribbitCount < 3)){
		 		var handle, icon = ribbits[date][i].icon;
		 		var ribbitIcon = this.add.sprite(500, prevHeight, icon);
		 		if(icon == 'icon_locke') handle = '@5urelocke';
				else if(icon == 'icon_tai') handle = '@trainger_yellow';
				else if(icon == 'icon_keyna') handle = '@DetectiveK';
				else if(icon == 'icon_lynn') handle = '@tiredmomcop';
				var ribbitHandle = this.add.text(545, prevHeight, handle, titleStyle);
		        prevHeight = prevHeight + ribbitHandle.height;
		        var ribbitText = this.add.text(540, prevHeight, ribbits[date][i].text, textStyle);
		        ribbitText.lineSpacing = -4;
		        prevHeight = prevHeight + ribbitText.height + 8;
		        if(i != ribbits[date].length-1){
			        var ribbitDividier = this.add.sprite(492, prevHeight, 'bg_grey');
			        ribbitDividier.scale.setTo(512, 2);
			        prevHeight = prevHeight + ribbitDividier.height + 12;
		        }

		        this.ribbitter.add(ribbitIcon);
		        this.ribbitter.add(ribbitHandle);
		        this.ribbitter.add(ribbitText);
		        this.ribbitter.add(ribbitDividier);
		        ribbitCount++;
		    }
	    }
	    this.ribbitter.visible = false;

	    // for the lamp lighting
		this.lighting = this.add.sprite(0, 0, 'bg_grey');
		this.lighting.scale.setTo(game.width, game.height);
		this.lighting.tint = 0x333;
		this.lighting.alpha = .6;
		this.lighting.visible = false;

		// fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game, 1000);
        this.fadeIn = false;
        this.game.time.events.add(1000, function(){
        	this.fadeIn = true;
        }, this);
	},
    update: function () {
        // Movement code
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

        // Just for fun, hold SHIFT if you just want to change the direction and not move
        if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        	dir.x = 0;
        	dir.y = 0;
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
            this.ribbitter.visible = (this.ribbitter.visible ? false : false);
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
            this.ribbitter.visible = (this.ribbitter.visible ? false : false);
		}
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
	    	game.input.keyboard.isDown(Phaser.Keyboard.S)) {
	    	sprite.animations.play('down');
	    	this.spriteDirection = 1;
	        sensor.anchor.setTo(.5,.25);
            this.ribbitter.visible = (this.ribbitter.visible ? false : false);
	    }
	    else{
	    	sprite.animations.stop();
	    	sprite.animations.frame = this.spriteDirection;
	        sprite.body.velocity.setTo(0, 0);
	    }

	    // update sensor positions
	    sensor.x = sprite.x;
	    sensor.y = sprite.y;

	    // check collision with furniture
	    this.checkFurniture();
	},
	addFurniture: function(){
		this.bed = this.add.sprite(64*2+4, 64*4+6, 'furniture', 'sprite_bedcover');
		this.physics.arcade.enable(this.bed);
		this.bed.body.setSize(this.bed.width, this.bed.height/2, 0, 40);
		this.bed.body.immovable = true;

		this.bedframe = this.add.sprite(this.bed.x, this.bed.y, 'bg_black');
		this.bedframe.scale.setTo(this.bed.width-20, 12);
		this.bedframe.alpha = 0;
		this.physics.arcade.enable(this.bedframe);
		this.bedframe.body.immovable = true;

		this.bedsensor = this.add.sprite(this.bed.x, this.bed.y+this.bed.height-10, 'bg_black');
		this.bedsensor.scale.setTo(this.bed.width, 20);
		this.bedsensor.alpha = 0;
		this.physics.arcade.enable(this.bedsensor);
		this.bedsensor.body.immovable = true;

		this.desk = this.add.sprite(64*2+4, 64*6+32, 'furniture', 'sprite_desk');
		this.physics.arcade.enable(this.desk);
	 	this.desk.body.immovable = true;

	 	this.bookshelf1 = this.add.sprite(64*9+6, 64*2+32, 'furniture', 'sprite_bookshelf1');
		this.physics.arcade.enable(this.bookshelf1);
	 	this.bookshelf1.body.immovable = true;

	 	this.bookshelf2 = this.add.sprite(64*9+6, 64*6+60, 'furniture', 'sprite_bookshelf2');
		this.physics.arcade.enable(this.bookshelf2);
		this.bookshelf2.body.setSize(this.bookshelf2.width, 48, 0, this.bookshelf2.height-48);
	 	this.bookshelf2.body.immovable = true;
	 	
	 	this.cabinet = this.add.sprite(64*17+10, 64*7+4, 'furniture', 'sprite_cabinet');
		this.physics.arcade.enable(this.cabinet);
	 	this.cabinet.body.immovable = true;
	 	
	 	this.calendar = this.add.sprite(64*11+2, 64*2+24, 'furniture', 'sprite_calendar');
		this.physics.arcade.enable(this.calendar);
	 	this.calendar.body.immovable = true;

	 	this.dresser = this.add.sprite(64*7+38, 64*3+32, 'furniture', 'sprite_dresser');
		this.physics.arcade.enable(this.dresser);
	 	this.dresser.body.immovable = true;

	 	this.filecab = this.add.sprite(64*5+6, 64*7+46, 'furniture', 'sprite_file');
		this.physics.arcade.enable(this.filecab);
		this.filecab.body.setSize(this.filecab.width, 48, 0, this.filecab.height-48);
	 	this.filecab.body.immovable = true;

	 	this.friend = this.add.sprite(64*6+48, 64*3+32, 'furniture', 'sprite_friend');
		this.physics.arcade.enable(this.friend);
	 	this.friend.body.immovable = true;

	 	this.hat = this.add.sprite(64*7+46, 64*4+9, 'furniture', 'sprite_hat');
		this.physics.arcade.enable(this.hat);
	 	this.hat.body.immovable = true;

	 	this.lamp = this.add.sprite(64*4+4, 64*3+0, 'furniture', 'sprite_lamp');
		this.physics.arcade.enable(this.lamp);
	 	this.lamp.body.immovable = true;

	 	this.lampsensor = this.add.sprite(64*4+8, 64*3+0, 'bg_black');
	 	this.lampsensor.scale.setTo(this.lamp.width-8, 40);
		this.lampsensor.alpha = 0;
		this.physics.arcade.enable(this.lampsensor);
	 	this.lampsensor.body.immovable = true;

	 	this.laptop = this.add.sprite(64*2+2, 64*6+44, 'furniture', 'sprite_laptop');
		this.physics.arcade.enable(this.laptop);
	 	this.laptop.body.immovable = true;

	 	this.plant1 = this.add.sprite(64*11+8, 64*7+16, 'furniture', 'sprite_plant');
		this.physics.arcade.enable(this.plant1);
		this.plant1.body.setSize(this.plant1.width, 48, 0, this.plant1.height-48);
	 	this.plant1.body.immovable = true;

	 	this.plant2 = this.add.sprite(64*17+8, 64*3+0, 'furniture', 'sprite_plant');
		this.physics.arcade.enable(this.plant2);
	 	this.plant2.body.immovable = true;

	 	this.sofa = this.add.sprite(64*14+32, 64*6+24, 'furniture', 'sprite_sofa');
		this.physics.arcade.enable(this.sofa);
		this.sofa.body.setSize(this.sofa.width, 10, 0, this.sofa.height-10);
	 	this.sofa.body.immovable = true;

	 	this.armrest1 = this.add.sprite(this.sofa.x, this.sofa.y, 'bg_black');
		this.armrest1.scale.setTo(6, this.sofa.height);
		this.armrest1.alpha = 0;
		this.physics.arcade.enable(this.armrest1);
		this.armrest1.body.immovable = true;

		this.armrest2 = this.add.sprite(this.sofa.x+this.sofa.width-6, this.sofa.y, 'bg_black');
		this.armrest2.scale.setTo(6, this.sofa.height);
		this.armrest2.alpha = 0;
		this.physics.arcade.enable(this.armrest2);
		this.armrest2.body.immovable = true;

		this.sofasensor = this.add.sprite(this.sofa.x, this.sofa.y+this.sofa.height+0, 'bg_black');
		this.sofasensor.scale.setTo(this.sofa.width, 40);
		this.sofasensor.alpha = 0;
		this.physics.arcade.enable(this.sofasensor);
		this.sofasensor.body.immovable = true;
	 	
	 	this.table = this.add.sprite(64*17+4, 64*4+42, 'furniture', 'sprite_table');
		this.physics.arcade.enable(this.table);
		this.table.body.setSize(this.table.width, this.table.height-16, 0, 0);
	 	this.table.body.immovable = true;

	 	this.trashcan = this.add.sprite(64*4+12, 64*8+14, 'furniture', 'sprite_trashcan');
		this.physics.arcade.enable(this.trashcan);
	 	this.trashcan.body.immovable = true;

	 	this.tv = this.add.sprite(64*14+36, 64*2+62, 'furniture', 'sprite_tv');
		this.physics.arcade.enable(this.tv);
	 	this.tv.body.immovable = true;
	},
	checkFurniture: function(){
	    // set all the furniture collisions
        this.physics.arcade.collide(sprite, this.bed);
        this.physics.arcade.collide(sprite, this.bedframe);
        this.physics.arcade.collide(sprite, this.sofa);
        this.physics.arcade.collide(sprite, this.armrest1);
        this.physics.arcade.collide(sprite, this.armrest2);
        this.physics.arcade.collide(sprite, this.laptop);
        this.physics.arcade.collide(sprite, this.lamp);
        this.physics.arcade.collide(sprite, this.bookshelf1);
        this.physics.arcade.collide(sprite, this.bookshelf2);
        this.physics.arcade.collide(sprite, this.cabinet);
        this.physics.arcade.collide(sprite, this.calendar);
        this.physics.arcade.collide(sprite, this.dresser);
        this.physics.arcade.collide(sprite, this.filecab);
        this.physics.arcade.collide(sprite, this.friend);
        this.physics.arcade.collide(sprite, this.hat);
        this.physics.arcade.collide(sprite, this.desk);
        this.physics.arcade.collide(sprite, this.plant1);
        this.physics.arcade.collide(sprite, this.plant2);
        this.physics.arcade.collide(sprite, this.table);
        this.physics.arcade.collide(sprite, this.trashcan);
        this.physics.arcade.collide(sprite, this.tv);

        // fun bed layering effect
        if(game.physics.arcade.overlap(sensor, this.bedsensor)){
			this.world.bringToTop(sprite);
			this.world.bringToTop(this.notification);
        }else{
        	if(this.fadeIn == true){
        		this.world.bringToTop(this.bed);
				this.world.bringToTop(this.frontFurniture);
			}
        }

        // fun sofa layering effect
        if(game.physics.arcade.overlap(sprite, this.sofasensor)){
			this.world.bringToTop(sprite);
        }else{
        	if(this.fadeIn == true){
	        	this.world.bringToTop(this.sofa);
				this.world.bringToTop(this.frontFurniture);
        	}
        }

	    // check for sensor overlap
	    if(game.physics.arcade.overlap(sensor, this.lampsensor)){
            this.focus = "lampsensor";
			this.arrow.x = this.lampsensor.x+(this.lampsensor.width/2) - 6;
			this.arrow.y = this.lampsensor.y - 20;
	    }else if(game.physics.arcade.overlap(sensor, this.bedframe)){
	        this.focus = "bedframe";
	        this.arrow.x = this.bedframe.x+(this.bedframe.width/2) + 2;
			this.arrow.y = this.bedframe.y - 72;
        }else if(game.physics.arcade.overlap(sensor, this.laptop)){
			this.focus = "laptop";
			this.arrow.x = this.laptop.x+(this.laptop.width/2) - 2;
			this.arrow.y = this.laptop.y - 10;
	    }else if(game.physics.arcade.overlap(sensor, this.hat)){
            this.focus = "hat";
            this.arrow.x = this.hat.x+(this.hat.width/2) - 4;
			this.arrow.y = this.hat.y - 16;
		}else if(game.physics.arcade.overlap(sensor, this.calendar)){
            this.focus = "calendar";
            this.arrow.x = this.calendar.x+(this.calendar.width/2) - 6;
			this.arrow.y = this.calendar.y - 16;
	    }else if(game.physics.arcade.overlap(sensor, this.bookshelf1)){
            this.focus = "bookshelf1";
            this.arrow.x = this.bookshelf1.x+(this.bookshelf1.width/2) - 4;
			this.arrow.y = this.bookshelf1.y - 16;
	    }else if(game.physics.arcade.overlap(sensor, this.bookshelf2)){
            this.focus = "bookshelf2";
            this.arrow.x = this.bookshelf2.x+(this.bookshelf2.width/2) - 4;
			this.arrow.y = this.bookshelf2.y - 16;
        }else if(game.physics.arcade.overlap(sensor, this.cabinet)){
            this.focus = "cabinet";
            this.arrow.x = this.cabinet.x+(this.cabinet.width/2) - 6;
			this.arrow.y = this.cabinet.y;
	    }else if(game.physics.arcade.overlap(sensor, this.filecab)){
            this.focus = "filecab";
            this.arrow.x = this.filecab.x+(this.filecab.width/2) - 4;
			this.arrow.y = this.filecab.y - 16;
	    }else if(game.physics.arcade.overlap(sensor, this.friend)){
            this.focus = "friend";
            this.arrow.x = this.friend.x+(this.friend.width/2);
			this.arrow.y = this.friend.y - 16;
	    }else if(game.physics.arcade.overlap(sensor, this.plant1)){
            this.focus = "plant1";
            this.arrow.x = this.plant1.x+(this.plant1.width/2) - 6;
			this.arrow.y = this.plant1.y - 20;
	    }else if(game.physics.arcade.overlap(sensor, this.table)){
            this.focus = "table";
            this.arrow.x = this.table.x+(this.table.width/2) - 6;
			this.arrow.y = this.table.y - 8;
	    }else if(game.physics.arcade.overlap(sensor, this.trashcan)){
            this.focus = "trashcan";
            this.arrow.x = this.trashcan.x+(this.trashcan.width/2) - 6;
			this.arrow.y = this.trashcan.y - 20;
        }else if(game.physics.arcade.overlap(sensor, this.tv)){
            this.focus = "tv";
            this.arrow.x = this.tv.x+(this.tv.width/2) - 6;
			this.arrow.y = this.tv.y - 16;
        }else{
        	if(this.focus != ""){
				eval("var furnx = this."+this.focus+".x");
	        	eval("var furny = this."+this.focus+".y");
	        	var diff1 = (sprite.x - furnx);
				var diff2 = (sprite.y - furny);
			    if( Math.sqrt( (diff1*diff1)+(diff2*diff2) ) > 64){
			    	this.focus = "";
        			this.flavorText = "";
			    	this.arrow.x = -50;
			    	this.arrow.y = -50;
			    }
        	}
        	this.ribbitter.visible = (this.ribbitter.visible ? false : false);
		}

        // check for interactions with furniture
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && this.focus != ""){
        	// this.flavorText = "";
        	switch(this.focus){
        		// you can dim the room lighting
        		case "lampsensor":
	            	this.lighting.visible = (this.lighting.visible? false : true);
	            	break;
	        	// if colliding with bed
                case "bedframe":
                    if (this.exit == false) {
                        this.exit = true;
                        game.sound.stopAll(); 
                        this.bedtimeSfx.play();
                        bgm.fadeOut(2000);
                        this.camera.fade('#000', 2000);
                        this.camera.onFadeComplete.addOnce(function () {
                            this.state.start('NextDay');
                        }, this);
                    }
        			break;
        		// if player check laptop, opens up social media
        		case "laptop":
			    	if(this.ribbitter.visible == false){
			    		this.ribbitter.visible = true;
			    		this.notification.visible = false;
			    	}else{
			    		this.ribbitter.visible = false;
			    	}
			    	break;
	    		// now for furniture that has flavor text
	    		case "hat":
          		  	this.flavorText = 'You got this hat from Tai as a birthday present, but you\'ve yet to find a good opportunity to wear it.';
          		  	break;
          		case "bookshelf1":
            		this.flavorText = 'A bookshelf full of your favorite mystery novels.';
            		break;
            	case "bookshelf2":
	            	this.flavorText = 'A bookshelf full of your favorite non-mystery novels.';
	            	break;
	            case "cabinet":
            		this.flavorText = 'It\'s a shoe cabinet!';
            		break;
            	case "calendar":
	            	this.flavorText = 'Today is ' + calendar.printDay() + '.';
	            	break;
	            case "filecab":
	            	this.flavorText = 'You bought this file cabinet to store old cases, but lately it\'s been more of a stationary cabinet.';
	            	break;
	            case "friend":
	            	this.flavorText = 'Dr. Watsy has always been the bravest and truest of friends.';
	            	break;
	            case "plant1":
	            	this.flavorText = 'A housewarming present from Tai. It\'s fake because he knows you well.';
	            	break;
	            case "table":
	            	this.flavorText = 'It\'s a table.';
	            	break;
	            case "trashcan":
	            	this.flavorText = 'The trash can is empty.';
	            	break;
	            case "tv":
	            	this.flavorText = 'You\'re too tired to watch tv today.';
	            	break;
	        }
	    }

		// extra layering stuff
        this.world.bringToTop(this.arrow);
        this.world.bringToTop(this.lighting);
        this.world.bringToTop(this.ribbitter);
	},
	render: function(){
		// game.debug.body(sprite);
		// game.debug.body(this.lampsensor);
		// game.debug.body(sensor);
		// game.debug.body(this.lamp);
		// // game.debug.body(this.sofa);
		// game.debug.body(this.plant1);
		// game.debug.body(this.trashcan);
		// game.debug.body(this.table);
		// // game.debug.body(this.armrest1);
		// // game.debug.body(this.armrest2);
		// game.debug.body(this.bed);
		// game.debug.body(this.bedframe);
		// game.debug.body(this.bookshelf1);
	}
};
