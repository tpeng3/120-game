//Bullet.js: contains the prefab for the base bullet object and the prefabs for its variations.
//Current variations: DestructibleBullet(can be destroyed by a given group of objects)

// Bullet prefab constructor function
// Args: game (Phaser.game), imageKey (image key), x, y (spawnPosition), damage (int), bulletSpeed (float) +
// angleVec2d: the angle that the bullet will travel in, represented by a Phaser.Point as a normalized 2d vector
//     - the angle will be provided by the enemy that is shooting the bullet, and can be set on the enemy with .setAngle(angle, asDegrees) with degrees or radians
// targetGroup: the group of objects that this bullet will target (the Player, or the enemyGroup)
// memberGroup: the group of bullets that this bullet will be part of (either Player.bulletGroup or Enemy.bulletGroup) (used for destructible bullets, etc)
function Bullet(game, imageKey, x, y, damage, bulletSpeed, angleVec2d, targetGroup, memberGroup) {
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, x, y, imageKey, 0);
    //Add the sprite to the game here (before it sets its group)
    game.add.existing(this);
    // Sprite stuff
    this.anchor.set(0.5, 0.5);
    //Bullet stuff
    this.damage = damage;
    //Set the group, but not if null (after the player has died)
    this.memberGroup = memberGroup;
    if (this.memberGroup != null)
        this.memberGroup.add(this);
    //Set the target group
    this.targetGroup = targetGroup;
    // enable physics
    game.physics.enable(this);
    //angle stuff (scale normalized vector by bulletSpeed)
    this.body.velocity.x = angleVec2d.x * bulletSpeed;
    this.body.velocity.y = angleVec2d.y * bulletSpeed * -1;
    this.body.setSize(this.width - (this.width / 6), this.height - (this.height / 6), this.width / 12, (this.height/ 12)+3 );
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Bullet)
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;
//check for collision with tartget, and delete if collided or out of fram bounds
Bullet.prototype.update = function () {
    var collided = game.physics.arcade.overlap(this, this.targetGroup, this.onCollideWithTarget, null, this);
    //Delete bullets if they go out of world bounds
    if (collided || this.x <= 200 || this.x >= 1008 || this.y <= 16 || this.y >= 704)
        this.destroy();
}
//This happens when the bullet collides with its target
Bullet.prototype.onCollideWithTarget = function (bullet, target) {
    target.damage(this.damage);
}

//DestructibleBullet prefab (dies when it comes into contact with anything in the destructorGroup)
//Args: see Bullet constructor (at the top of this file) + 
//destructorGroup: the group of objects that will destroy this bullet on contact
function DestructibleBullet(game, sprite, x, y, damage, bulletSpeed, angleVec2d, targetGroup, memberGroup, destuctorGroup) {
    Bullet.call(this, game, sprite, x, y, damage, bulletSpeed, angleVec2d, targetGroup, memberGroup)
    this.destuctorGroup = destuctorGroup;
}
//Finish prefab stuff
DestructibleBullet.prototype = Object.create(Bullet.prototype);
DestructibleBullet.prototype.constructor = DestructibleBullet;

DestructibleBullet.prototype.update = function () {
    Bullet.prototype.update.call(this); // call the update functionality from the base class
    if(game.physics.arcade.overlap(this, this.destuctorGroup, function (self, other) { other.destroy(); }, null, this))
        this.destroy() 
}