BasicGame.Credits = function (game) {};

BasicGame.Credits.prototype = {
    preload: function(){
        this.load.image('ending_tai', 'assets/img/bg/ending_tai.png');
        this.load.image('ending_keyna', 'assets/img/bg/ending_keyna.png');
        this.load.image('ending_lynn', 'assets/img/bg/ending_lynn.png');

        this.load.image('credits', 'assets/img/bg/bg_credits.png');
    },
    create: function () {
        game.sound.stopAll(); 
        this.stage.backgroundColor = "#fff";

        bgm = this.add.audio('bgm_popup', 1, true);
        bgm.play();

        BasicGame.save.date = calendar.date;
        BasicGame.save.end_any = true;

        var cg;
        if(BasicGame.global.final_chara_route == "Tai"){
            cg = 'ending_tai';
            BasicGame.save.end_Tai = 'complete';
        }else if(BasicGame.global.final_chara_route == "Keyna"){
            cg = 'ending_keyna';
            BasicGame.save.end_Keyna = 'complete';
        }else if(BasicGame.global.final_chara_route == "Fedelynn"){
            cg = 'ending_lynn';
            BasicGame.save.end_Fedelynn = 'complete';
        }

        var bg = game.add.sprite(0, 0, cg);

        var credits = game.add.sprite(this.world.centerX, this.world.centerY, 'credits');
        credits.anchor.set(0.5);
        credits.alpha = 0;

        this.game.time.events.add(5000, function(){
            this.game.add.tween(bg).to( { alpha: .5 }, 1000, Phaser.Easing.Linear.None, true);
            this.game.add.tween(credits).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        }, this);

        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.advanceState, this);

        // fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game, 1000);
    },
    advanceState: function() {
        game.sound.stopAll(); 
        this.state.start('TitleScreen', true, false);
    }
};
