var TransitionFade = function transitionFade(game){
	var black = game.add.sprite(0, 0, 'bg_black');
    black.scale.setTo(game.width, game.height);
    black.alpha = 1;
    game.world.bringToTop(black);
    game.add.tween(black).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
}