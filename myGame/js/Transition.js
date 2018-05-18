var TransitionFade = function transitionFade(game, fadetime){
	var black = game.add.sprite(0, 0, 'bg_black');
    black.scale.setTo(game.width, game.height);
    black.alpha = 1;
    game.world.bringToTop(black);
    game.add.tween(black).to( { alpha: 0 }, fadetime, Phaser.Easing.Linear.None, true);
}