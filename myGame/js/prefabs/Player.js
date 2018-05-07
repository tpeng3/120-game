// Player prefab constructor function
function Player(game, key, frame, startingHealth) {
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height/2, key, frame);

	// Sprite stuff
    this.anchor.set(0.5, 0.5);
    this.scale.x = 2;
    this.scale.y = 2;
    //Player stuff
    this.maxHealth = 3;
    this.currHealth = startingHealth;
    this.speed = 200;


	// put some physics on it
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// override Phaser.Sprite update (to spin the diamond)
Player.prototype.update = function () {
    var xVel = 0;
    var yVel = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        yVel -= this.speed;
	}
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        yVel += this.speed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        xVel += this.speed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        xVel -= this.speed;
    }
    this.body.velocity.x = xVel;
    this.body.velocity.y = yVel;
}

