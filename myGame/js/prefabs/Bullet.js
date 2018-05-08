// Bullet prefab constructor function
function Bullet(game, sprite, x, y, damage, bulletSpeed, angleVec2d, targetGroup, memberGroup) {
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, x, y, sprite, 0);
    game.add.existing(this);
    // Sprite stuff
    this.anchor.set(0.5, 0.5);
    //Bullet stuff
    this.damage = damage;
    this.memberGroup = memberGroup;
    if (this.memberGroup != null)
        this.memberGroup.add(this);
    this.targetGroup = targetGroup;
    // put some physics on it
    game.physics.enable(this);
    //angle stuff
    this.body.velocity.x = angleVec2d.x * bulletSpeed;
    this.body.velocity.y = angleVec2d.y * bulletSpeed * -1;
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Bullet)
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
    var collided = game.physics.arcade.overlap(this, this.targetGroup, this.onCollideWithTarget, null, this);
    //Delete bullets if they go out of world bounds
    if (collided || this.x <= 75 || this.x >= game.world.width - 300 || this.y <= 60 || this.y >= game.world.height - 60)
        this.destroy();
}
Bullet.prototype.onCollideWithTarget = function (bullet, target) {
    target.damage(this.damage);
}
//DestructibleBullet prefab (dies when it comes into contact with anything in the destructorGroup)
function DestructibleBullet(game, sprite, x, y, damage, bulletSpeed, angleVec2d, targetGroup, memberGroup, destuctorGroup) {
    Bullet.call(this, game, sprite, x, y, damage, bulletSpeed, angleVec2d, targetGroup, memberGroup)
    this.destuctorGroup = destuctorGroup;
}

DestructibleBullet.prototype = Object.create(Bullet.prototype);
DestructibleBullet.prototype.constructor = DestructibleBullet;

DestructibleBullet.prototype.update = function () {
    Bullet.prototype.update.call(this);
    if(game.physics.arcade.overlap(this, this.destuctorGroup, function (self, other) { other.destroy(); }, null, this))
        this.destroy() 
}