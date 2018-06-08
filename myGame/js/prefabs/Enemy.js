// Enemy prefab constructor function
// This enemy base class will can be damaged, killed, will damage the player on contact, and has a variable movement pattern
// Args: game (Phaser.game), xPos, yPos (spawnPosition), imageKey (image must already be loaded), startingHealth (int), +
// target: the target of this enemy, for tracking shots and movement patterns (usually the player, but doesn't have to be)
// movementPattern: an AI movement pattern that is run every frame (in update) (function object). use Enemy.movementPattern_functionName (static functions defined in this file) (can be null/undefined)
//     -example: Enemy.movementPatter_followTarget (track the player/target and follows them)
function Enemy(game, xPos, yPos, imageKey, startingHealth, maxHealth, target, movementPattern) {
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, xPos, yPos, imageKey);
    // Sprite stuff
    this.anchor.set(0.5, 0.5);
    //Scaling is temp
    this.scale.x = 2;
    this.scale.y = 2;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
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
    this.initialHealth = maxHealth;
    this.speed = 100;
    this.target = target;
    //Enable physics
    game.physics.enable(this);
    this.body.collideWorldBounds = true;

    // set up a health bar
    this.bh_boss_hcontainer = game.add.sprite(220, 660, 'bh_boss_hcontainer');
    this.bh_boss_health = game.add.sprite(this.bh_boss_hcontainer.x+4, this.bh_boss_hcontainer.y, 'bh_boss_health');
    // this.bh_boss_health.cropEnabled = true;
    this.bh_boss_health.width = (this.currHealth/this.initialHealth) * (this.bh_boss_hcontainer.width-8);
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Enemy)
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.bulletGroup = null; //Initialize the enemy bullet group (static)
Enemy.PI18 = Math.PI / 18;
Enemy.PI36 = Math.PI / 36;

//Call the movement pattern, and damage the player if the player is hit (can change any value of enemy)
Enemy.prototype.update = function () {
    this.movementPattern.call(this);
    game.physics.arcade.overlap(this, this.target, function (self, player) { player.damage(1); self.damage(1)});
}
//take damage and die if necessary
Enemy.prototype.damage = function (numDamage) {
    this.currHealth -= numDamage;
    this.bh_boss_health.width = (this.currHealth/this.initialHealth) * (this.bh_boss_hcontainer.width-4);
    if (this.currHealth <= 0) {
        this.deathSfx.play('',0,0.75);
        this.destroy();
    }
}

//MOVEMENT PATTERNS (static functions)

//DO nothing
Enemy.movementPattern_doNothing = function () {
}
//Move hozontally
Enemy.movementPattern_moveDirection = function () {
    if (this.direction == undefined || this.direction == null)
        return;
    this.body.velocity = new Phaser.Point(this.direction.x * this.speed, this.direction.y * this.speed)
}
//move around a point
Enemy.movementPattern_moveAroundPoint = function () {
    this.position.rotate(this.rotationPoint.x, this.rotationPoint.y, this.rotSpeed);
}
//Follow the target around
Enemy.movementPattern_followTarget = function () {
    game.physics.arcade.moveToObject(this, this.target, this.speed);
}

//EnemyShooter prefab (shootingPattern is a function that determines the shooting patterns)
//Has all the features that enemy does, but shoots bullets in variable pattern, at a variable speed
//Args: see Enemy Constructor (above in this file) +
//shootingPattern: an AI movement shooting that is run in update but only actually executes after waiting for firingDelay (function object) use EnemyShooter.shootingPattern_functionName (static functions defined in this file)
//bulletSpeed: speed of fired bullets (int) <optional, default = 400>
//firingDelay: delay between actual executions of this.shootingPattern (milliseconds) <optional, default = 1000 + (100 * Math.random())>
function EnemyShooter(game, xPos, yPos, imageKey, startingHealth, maxHealth, target, movementPattern, shootingPattern, bulletSpeed, firingDelay) {
    Enemy.call(this, game, xPos, yPos, imageKey, startingHealth, maxHealth, target, movementPattern) //call base class constructor
    // this.tint = 0x9999ff;
    //set shooting pattern and sfx
    this.shootingPattern = shootingPattern;
    this.shotSfx = game.add.audio('sfx_player_laser');
    this.bulletAngle = new Phaser.Point(0, -1);
    this.bulletDamage = 1;
    this.shootCenter = false;
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
    this.afterShot = function () { };
}
//Finish prefab stuff
EnemyShooter.prototype = Object.create(Enemy.prototype);
EnemyShooter.prototype.constructor = EnemyShooter;

