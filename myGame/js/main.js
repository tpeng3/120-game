// We're changing the default window size to a longer height
//var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var game = new Phaser.Game(400, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	// preload assets
	game.load.image('sky', 'assets/img/sky.png');
	game.load.image('ground', 'assets/img/platform.png');
	game.load.image('star', 'assets/img/star.png');
	game.load.image('diamond', 'assets/img/diamond.png');
	game.load.image('poo', 'assets/img/poo.png');
	// add a new item called diamond that's worth 25 points
	game.load.image('diamond', 'assets/img/diamond.png');
	// changing the dude to the baddie sprite
	// game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
	game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
}

// some global variables since they're used in both the create and update functions
var platforms;

var score = 0;
var scoreText;

function create() {
	// place your assets

	// We're going to be using physics, so enable the Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// A simple background for our game (add from top left)
	game.add.sprite(0, 0, 'sky');

	// The platforms group contains the ground and the 2 ledges we can jump on
	platforms = game.add.group();
	// We will enable physics for any object that is created in this group
	platforms.enableBody = true;

	// Here we create the ground.
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	// Scale it to fit the width of the game (the original sprite is 400x32 in size)
	ground.scale.setTo(2, 2);
	// This stops it from falling away when you jump on it
	ground.body.immovable = true;

	// Create five ledges
	var ledge = platforms.create(-300, 150, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(250, 200, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-250, 250, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 350, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(300, 450, 'ground');
	ledge.body.immovable = true;

	// Add the player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'baddie');
    // We need to enable physics on the player
    game.physics.arcade.enable(player);
    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    // Our two animations, walking left and right.
    // Note the 10 means 10 frames per second.
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2, 3], 10, true);

    // Set arrow cursor input
    cursors = game.input.keyboard.createCursorKeys();

    // Add the stars group
    stars = game.add.group();
	stars.enableBody = true;
	// Here we'll create 12 of them evenly spaced apart
	for(var i=0; i<12; i++){
		// Create a star inside of the 'stars' group
		var star = stars.create(i * 33, 0, 'star');
		// Let gravity do its thing, they're falling from the top
		star.body.gravity.y = 6;
		// This just gives each star a slightly random bounce value
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	// Create a diamond item that spawns randomly somewhere visible on the screen
	diamonds = game.add.group();
	diamonds.enableBody = true;
	var randomX = Math.floor(Math.random() * 400);
	var randomY = Math.floor(Math.random() * 400); // 600 - 200 to account for unreachable ground space
	var diamond = diamonds.create(randomX, randomY, 'diamond');

    // Set the initial score
	scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: "#000"});
}

function update() {
	// run game loop

	// Collide the player and the stars with the platforms
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	// calls function collectStar to update if player grabs a star
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	// calls function collectDia to update if player grabs a diamond
	game.physics.arcade.overlap(player, diamonds, collectDia, null, this);

	// Reset the players velocity (movement)
	player.body.velocity.x = 0;

    // Update player movement and animation
	if(cursors.left.isDown){
		// Move to the left
		player.body.velocity.x = -150;
		player.animations.play('left');
	}else if(cursors.right.isDown){
		// Move to the right
		player.body.velocity.x = 150;
		player.animations.play('right');
	}else{
		// Stand still
		player.animations.stop();
		player.frame = 4;
	}

	// Allow the player to jump if they are touching the ground.
	if(cursors.up.isDown && player.body.touching.down && hitPlatform)
		player.body.velocity.y = -350;
}

function collectStar(player, star){
	// Removes the star from the screen
	star.kill();

	// Add and update the score
	score += 10;
	scoreText.text = 'Score: ' + score;
}

function collectDia(player, diamond){
	// Removes the diamond from the screen
	diamond.kill();

	// Add and update the score
	score += 25;
	scoreText.text = 'Score: ' + score;
}