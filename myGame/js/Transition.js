var TransitionFade = function transitionFade(game, fadetime, alpha){
	var black = game.add.sprite(0, 0, 'bg_black');
    black.scale.setTo(game.width, game.height);
    black.alpha = alpha || 1;
    var newAlpha = 1 - alpha;
    game.world.bringToTop(black);
    game.add.tween(black).to( { alpha: newAlpha }, fadetime, Phaser.Easing.Linear.None, true);
}

