BasicGame.Work = function (game) {
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    // this.game;      //  a reference to the currently running game (Phaser.Game)
    // this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    // this.camera;    //  a reference to the game camera (Phaser.Camera)
    // this.cache;     //  the game cache (Phaser.Cache)
    // this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    // this.load;      //  for preloading assets (Phaser.Loader)
    // this.math;      //  lots of useful common math operations (Phaser.Math)
    // this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    // this.stage;     //  the game stage (Phaser.Stage)
    // this.time;      //  the clock (Phaser.Time)
    // this.tweens;    //  the tween manager (Phaser.TweenManager)
    // this.state;     //  the state manager (Phaser.StateManager)
    // this.world;     //  the game world (Phaser.World)
    // this.particles; //  the particle manager (Phaser.Particles)
    // this.physics;   //  the physics manager (Phaser.Physics)
    // this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    // I kept the text because I dunno, might be useful
};

BasicGame.Work.prototype = {
    preload: function() {
        console.log('Work: preload');
        this.time.advancedTiming = true;

        // preload assets
        // get ready to bullet hell
    },

    create: function () {
        console.log('Work: create');
        this.stage.backgroundColor = "#facade";
        this.add.text(this.world.width / 2 - 110, 450, 'WORK!: Press ENTER to go to bed', { fontSize: '32px', fill: '#00ee00' });
        // there's... a Lot to create, but basically the status screen and enemies
    },

    update: function () {
        // debug information
        this.game.debug.text(this.time.fps || '--', 2, 14, "#00ff00");   

        // bullet hell mechanics are actually pretty similar to endless runner in that we'll be
        // generating enemies flying towards us with the illusion that we're moving upwards

        // I'm thinking we can either have different enemies to fight each day...
        // OR just one type of "boss" enemy per case, so we have less to code and a time limit to damage
        // the boss as much as possible
        // so when time limit runs out, you die, or boss health is gone, we go on to the next day

        // so if time limit runs out (30-60seconds? how long does a stage usually last idr i need to play touhou again)
        // this.workEnd();

        // if you die in bullet hell, you die in real life
        // i imagine the mc either has a "motivation" health bar, or like, three hits they're out sorta thing
        // this.workEnd();

        // if the "boss" enemy runs out of health aka case is solved
        if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){ // temporary code just to progress through the states for now
            this.client == false;
            this.workEnd();
        }
    },

    workEnd: function () {
        this.state.start('bedtime');
        // press ENTER to proceed to the next state
        // decide here whether that state should be EveningTalk, EveningSolve, or Bedtime
        //if(this.client == false)
        //    // go on to a small solving the case cutscene
        //    this.state.start('EveningSolve');
        //else if(Math.random() < .5)
        //    // more random opportunities to talk to characters
        //    this.state.start('EveningTalk');
        //else
        //    // or just go to sleep
        //    this.state.start('Bedtime');
    }
};