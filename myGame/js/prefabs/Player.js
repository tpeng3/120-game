// Player prefab constructor function
// Args: game (Phaser.Game), startingHealth (due to fatigue can be lower, usually 3)
// enemyGroup: 
function Player(game, startingHealth, enemyGroup) {
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height/2, 'bh_locke', 0);

	// Sprite stuff
    this.anchor.set(0.5, 0.5);
    //Group stuff
    this.enemyGroup = enemyGroup
    //Player stuff
    this.maxHealth = 3;
    this.currHealth = startingHealth;
    this.maxSpeed = 250;
    this.currSpeed = this.maxSpeed;
    this.shiftSpeed = 100;
    this.showHitbox = false;
    //Bullet Stuff
    if (Player.bulletGroup == null)
        Player.bulletGroup = game.add.group();
    this.shotSfx = game.add.audio('sfx_player_laser');
    this.bulletSpeed = 700;
    this.bulletDamage = 1;
    this.bulletAngle = new Phaser.Point(0, 1); //angle of shots (as Vec2d (Phaser.Point))
    this.firingDelay = 100;//fire every this amount of milliseconds
    this.isReadyToShoot = true;
	// put some physics on it
	game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(32, 32, this.width/4, this.height/4);
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.bulletGroup = null;

// override Phaser.Sprite update (to spin the diamond)
Player.prototype.update = function () {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
        this.bulletDamage = 2;
        this.currSpeed = this.shiftSpeed;
        this.showHitbox = true;
    } else {
        this.bulletDamage = 1;
        this.currSpeed = this.maxSpeed;
        this.showHitbox = false;
    }
    //Movement code
    var xVel = 0;
    var yVel = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        yVel -= this.currSpeed;
	}
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        yVel += this.currSpeed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        xVel += this.currSpeed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        xVel -= this.currSpeed;
    }
    this.body.velocity.x = xVel;
    this.body.velocity.y = yVel;
    //Shooting code
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.isReadyToShoot) {
        new Bullet(game, 'locke_bullet', this.x, this.y, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.enemyGroup, Player.bulletGroup);
        this.shotSfx.play();
        this.isReadyToShoot = false;
        game.time.events.add(this.firingDelay, this.readyToShoot, this);
    }
}
Player.prototype.readyToShoot = function () {
    this.isReadyToShoot = true;
}
Player.prototype.damage = function (damage) {
    this.currHealth -= damage;
    if (this.currHealth <= 0)
        this.kill();
}

