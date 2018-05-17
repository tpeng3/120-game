BasicGame.ActivityDecision = function (game) {
	this.music = null;
	//this.playButton = null;
};

BasicGame.ActivityDecision.prototype = {
	preload: function() {
        console.log('ActivityDecision: preload');
        //Load cases
        if (BasicGame.global.case == undefined)//normal cases
            game.load.text('next_case', 'js/cases/Case_' + (BasicGame.global.case_number + 1) + '.json');
		// load background assets of a generic daytime place and the textbox
		this.load.image('bg_agency', 'assets/img/bg/bg_agency.png');
		this.load.image('textbox', 'assets/img/ui/textbox.png');
		this.load.image('button_work', 'assets/img/ui/button_work.png');
		this.load.image('button_hangout', 'assets/img/ui/button_hangout.png');
	},
	create: function() {
		console.log('ActivityDecision: create');

        // add agency background. It feels weird loading it twice but this is just FOR NOW.
        this.add.sprite(0, 0, 'bg_agency');

        // add textbox and text, we don't have to keep this but for now give some explanations to the players
        var textbox = this.add.sprite(this.world.width/2, this.world.height - 10, 'textbox');
        textbox.anchor.setTo(0.5, 1);
        textbox.alpha = 0.75
        var textStyle = { fontSize: '32px', fill: '#fff', wordWrap: true, wordWrapWidth: textbox.width-120 };
        var text = this.add.text(textbox.left + 60, textbox.top + 40, 'Use Arrow Keys or WASD to navigate. Press SPACEBAR to select choice and advance text.', textStyle);

        // place the dateTimeBox
        var dateBox = this.add.sprite(textbox.left, 20, 'textbox');
        dateBox.anchor.setTo(0, 0);
        dateBox.scale.x = 0.27;
        dateBox.scale.y = 0.25;
        dateBox.alpha = 0.75
        // initialize the dateTime text
        this.dateText = this.add.text(textbox.left + 60, 20, calendar.print(), { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });

        // place the dateTimeBox
        var caseInfo = this.add.sprite(textbox.left, 50, 'textbox');
        caseInfo.anchor.setTo(0, 0);
        caseInfo.scale.x = 0.5;
        caseInfo.scale.y = 0.25;
        caseInfo.alpha = 0.75
        // initialize the caseInfo text
        var info = '';
        if (BasicGame.global.case == undefined)
            info = 'No active case: work to find a client!';
        else if (BasicGame.global.case == 'final')
            info = '???';
        else
            info = 'Case: ' + BasicGame.global.case.case_name + ' (' + (BasicGame.global.case.boss.max_health - BasicGame.global.case.boss.curr_health) + '/' + BasicGame.global.case.boss.max_health + ' done)';      
        this. caseInfoText = this.add.text(textbox.left + 60, 50, info, { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });

        // add choice buttons
		this.work = this.add.sprite(this.world.width/2 - 200, this.world.height/2 - 50, 'button_work');
		this.work.anchor.setTo(0.5);
		this.hangout = this.add.sprite(this.world.width/2 + 200, this.world.height/2 - 50, 'button_hangout');
		this.hangout.anchor.setTo(0.5);

		// default choice
		this.selectWork = true;

		// fade transition (It has to be placed at the end for layering reasons)
		var fade = new TransitionFade(game);
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
            if (this.selectWork) {
                BasicGame.global.player_stats.fatigue++;
                if (BasicGame.global.case == undefined) {
                    BasicGame.global.case_number++;
                    BasicGame.global.case = JSON.parse(this.game.cache.getText('next_case'));
                    this.state.start('Cutscene', true, false, 'case/CaseStart_' + (BasicGame.global.case_number));
                }
                else if (BasicGame.global.case == "final")
                    console.log('final case reached, not yet handled in code');//handle final case choosing here
                else
        		    this.state.start('Work', true, false);
            } else {
                BasicGame.global.player_stats.fatigue = 0;
				this.camera.fade('#000', 1000);
				this.camera.onFadeComplete.add(function(){
					this.state.start('Cutscene', true, false, 'Debug_' + BasicGame.global.debug);
				}, this);
        	}
    	}    	

    	// Another way to progress states that we can honestly just keep for the heck of it.
		// press W to proceed to work
        if (this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.state.start('Work', true, false, calendar.getSceneKey());
        }
        // press H to hangout
        if (this.input.keyboard.isDown(Phaser.Keyboard.H)) {
            this.state.start('Cutscene', true, false, 'Script');//calendar.getSceneKey());
        }
	}
	
};