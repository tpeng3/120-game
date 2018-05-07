// Bullet prefab constructor function
function Bullet(game, x, y, damage, bulletSpeed, targetGroup, deleter) {
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, x, y, 'locke_bullet', 0);

    // Sprite stuff
    this.anchor.set(0.5, 0.5);
    //Bullet stuff
    this.damage = damage;

    this.targetGroup = targetGroup;
    // put some physics on it
    game.physics.enable(this);
    this.body.velocity.y = -1 * bulletSpeed;
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Bullet)
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
    game.physics.arcade.overlap(this, this.targetGroup, this.onCollide, null, this);
    if (this.x <= 75 || this.y <= 60)
        this.kill();
}
Bullet.prototype.onCollide = function (bullet, target) {
    target.damage(this.damage);
    this.kill();
}