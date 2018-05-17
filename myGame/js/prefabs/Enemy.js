// Enemy prefab constructor function
// This enemy base class will can be damaged, killed, will damage the player on contact, and has a variable movement pattern
// Args: game (Phaser.game), xPos, yPos (spawnPosition), imageKey (image must already be loaded), startingHealth (int), +
// target: the target of this enemy, for tracking shots and movement patterns (usually the player, but doesn't have to be)
// movementPattern: an AI movement pattern that is run every frame (in update) (function object). use Enemy.movementPattern_functionName (static functions defined in this file) (can be null/undefined)
//     -example: Enemy.movementPatter_followTarget (track the player/target and follows them)
function Enemy(game, xPos, yPos, imageKey, startingHealth, target, movementPattern) {
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, xPos, yPos, imageKey);

    // Sprite stuff
    this.anchor.set(0.5, 0.5);
    //Scaling is temp
    this.scale.x = 2;
    this.scale.y = 2;
    //Define static bullet group if not defined (in here to access game properly)
    if (Enemy.bulletGroup == null)
        Enemy.bulletGroup = game.add.group();
    //Store movement pattern(with default)
    if (movementPattern == undefined || movementPattern == null)
        this.movementPattern = Enemy.movementPattern_doNothing;
    else
        this.movementPattern = movementPattern;
    //Set stats and target (player usually)
    this.deathSfx = game.add.audio('sfx_enemy_death');
    this.maxHealth = 3;
    this.currHealth = startingHealth;
    this.speed = 100;
    this.target = target;
    //Enable physics
    game.physics.enable(this);
    this.body.collideWorldBounds = true;
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Enemy)
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.bulletGroup = null; //Initialize the enemy bullet group (static)

//Call the movement pattern, and damage the player if the player is hit (can change any value of enemy)
Enemy.prototype.update = function () {
    this.movementPattern.call(this);
    game.physics.arcade.overlap(this, this.target, function (self, player) { player.damage(1); self.kill(); });
}
//take damage and die if necessary
Enemy.prototype.damage = function (numDamage) {
    this.currHealth -= numDamage;
    if (this.currHealth <= 0) {
        this.deathSfx.play();
        this.destroy();
    }
}

//MOVEMENT PATTERNS (static functions)

//DO nothing
Enemy.movementPattern_doNothing = function () {
}
//Follow the target around
Enemy.movementPattern_followTarget = function () {
    game.physics.arcade.moveToObject(this, this.target, this.speed);
}

//EnemyShooter prefab (shootingPattern is a function that determines the shooting patters)
//Has all the features that enemy does, but shoots bullets in variable pattern, at a variable speed
//Args: see Enemy Constructor (above in this file) +
//shootingPattern: an AI movement shooting that is run in update but only actually executes after waiting for firingDelay (function object) use EnemyShooter.shootingPattern_functionName (static functions defined in this file)
//bulletSpeed: speed of fired bullets (int) <optional, default = 400>
//firingDelay: delay between actual executions of this.shootingPattern (milliseconds) <optional, default = 1000 + (100 * Math.random())>
function EnemyShooter(game, xPos, yPos, imageKey, startingHealth, target, movementPattern, shootingPattern, bulletSpeed, firingDelay) {
    Enemy.call(this, game, xPos, yPos, imageKey, startingHealth, target, movementPattern) //call base class constructor
    this.tint = 0x9999ff
    //set shooting pattern and sfx
    this.shootingPattern = shootingPattern;
    this.shotSfx = game.add.audio('sfx_player_laser');
    this.bulletAngle = new Phaser.Point(0, -1)
    this.bulletDamage = 1;
    //set bulletspeed (with default value)
    if (bulletSpeed != undefined)
        this.bulletSpeed = bulletSpeed;
    else
        this.bulletSpeed = 400;
    //set firing speed (with default value)
    if (firingDelay != undefined)
        this.firingDelay = firingDelay;
    else
        this.firingDelay = 1000 + (100 * Math.random());//fire every this amount of milliseconds
    this.isReadyToShoot = true;
}
//Finish prefab stuff
EnemyShooter.prototype = Object.create(Enemy.prototype);
Enemy.prototype.constructor = EnemyShooter;

//Call shooting pattern if ready to shoot
EnemyShooter.prototype.update = function () {
    Enemy.prototype.update.call(this); //call the base update
    if (this.isReadyToShoot)
        this.shootingPattern.call(this);
}
//Set the firing angle (helper member unction used in shooting patterns)
//Args: angle: the angle in radians (or in degrees, if fromDegrees = true)
//fromDegrees: interpret as degrees? (bool) <optional>
EnemyShooter.prototype.setAngle = function (angle, fromDegrees) {
    let tempAngle = angle
    if (fromDegrees == true)
        tempAngle = angle * (Math.PI / 180);
    //TRIGONOMETRY WOOOOOOOO
    this.bulletAngle.x = -1 * Math.cos(tempAngle);
    this.bulletAngle.y = Math.sin(tempAngle);
}
//Shoot a bullet (helper member unction used in shooting patterns)
//Args: isDestructible (will be replaced by bulletType when there are more types) the type of bullet to shoot (bool) <optional>
EnemyShooter.prototype.shoot = function (isDestructible) {
    var bullet;
    if (isDestructible) {
        bullet = new DestructibleBullet(game, 'enemy_bullet_l', this.x, this.y, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.target, Enemy.bulletGroup, Player.bulletGroup);
        bullet.tint = 0x666666;
    } else {
        bullet = new Bullet(game, 'enemy_bullet', this.x, this.y, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.target, Enemy.bulletGroup);
    }
    this.shotSfx.play();
}
//Finish shooting and start the delay (CALL AT THE END OF ALL SHOOTING PATTERN FUNCTIONS)
EnemyShooter.prototype.finishShooting = function() {
    this.isReadyToShoot = false;
    game.time.events.add(this.firingDelay, function () { this.isReadyToShoot = true; }, this);
}

//SHOOTING PATTERNS (static functions)

//Shoot a bullet at the target
EnemyShooter.shootingPattern_shootAtTarget = function () {
    let angle = Phaser.Point.angle(new Phaser.Point(this.x,this.y), new Phaser.Point(this.target.x, this.target.y));
    this.setAngle(angle);
    this.shoot();
    this.finishShooting();
}

//shoot a round flower pattern or destructible and non-destructible bullets
EnemyShooter.shootingPattern_flower = function () {
    let angle = Phaser.Point.angle(new Phaser.Point(this.x, this.y), new Phaser.Point(this.target.x, this.target.y));
    var Destructible = false;
    for (let i = 0; i < 36; ++i) {
        this.setAngle(angle);
        angle += Math.PI / 18;
        this.shoot(Destructible);
        Destructible = !Destructible;
    }
    this.finishShooting();
}
//shoot a spiral pattern of destructible and non-destructible bullets
EnemyShooter.shootingPattern_spiral = function () {
    if (this.modAngle == undefined) {
        let angle = Phaser.Point.angle(new Phaser.Point(this.x, this.y), new Phaser.Point(this.target.x, this.target.y));
        this.modAngle = angle
    }
    if (this.Destructible == undefined)
        this.Destructible = false;
    else
        this.Destructible = !this.Destructible;
    this.modAngle += Math.PI / 18;
    this.setAngle(this.modAngle);
    this.shoot(this.Destructible);
    this.finishShooting();
}