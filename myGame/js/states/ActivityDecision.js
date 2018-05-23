BasicGame.ActivityDecision = function (game) {
	this.music = null;
	//this.playButton = null;
};

BasicGame.ActivityDecision.prototype = {
	preload: function() {
        console.log('ActivityDecision: preload');

        // load cases
        if (BasicGame.global.case == undefined) //normal cases
            game.load.text('next_case', 'js/cases/Case_' + (BasicGame.global.case_number + 1) + '.json');
		
        // load background assets of a generic daytime place and the textbox
		this.load.image('bg_agency', 'assets/img/bg/bg_agency.png');
		this.load.image('textbox', 'assets/img/ui/textbox.png');
		this.load.image('button_work', 'assets/img/ui/button_work.png');
        this.load.image('button_hangout', 'assets/img/ui/button_hangout.png');
        this.load.image('button_hangout_no_option', 'assets/img/ui/button_hangout_no_option.png');
	},
    create: function () {
		console.log('ActivityDecision: create');

        // add agency background. It feels weird loading it twice but this is just FOR NOW.
        this.add.sprite(0, 0, 'bg_agency');

        var textbox = new Textbox(game, false, null, [{ name: "", text: 'Use Arrow Keys or WASD to navigate. Press SPACEBAR to select choice and advance text.' }]);
        // add textbox and text, we don't have to keep this but for now give some explanations to the players
        //var textbox = this.add.sprite(this.world.width/2, this.world.height - 10, 'textbox');
        //textbox.anchor.setTo(0.5, 1);
        //textbox.alpha = 0.75;
        //var textStyle = { font: 'Trebuchet MS', fontSize: '24px', fill: '#fff', wordWrap: true, wordWrapWidth: textbox.width-200 };
        //var text = this.add.text(textbox.left + 60, textbox.top + 40, 'Use Arrow Keys or WASD to navigate. Press SPACEBAR to select choice and advance text.', textStyle);

        // place the dateTimeBox
        var dateBox = this.add.sprite(textbox.left, 20, 'textbox');
        dateBox.anchor.setTo(0, 0);
        dateBox.scale.setTo(0.27, 0.25);
        dateBox.alpha = 0.75;
        // initialize the dateTime text
        this.dateText = this.add.text(textbox.left + 60, 20, calendar.print(), { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });

        // place the case info box
        var caseInfo = this.add.sprite(textbox.left, 60, 'textbox');
        caseInfo.anchor.setTo(0, 0);
        caseInfo.scale.setTo(0.5, 0.25);
        caseInfo.alpha = 0.75
        // initialize the caseInfo text
        var info = '';
        if (BasicGame.global.case == undefined)
            info = 'No active case: work to find a client!';
        else if (BasicGame.global.case == 'final')
            info = '???';
        else
            info = 'Case: ' + BasicGame.global.case.case_name + ' (' + (((BasicGame.global.case.boss.max_health - BasicGame.global.case.boss.curr_health) / BasicGame.global.case.boss.max_health) * 100) + '% done)';      
        this.caseInfoText = this.add.text(textbox.left + 60, 60, info, { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });

        //get scene data
        this.sceneData = calendar.getSceneData();
        this.exit = false;

        // add choice buttons
		this.work = this.add.sprite(this.world.width/2 - 200, this.world.height/2 - 50, 'button_work');
        this.work.anchor.setTo(0.5);
        if (this.sceneData == 'no_option')
            this.hangout = this.add.sprite(this.world.width / 2 + 200, this.world.height / 2 - 50, 'button_hangout_no_option');
        else
            this.hangout = this.add.sprite(this.world.width / 2 + 200, this.world.height / 2 - 50, 'button_hangout');
        this.hangout.anchor.setTo(0.5);

		// default choice
		this.selectWork = true;

		// fade transition (It has to be placed at the end for layering reasons)
        var fade = new TransitionFade(game, 1000);
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
        //Choice has been made
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
            }else{
                if (this.sceneData == 'no_option' || this.exit)
                    return;
                BasicGame.global.player_stats.fatigue = 0;
                this.camera.fade('#000', 1000);
                if (this.sceneData == "nobody_there") {
                    this.exit = true;
                    this.camera.onFadeComplete.addOnce(function () {
                        this.state.start('Cutscene', true, false, 'NobodyThere');
                    }, this);
                } else if (this.sceneData.length == 1) {
                    this.exit = true;
                    this.camera.onFadeComplete.addOnce(function () {
                        console.log('incrementing ' + this.sceneData[0] + '_ind: ' + (calendar.scenes[this.sceneData[0] + '_ind'] + 1));
                        calendar.scenes[this.sceneData[0] + '_ind']++;
                        this.state.start('Cutscene', true, false, this.sceneData[0] + '_' + calendar.scenes[this.sceneData[0] + '_ind']);
                    }, this);
                } else {
                    this.exit = true;
                    this.camera.onFadeComplete.addOnce(function () {
                        this.state.start('CharacterDecision', true, false, this.sceneData);
                    }, this);
                }
        	}
    	}    	
	}
	
};