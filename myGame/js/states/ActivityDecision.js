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
		this.load.image('button_work', 'assets/img/ui/button_work.png');
        this.load.image('button_work_no_option', 'assets/img/ui/button_work_no_option.png');
        this.load.image('button_hangout', 'assets/img/ui/button_hangout.png');
        this.load.image('button_hangout_no_option', 'assets/img/ui/button_hangout_no_option.png');
        this.load.image('ui_wonderzone', 'assets/img/ui/ui_wonderzone.png');
        this.load.image('ui_wonderzone2', 'assets/img/ui/ui_wonderzone2.png');
	},
    create: function () {
		console.log('ActivityDecision: create');

        // add agency background. It feels weird loading it twice but this is just FOR NOW.
        this.add.sprite(0, 0, 'bg_agency');
        this.menuSelectSfx = this.add.audio('sfx_menu_select');
        this.menuEnterBadSfx = this.add.audio('sfx_menu_enter_bad');
        this.menuEnterGoodSfx = this.add.audio('sfx_menu_open');

        var fatigue = BasicGame.global.player_stats.fatigue;
        var text = '';
        var name = 'Locke';

        // first time instruction text
        if(BasicGame.global.case_number == -1){
            name = '';
            text = 'Use WASD or Arrow Keys to select a choice. Press SPACEBAR to confirm. For right now, only \'WORK\' is an available option.'
        }
        // text depending on locke's fatigue
        // we should talk about how to balance this
        else if(fatigue == -1){
            text = 'Alright! I\'m feeling extra motivated to work today!';
        }else if(fatigue == 0 || fatigue == 1){
            text = 'Time for another day of life as an awesome detective.';
        }else if(fatigue == 2){
            text = 'I feel a bit tired today. It\'s going to be hard to concentrate if I try to work.';
        }else if(fatigue == 3){
            text = 'I really don\'t feel too well today. Maybe I should take it easy, my head kinda hurts.';
        }

        var textbox = new Textbox(game, false, null, [{ name: name, text: text  }]);

        console.log("Fatigue: " + BasicGame.global.player_stats.fatigue);

        // place the dateTimeBox
        var dateBox = this.add.sprite(textbox.left, 20, 'bg_black');
        dateBox.alpha = 0.75;
        // initialize the dateTime text
        this.dateText = this.add.text(textbox.left + 60, 20, calendar.print(), { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
        dateBox.scale.setTo(this.dateText.width+90, this.dateText.height);
        // place the case info box
        var caseInfo = this.add.sprite(textbox.left, 65, 'bg_black');
        caseInfo.alpha = 0.75
        // initialize the caseInfo text
        var info = '';
        if (BasicGame.global.case == undefined)
            info = 'No active case: work to find a client!';
        else if (BasicGame.global.case == 'final')
            info = '???';
        else{
            let percentWork = Math.round(
                ((BasicGame.global.case.boss.max_health - BasicGame.global.case.boss.curr_health)
                / BasicGame.global.case.boss.max_health) * 100);
            info = 'Case: ' + BasicGame.global.case.case_name + ' (' + percentWork + '% done)';      
        }
        this.caseInfoText = this.add.text(textbox.left + 60, 65, info, { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
        caseInfo.scale.setTo(this.caseInfoText.width+90, this.caseInfoText.height);

        //get scene data
        this.sceneData = calendar.getSceneData();
        this.exit = false;

        // add choice buttons
        if (calendar.print() == "3/2 Saturday") {
            this.work = this.add.sprite(this.world.width / 2 - 200, this.world.height / 2 - 50, 'button_work_no_option');
            this.noWorkOption = true;
        } else {
		    this.work = this.add.sprite(this.world.width/2 - 200, this.world.height/2 - 50, 'button_work');
            this.noWorkOption = false;
        }
        this.work.anchor.setTo(0.5);
        this.work.scale.setTo(0.85, 0.85);
        // just to have the positioning match character decision
        var buttonX = (this.world.width / 3 * 2);
        if (this.sceneData == 'no_option')
            this.hangout = this.add.sprite(buttonX, this.world.height / 2 - 50, 'button_hangout_no_option');
        else
            this.hangout = this.add.sprite(buttonX, this.world.height / 2 - 50, 'button_hangout');
        this.hangout.anchor.setTo(0.5);
        this.hangout.scale.setTo(0.85, 0.85);
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
        // button scaling
        var scaleOn = (this.selectWork? 0.95 : 0.85);
        var scaleOff = (this.selectWork? 0.85 : 0.95);
        this.work.scale.setTo(scaleOn, scaleOn);
        this.hangout.scale.setTo(scaleOff, scaleOff);

		// choice selection
        if((this.input.keyboard.isDown(Phaser.Keyboard.A) || 
        	this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) &&
            !this.selectWork) {
            if (this.menuSelectSfx.isPlaying)
                this.menuSelectSfx.restart()
            else
                this.menuSelectSfx.play('', 0, 0.5, false, true);
        	this.selectWork = true;
    	}
    	if((this.input.keyboard.isDown(Phaser.Keyboard.D) || 
        	this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) &&
            this.selectWork) {
            if (this.menuSelectSfx.isPlaying)
                this.menuSelectSfx.restart()
            else
                this.menuSelectSfx.play('', 0, 0.5, false, true);
        	this.selectWork = false;
    	}
        //Choice has been made
        if (this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) ||
            this.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
            if (this.selectWork) {
                if (this.exit)
                    return;
                if (this.noWorkOption) {
                    this.menuEnterBadSfx.play('', 0, 0.5);
                    return;
                }
                BasicGame.global.player_stats.fatigue++;
                if (BasicGame.global.case == undefined) {
                    BasicGame.global.case_number++;
                    BasicGame.global.case = JSON.parse(this.game.cache.getText('next_case'));
                    this.exit = true;
                    this.camera.fade('#000', 1000);
                    this.menuEnterGoodSfx.play('', 0, 0.75);
                    this.camera.onFadeComplete.addOnce(function () {
                        this.state.start('Cutscene', true, false, 'case/CaseStart_' + (BasicGame.global.case_number));
                    }, this);
                }
                else if (BasicGame.global.case == "final")
                    console.log('final case reached, not yet handled in code');//handle final case choosing here
                else {
                    this.exit = true;
                    this.camera.fade('#000', 1000);
                    this.menuEnterGoodSfx.play('', 0, 0.75);
                    this.camera.onFadeComplete.addOnce(function () {
                        this.state.start('Work', true, false);
                    }, this);
                }
            } else {
                if (this.exit)
                    return;  
                if (this.sceneData == 'no_option') {
                    this.menuEnterBadSfx.play('', 0, 0.5);
                    return;
                }  
                BasicGame.global.player_stats.fatigue = 0;
                this.camera.fade('#000', 1000);
                if (this.sceneData == "nobody_there") {
                    this.exit = true;
                    this.camera.onFadeComplete.addOnce(function () {
                        this.state.start('Cutscene', true, false, 'NobodyThere');
                    }, this);
                } else if (this.sceneData.length == 1) {
                    this.exit = true;
                    this.menuEnterGoodSfx.play('', 0, 0.75);
                    this.camera.onFadeComplete.addOnce(function () {
                        console.log('incrementing ' + this.sceneData[0] + '_ind: ' + (calendar.scenes[this.sceneData[0] + '_ind'] + 1));
                        calendar.scenes[this.sceneData[0] + '_ind']++;
                        this.state.start('Cutscene', true, false, this.sceneData[0] + '_' + calendar.scenes[this.sceneData[0] + '_ind']);
                    }, this);
                } else {
                    this.exit = true;
                    this.menuEnterGoodSfx.play('', 0, 0.75);
                    this.camera.onFadeComplete.addOnce(function () {
                        this.state.start('CharacterDecision', true, false, this.sceneData);
                    }, this);
                }
        	}
    	}    	
	}
	
};