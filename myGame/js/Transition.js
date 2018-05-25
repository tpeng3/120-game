var TransitionFade = function transitionFade(game, fadetime){
	var black = game.add.sprite(0, 0, 'bg_black');
    black.scale.setTo(game.width, game.height);
    black.alpha = 1;
    game.world.bringToTop(black);
    game.add.tween(black).to( { alpha: 0 }, fadetime, Phaser.Easing.Linear.None, true);
}

var TransitionWork = function transitionWork(game){
	var cutin = game.add.sprite(0, game.height/2, 'ui_wonderzone');
	cutin.alpha = 0;
    game.world.bringToTop(cutin);
    game.add.tween(cutin).to( { alpha: 1, y: 100 }, 1000, Phaser.Easing.Linear.None, true);
}