// Enemy prefab constructor function
function Enemy(game, xPos, yPos, imageKey, startingHealth, target, movementPattern) {
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, xPos, yPos, imageKey);

    // Sprite stuff
    this.anchor.set(0.5, 0.5);
    this.scale.x = 2;
    this.scale.y = 2;
    //Define static bullet group if not defined (in here to access game properly)
    if (Enemy.bulletGroup == null)
        Enemy.bulletGroup = game.add.group();
    //Store movement pattern
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
Enemy.bulletGroup = null;

Enemy.prototype.update = function () {
    this.movementPattern.call(this);
    game.physics.arcade.overlap(this, this.target, function (self, player) { player.damage(1); self.kill(); });
}
Enemy.prototype.damage = function (numDamage) {
    this.currHealth -= numDamage;
    if (this.currHealth <= 0) {
        this.deathSfx.play();
        this.destroy();
    }
}

//MOVEMENT PATTERNS (static functions)
Enemy.movementPattern_followTarget = function () {
    game.physics.arcade.moveToObject(this, this.target, this.speed);
}

//EnemyShooter prefave (shootingPattern is a function that determines the shooting patters)
function EnemyShooter(game, xPos, yPos, imageKey, startingHealth, target, movementPattern, shootingPattern, bulletSpeed, firingDelay) {
    Enemy.call(this, game, xPos, yPos, imageKey, startingHealth, target, movementPattern)
    this.tint = 0x9999ff
    this.shootingPattern = shootingPattern;
    this.shotSfx = game.add.audio('sfx_player_laser');
    this.bulletAngle = new Phaser.Point(0, -1)
    this.bulletDamage = 1;
    if (bulletSpeed != undefined)
        this.bulletSpeed = bulletSpeed;
    else
        this.bulletSpeed = 400;
    if (firingDelay != undefined)
        this.firingDelay = firingDelay;
    else
        this.firingDelay = 1000 + (100 * Math.random());//fire every this amount of milliseconds
    this.isReadyToShoot = true;
}

EnemyShooter.prototype = Object.create(Enemy.prototype);
Enemy.prototype.constructor = EnemyShooter;

EnemyShooter.prototype.update = function () {
    if (this.isReadyToShoot)
        this.shootingPattern.call(this);
}

EnemyShooter.prototype.setAngle = function (angle, fromDegrees) {
    let tempAngle = angle
    if (fromDegrees == true)
        tempAngle = angle * (Math.PI / 180);
    this.bulletAngle.x = -1 * Math.cos(tempAngle);
    this.bulletAngle.y = Math.sin(tempAngle);
}

EnemyShooter.prototype.shoot = function (isDestructible) {
    var bullet;
    if (isDestructible) {
        bullet = new DestructibleBullet(game, 'locke_bullet', this.x, this.y, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.target, Enemy.bulletGroup, Player.bulletGroup);
        bullet.tint = 0x000000;
    } else {
        bullet = new Bullet(game, 'locke_bullet', this.x, this.y, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.target, Enemy.bulletGroup);
    }
    this.shotSfx.play();
}

EnemyShooter.prototype.finishShooting = function() {
    this.isReadyToShoot = false;
    game.time.events.add(this.firingDelay, function () { this.isReadyToShoot = true; }, this);
}

//SHOOTING PATTERNS (static functions)
EnemyShooter.shootingPattern_shootAtTarget = function () {
    let angle = Phaser.Point.angle(new Phaser.Point(this.x,this.y), new Phaser.Point(this.target.x, this.target.y));
    this.setAngle(angle);
    this.shoot();
    this.finishShooting();
}

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