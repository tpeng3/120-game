// I imagine this as some sort of on-the-way to work kind of cutscene

BasicGame.ActivityDecision = function (game) {
	//this.music = null;
	//this.playButton = null;
};

BasicGame.ActivityDecision.prototype = {
	preload: function() {
		console.log('ActivityDecision: preload');
		// load background assets of a generic daytime place and the textbox
		this.load.image('bg_agency', 'assets/img/bg/bg_agency.png');
		this.load.image('textbox', 'assets/img/ui/textbox.png');
		this.load.image('button_work', 'assets/img/ui/button_work.png');
		this.load.image('button_hangout', 'assets/img/ui/button_hangout.png');
	},

	create: function() {
		console.log('ActivityDecision: create');
        this.stage.backgroundColor = "#000";

        // add agency background. It feels weird loading it twice but this is just FOR NOW.
        this.add.sprite(0, 0, 'bg_agency');

        // add textbox and text, we don't have to keep this but for now give some explanations to the players
        var textbox = this.add.sprite(this.world.width/2, this.world.height - 10, 'textbox');
        textbox.anchor.setTo(0.5, 1);
        var textStyle = { fontSize: '32px', fill: '#facade', wordWrap: true, wordWrapWidth: textbox.width-10 };
        var text = this.add.text(textbox.left+60, textbox.top+40, 'Use Arrow Keys or WASD to navigate. Press SPACEBAR to select choice and advance text.', textStyle);

        // add choice buttons
		this.work = this.add.sprite(this.world.width/2 - 200, this.world.height/2 - 50, 'button_work');
		this.work.anchor.setTo(0.5);
		this.hangout = this.add.sprite(this.world.width/2 + 200, this.world.height/2 - 50, 'button_hangout');
		this.hangout.anchor.setTo(0.5);

		// default choice
		this.selectWork = true;
	},

	update: function () {
        // button dimming
        var dimColor = 0x555555;
        this.work.tint = (this.selectWork? 0xffffff : dimColor);
        this.hangout.tint = (this.selectWork? dimColor : 0xffffff);

		// choice selection
        if((this.input.keyboard.isDown(Phaser.Keyboard.A) || 
        	this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) &&
        	!this.selectWork){
        	this.selectWork = true;
    	}
    	if((this.input.keyboard.isDown(Phaser.Keyboard.D) || 
        	this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) &&
        	this.selectWork){
        	this.selectWork = false;
    	}

    	if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || 
        	this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
        	if(this.selectWork){
        		this.state.start('Work', true, false, calendar.getSceneKey());
        	}else{
        		this.state.start('Cutscene', true, false, 'testScene');
        	}
    	}    	

    	// Another way to progress states that we can honestly just keep for the heck of it.
		// press W to proceed to work
        if (this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.state.start('Work', true, false, calendar.getSceneKey());
        }
        // press H to hangout
        if (this.input.keyboard.isDown(Phaser.Keyboard.H)) {
            this.state.start('Cutscene', true, false, 'testScene');//calendar.getSceneKey());
        }
	}
	
};
