// Player prefab constructor function
// Args: game (Phaser.Game), startingHealth (due to fatigue can be lower, usually 3)
// enemyGroup: 
function Player(game, startingHealth, enemyGroup) {
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height/2, 'bh_locke', 0);
    // game.add.existing(this);
    this.core = game.add.sprite(this.x, this.y+12, 'bh_locke_core', 0);
    this.core.anchor.setTo(0.5);
	// Sprite stuff
    this.anchor.set(0.5, 0.5);
    this.animations.add('left', [0, 2], 1, true);
    this.animations.add('right', [1, 3], 1, true);
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
    this.body.setSize(12, 12, 26, 38);
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
        this.core.visible = true;
    } else {
        this.bulletDamage = 1;
        this.currSpeed = this.maxSpeed;
        this.core.visible = false;
    }
    //Movement code
    var xVel = 0;
    var yVel = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
        game.input.keyboard.isDown(Phaser.Keyboard.W)){
        yVel -= this.currSpeed;
	}
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
        game.input.keyboard.isDown(Phaser.Keyboard.S)){
        yVel += this.currSpeed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
        game.input.keyboard.isDown(Phaser.Keyboard.D)){
        xVel += this.currSpeed;
        this.animations.play('right');
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
        game.input.keyboard.isDown(Phaser.Keyboard.A)){
        xVel -= this.currSpeed;
        this.animations.play('left');
    }
    this.body.velocity.x = xVel;
    this.body.velocity.y = yVel;
    
    // update core position
    this.core.x = this.x;
    this.core.y = this.y+12;

    //Shooting code
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.isReadyToShoot) {
        new Bullet(game, 'locke_bullet', this.x, this.y, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.enemyGroup, Player.bulletGroup);
        this.shotSfx.play();
        this.isReadyToShoot = false;
        game.time.events.add(this.firingDelay, this.readyToShoot, this);
    }

    game.world.bringToTop(this.core);
}
Player.prototype.readyToShoot = function () {
    this.isReadyToShoot = true;
}
Player.prototype.damage = function (damage) {
    this.currHealth -= damage;
    if (this.currHealth <= 0)
        this.kill();
}

