// Enemy prefab constructor function
function Enemy(game, xPos, yPos, imageKey, startingHealth, target) {
    // call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(this, game, xPos, yPos, imageKey);

    // Sprite stuff
    this.anchor.set(0.5, 0.5);
    this.scale.x = 2;
    this.scale.y = 2;
    //Enemy stuff
    this.deathSfx = game.add.audio('sfx_enemy_death');
    this.maxHealth = 3;
    this.currHealth = startingHealth;
    this.speed = 100;
    this.target = target;
    // put some physics on it
    game.physics.enable(this);
    this.body.collideWorldBounds = true;
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Enemy)
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    game.physics.arcade.moveToObject(this, this.target, this.speed);
    game.physics.arcade.overlap(this, this.target, function (self, player) { player.damage(1); self.kill(); });
}
Enemy.prototype.damage = function (numDamage) {
    this.currHealth -= numDamage;
    if (this.currHealth <= 0) {
        this.deathSfx.play();
        this.kill();
    }
}