//Call shooting pattern if ready to shoot
EnemyShooter.prototype.update = function () {
    Enemy.prototype.update.call(this); //call the base update
    if (this.isReadyToShoot) {
        this.shootingPattern.call(this);
        this.afterShot.call(this);
    }
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
    let bullet;
    let yPos = this.y
    if (!this.shootCenter)
        yPos += this.halfHeight;
    if (isDestructible) {
        bullet = new DestructibleBullet(game, 'enemy_bullet_l', this.x, yPos, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.target, Enemy.bulletGroup, Player.bulletGroup);
        bullet.tint = 0x666666;
    } else {
        bullet = new Bullet(game, 'enemy_bullet', this.x, yPos, this.bulletDamage, this.bulletSpeed, this.bulletAngle, this.target, Enemy.bulletGroup);
    }
    //this.shotSfx.play();
}
//Finish shooting and start the delay (CALL AT THE END OF ALL SHOOTING PATTERN FUNCTIONS)
EnemyShooter.prototype.finishShooting = function() {
    this.isReadyToShoot = false;
    game.time.events.add(this.firingDelay, function () { this.isReadyToShoot = true; }, this);
}

//SHOOTING PATTERNS (static functions)

//Shoot a bullet at the target
EnemyShooter.shootingPattern_shootAngle = function () {
    if (this.Destructible == undefined)
        this.Destructible = false;
    else
        this.Destructible = !this.Destructible;
    this.shoot(this.Destructible);
    this.finishShooting();
}

//Shoot a bullet at the target
EnemyShooter.shootingPattern_shootAtTarget = function () {
    let angle = Phaser.Point.angle(new Phaser.Point(this.x, this.y), this.target.position);
    this.setAngle(angle);
    if (this.Destructible == undefined)
        this.Destructible = false;
    else
        this.Destructible = !this.Destructible;
    this.shoot(this.Destructible);
    this.finishShooting();
}

//Shoot a bullet at the target
EnemyShooter.shootingPattern_shootAroundTarget = function () {
    let angle = Phaser.Point.angle(new Phaser.Point(this.x, this.y), this.target.position);
    angle += Enemy.PI18 * Phaser.Math.random(-1, 1);
    this.setAngle(angle);
    if (this.Destructible == undefined)
        this.Destructible = false;
    else
        this.Destructible = !this.Destructible;
    this.shoot(this.Destructible);
    this.finishShooting();
}

//shoot a round flower pattern or destructible and non-destructible bullets
EnemyShooter.shootingPattern_flower = function (notReset, angleOffset) {
    let angle = Phaser.Point.angle(new Phaser.Point(this.x, this.y), this.target.position);
    if (angleOffset != undefined)
        angle += angleOffset;
    var Destructible = false;
    for (let i = 0; i < 36; ++i) {
        this.setAngle(angle);
        angle += Enemy.PI18;
        this.shoot(Destructible);
        Destructible = !Destructible;
    }
    if (notReset == undefined || notReset == false)
        this.finishShooting();
}

//shoot a round flower pattern or destructible and non-destructible bullets
EnemyShooter.shootingPattern_burst = function () {
    if (this.modAngle == undefined || this.modAngle != 0)
        this.modAngle = 0;
    else
        this.modAngle = Enemy.PI18;
    EnemyShooter.shootingPattern_flower.call(this, true, this.modAngle);
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
    this.modAngle += Enemy.PI18;
    this.setAngle(this.modAngle);
    this.shoot(this.Destructible);
    this.finishShooting();
}

function EnemyAI(game, xPos, yPos, imageKey, startingHealth, maxHealth, target, bulletSpeed, firingDelay, AI) {
    EnemyShooter.call(this, game, xPos, yPos, imageKey, startingHealth, maxHealth, target, AI.initMP, AI.initSP, bulletSpeed, firingDelay); //call base class constructor
    this.AI = AI;
    if (this.AI.init != undefined)
        this.AI.init.call(this);
    this.state = 'init';
    this.pause = true;
}
//Finish prefab stuff
EnemyAI.prototype = Object.create(EnemyShooter.prototype);
EnemyAI.prototype.constructor = EnemyAI;
//AI UPDATE LOOP
EnemyAI.prototype.update = function () {
    if (this.pause)
        return;
    this.AI.update.call(this);
    EnemyShooter.prototype.update.call(this);//call the base update
}

