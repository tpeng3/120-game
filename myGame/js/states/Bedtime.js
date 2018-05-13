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
        
        this.load.image('ui_ribitter', 'assets/img/ui/ui_ribbitter.png');
        this.load.image('bg_bedroom', 'assets/img/bg/bg_bedroom.png');

        this.load.spritesheet('sprite_locke', 'assets/img/bedtime/sprite_locke.png', 64, 64);
        this.load.image('sprite_bed', 'assets/img/bedtime/sprite_bed.png');
        this.load.image('sprite_desk', 'assets/img/bedtime/sprite_desk.png');
	},

	create: function() {
		// variables
		this.spriteSpeed = 200;

        console.log('Bedtime: create');
        game.sound.stopAll(); 

        // add background
		this.stage.backgroundColor = "#000";
		var bg = this.add.sprite(64*2, 64*1, 'bg_bedroom');

		this.physics.startSystem(Phaser.Physics.ARCADE);

		// add locke
		sprite = this.add.sprite(game.width/2, game.height/2, 'sprite_locke');
		sprite.anchor.set(0.5);
		this.physics.arcade.enable(sprite);
		sprite.animations.add('down', [0, 1, 2, 1], 10, true);
		sprite.animations.add('left', [3, 4, 5, 4], 10, true);
		sprite.animations.add('right', [6, 7, 8, 7], 10, true);
		sprite.animations.add('up', [9, 10, 11, 10], 10, true);
		this.spriteDirection = 1; // facing down is default

		// create boundaries player basically collides with
		game.physics.arcade.setBounds(bg.x, bg.y, bg.width, bg.height);
		sprite.body.collideWorldBounds = true;

		// add room objects
		this.bed = this.add.sprite(64*2, 64*1, 'sprite_bed');
		this.physics.arcade.enable(this.bed);
		this.physics.arcade.collide(sprite, this.bed);
		this.bed.body.immovable = true;

		this.desk = this.add.sprite(64*12, 64*1, 'sprite_desk');
		this.physics.arcade.enable(this.desk);
		this.physics.arcade.collide(sprite, this.desk);
	 	this.desk.body.immovable = true;

		// fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game);
	},

	update: function () {
		// Sorry the movement here is super ugly I do want to fix it next sprint
		// update player sprite movement
	    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
	    	game.input.keyboard.isDown(Phaser.Keyboard.W)) {
	    	sprite.animations.play('up');
	    	this.spriteDirection = 10;
	        sprite.body.velocity.y = -this.spriteSpeed;
		}
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
	    	game.input.keyboard.isDown(Phaser.Keyboard.S)) {
	    	sprite.animations.play('down');
	    	this.spriteDirection = 1;
	        sprite.body.velocity.y = this.spriteSpeed;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
	    	game.input.keyboard.isDown(Phaser.Keyboard.D)) {
	    	sprite.animations.play('right');
	    	this.spriteDirection = 7;
	        sprite.body.velocity.x = this.spriteSpeed;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
	    	game.input.keyboard.isDown(Phaser.Keyboard.A)) {
	    	sprite.animations.play('left');
	    	this.spriteDirection = 4;
	        sprite.body.velocity.x = -this.spriteSpeed;
	    }
	    else{
	    	sprite.animations.stop();
	    	sprite.animations.frame = this.spriteDirection;
	        sprite.body.velocity.x = 0;
	        sprite.body.velocity.y = 0;
	    }

	    // if player checks bed, go to sleep and proceed back to activity decision
	    // I keep forgetting results screen is on Sunday and not like, at the end of the day
        // var hitBed = this.physics.arcade.collide(sprite, this.bed);
	    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.physics.arcade.collide(sprite, this.bed)){
	    	console.log("checking bed");
	    	calendar.nextDay();
	    	this.state.start('ActivityDecision');
	    }
	    // if player check desks, opens up social media
	    // should we make tweets like a prefab or function like the textbox?
        // var hitDesk = this.physics.arcade.collide(sprite, this.desk);
	    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.physics.arcade.collide(sprite, this.desk)){
	    	console.log("checking desk");
	    	// looks like I won't be able to make the social media ui for this sprint
	    }

		// press ENTER to proceed to the next state
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
			this.state.start('ActivityDecision');
		}
	}
};
