BasicGame.GameOver = function (game) {};

BasicGame.GameOver.prototype = {
    preload: function(){
        this.load.image('gameover', 'assets/img/bg/bg_gameover.png');
    },
    create: function () {
        game.sound.stopAll(); 
        this.typeSfx = game.add.audio('sfx_text_scroll_default');

        this.stage.backgroundColor = "#000";

        var rip = this.add.sprite(this.world.centerX, 0, 'gameover');
        rip.anchor.setTo(0.5, 0);
        rip.scale.set(2.2);
        rip.alpha = 0;
        this.game.add.tween(rip).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);

        // haha I just copied this from the title screen
        var titleStyle = {font: 'bold Consolas', fontSize: '50px', fill: '#fff'};
        var titleText = this.add.text(this.world.centerX - 224, this.world.centerY + 100, '', titleStyle);
        var subtitle = 'G A M E  O V E R';
        var charNum = 0;
        this.game.time.events.add(2000, function(){
            this.game.time.events.loop(100, function(){
                if (charNum != subtitle.length) {
                    if (subtitle[charNum] != ' ') {
                        this.typeSfx.stop();
                        this.typeSfx.play();
                    }
                    titleText.text += subtitle[charNum];
                    charNum++;
                }
            }, this);
        }, this);
      
        var startStyle = {font: 'Trebuchet MS', fontSize: '32px', fill: '#51FFD4'};
        var startText = this.add.text(this.world.centerX, 550, '-Press SPACEBAR to return to the TitleScreen-', startStyle);
        startText.anchor.set(0.5);
        startText.visible = false;
        this.game.time.events.add(5000, function(){
            startText.visible = true;
        }, this);

        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.advanceState, this);
    },
    advanceState: function() {
        this.state.start('Titlescreen', true, false);
    }
};