//AI patterns here
EnemyAI.AI_boss_cat = {
    initMP: Enemy.movementPattern_doNothing,
    initSP: EnemyShooter.shootingPattern_shootAtTarget,
    update: function () {
        if (this.state == 'init') {
            this.firingDelay = 1500;
            this.speed = 75;
            this.direction = new Phaser.Point(1, 0);
            this.state = 'wait';
            game.time.events.add(4000, function () { this.state = 'move'; }, this);
        } else if (this.state == 'move') {
            this.direction.x *= -1;
            this.movementPattern = Enemy.movementPattern_moveDirection;
            let timeToWait = (1900 * Math.random()) + 600;
            if ((this.x > game.world.width * 0.66 && this.direction.x < 0) || (this.x < game.world.width * 0.33 && this.direction > 0))
                timeToWait += 750;
            game.time.events.add(timeToWait, function () { this.state = 'move'; }, this);
            this.state = 'wait';
        }
    }
}

//AI patterns here
EnemyAI.AI_boss_bird = {
    initMP: Enemy.movementPattern_doNothing,
    initSP: EnemyShooter.shootingPattern_shootAroundTarget,
    phase: 1,
    update: function () {
        if (this.currHealth < 100)
            this.AI.phase = 3;
        else if (this.currHealth < 200)
            this.AI.phase = 2;
        if (this.AI.phase == 1) {
            if (this.state == 'init') {
                console.log("crow init");
                this.movementPattern = Enemy.movementPattern_moveAroundPoint;
                this.firingDelay = 300;
                let rotX = this.x - 50;
                let rotY = this.y + 75;
                this.rotationPoint = new Phaser.Point(rotX, rotY);
                this.rotSpeed = Enemy.PI18 / 5;
                this.speed = 75;
                this.state = 'wait';
                game.time.events.add(5000, function () { this.state = 'burst'; }, this);
            } else if (this.state == 'burst') {
                this.afterShot = function () {
                    this.movementPattern = Enemy.movementPattern_doNothing;
                    this.firingDelay = 500;
                    this.shootingPattern = EnemyShooter.shootingPattern_burst;
                    this.shootCenter = true;
                    this.afterShot = function () {
                        if (this.afterShot.count == undefined)
                            this.afterShot.count = 0;
                        this.afterShot.count++;
                        if (this.afterShot.count >= 2) {
                            game.time.events.add(500, function () {
                                this.movementPattern = Enemy.movementPattern_moveAroundPoint;
                                this.shootingPattern = EnemyShooter.shootingPattern_shootAroundTarget;
                                this.firingDelay = 300;
                                this.shootCenter = false;
                                game.time.events.add(4000, function () { this.state = 'burst'; }, this);
                            }, this);
                            this.afterShot = function () { }
                        }
                    }
                }
                this.state = 'wait';
            } else if (this.state == 'wait') {
                if (this.x > this.rotationPoint.x + 10)
                    this.scale.x = 2;
                else if (this.x < this.rotationPoint.x - 10)
                    this.scale.x = -2;
            }
        }
        else if (this.AI.phase == 2) {
            if (this.AI.phase2Start == undefined) {
                this.state = 'init';
                this.AI.phase2Start = true;
            }
            if (this.state == 'init') {
                this.movementPattern = Enemy.movementPattern_doNothing;
                this.shootingPattern = function () { };
                var targetPoint = new Phaser.Point(game.world.width / 2, 150);
                game.physics.arcade.moveToObject(this, targetPoint, this.speed);
                let buffer = 20;
                if (this.position.x <= targetPoint.x + buffer && this.position.x >= targetPoint.x - buffer && this.position.y <= targetPoint.y + buffer && this.position.y >= targetPoint.y - buffer) {
                    console.log("reached target point");
                    this.body.velocity = new Phaser.Point(0, 0);
                    this.state = 'wait';
                    this.movementPattern = Enemy.movementPattern_moveAroundPoint;
                    let rotX = this.x - 25;
                    let rotY = this.y + 25;
                    this.rotationPoint = new Phaser.Point(rotX, rotY);
                    this.rotSpeed = Enemy.PI18;
                    game.time.events.add(3000, function () { this.state = 'strafe'; }, this);
                }
            } else if (this.state == 'strafe') {
                if (this.AI.strafeDir == undefined) {
                    this.AI.strafeDir = true;
                } else {
                    this.AI.strafeDir = !this.AI.strafeDir;
                }
                if (this.AI.strafeDir) {
                    this.direction = new Phaser.Point(1, 0);
                    this.scale.x = 2;
                } else {
                    this.direction = new Phaser.Point(-1, 0);
                    this.scale.x = -2;
                }
                this.movementPattern = Enemy.movementPattern_moveDirection;
                this.bulletAngle = new Phaser.Point(0, -1);
                this.shootingPattern = EnemyShooter.shootingPattern_shootAngle;
                this.firingDelay = 100;
                this.speed = 300;
                this.state = 'strafePoll';
            } else if (this.state == 'strafePoll') {
                if (this.AI.strafeDir && this.x >= 900) {
                    this.state = 'burst';
                } else if (!this.AI.strafeDir && this.x <= 300) {
                    this.state = 'burst'
                }
            } else if (this.state == 'burst') {
                this.afterShot = function () {
                    this.movementPattern = Enemy.movementPattern_doNothing;
                    this.firingDelay = 750;
                    this.shootingPattern = EnemyShooter.shootingPattern_burst;
                    this.shootCenter = true;
                    this.afterShot = function () {
                        if (this.afterShot.count == undefined)
                            this.afterShot.count = 0;
                        this.afterShot.count++;
                        if (this.afterShot.count >= 5) {
                            this.movementPattern = Enemy.movementPattern_moveAroundPoint;
                            let rotX = 0;
                            if (this.AI.strafeDir)
                                rotX = this.x - 25;
                            else
                                rotX = this.x + 25;
                            let rotY = this.y + 25;
                            this.rotationPoint = new Phaser.Point(rotX, rotY);
                            this.rotSpeed = Enemy.PI18;
                            this.shootingPattern = function () { };
                            game.time.events.add(3000, function () {
                                this.shootCenter = false;
                                this.state = 'strafe';
                            }, this);
                            this.afterShot = function () { }
                        }
                    }
                }
                this.state = 'wait';
            }
        }
        else if (this.AI.phase == 3) {
            if (this.AI.phase3Start == undefined) {
                this.state = 'init';
                this.AI.phase3Start = true;
            }
            if (this.state == 'init') {
                this.movementPattern = Enemy.movementPattern_doNothing;
                this.shootingPattern = function () { };
                var targetPoint = new Phaser.Point(game.world.width / 2, 150);
                game.physics.arcade.moveToObject(this, targetPoint, this.speed);
                let buffer = 15;
                if (this.position.x <= targetPoint.x + buffer && this.position.x >= targetPoint.x - buffer && this.position.y <= targetPoint.y + buffer && this.position.y >= targetPoint.y - buffer) {
                    console.log("reached target point");
                    this.body.velocity = new Phaser.Point(0, 0);
                    this.state = 'wait';
                    this.movementPattern = Enemy.movementPattern_moveAroundPoint;
                    let rotX = this.x - 25;
                    let rotY = this.y + 25;
                    this.rotationPoint = new Phaser.Point(rotX, rotY);
                    this.rotSpeed = Enemy.PI18;
                    game.time.events.add(1000, function () { this.state = 'burst'; }, this);
                }
            } else if (this.state == 'burst') {
                this.afterShot = function () {
                    this.firingDelay = 367;
                    this.shootingPattern = EnemyShooter.shootingPattern_burst;
                    this.shootCenter = true;
                    this.afterShot = function () {
                        if (this.afterShot.count == undefined)
                            this.afterShot.count = 0;
                        this.afterShot.count++;
                        if (this.afterShot.count >= 7) {
                            this.movementPattern = Enemy.movementPattern_doNothing;
                            this.shootingPattern = function () { };
                            game.time.events.add(3000, function () {
                                this.movementPattern = Enemy.movementPattern_moveAroundPoint;
                                this.shootCenter = false;
                                this.state = 'burst';
                            }, this);
                            this.afterShot = function () { }
                        }
                    }
                }
                this.state = 'wait';
            }
        }
    }
}
