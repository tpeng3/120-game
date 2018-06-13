BasicGame.ActivityDecision = function (game) {
	this.music = null;
	//this.playButton = null;
};

BasicGame.ActivityDecision.prototype = {
	preload: function() {
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
        // add agency background. It feels weird adding it twice haha.
        this.add.sprite(0, 0, 'bg_agency');
        this.menuSelectSfx = this.add.audio('sfx_menu_select');
        this.menuEnterBadSfx = this.add.audio('sfx_menu_enter_bad');
        this.menuEnterGoodSfx = this.add.audio('sfx_menu_open');

        // music!
        if(!bgm.isPlaying){
            bgm = this.add.audio('bgm_dbd', 1, true);
            bgm.play();
        }

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
        var daysLeft = '';
        this.lastDayTofinish = false;
        if (BasicGame.global.case == undefined) {
            let dateNum = calendar.date.getDate();
            if ((dateNum == 9 && BasicGame.global.case_flags['Case_1'] != true) || (dateNum == 16 && BasicGame.global.case_flags['Case_2'] != true)) {
                info = "Locke's agency is going under. Finish a case today!";
                this.lastDayTofinish = true;
            } else if (BasicGame.global.case_flags['Case_2'] == true)
                info = 'No more clients for now: take it easy!'
            else
                info = 'No active case: work to find a client!';
        }
        else if (BasicGame.global.case_number == 'final') {
            let bossDat = BasicGame.global.case.boss;
            let percentWork = Math.round(((bossDat.max_health - bossDat.curr_health) / bossDat.max_health) * 100);
            info = 'Case: ' + BasicGame.global.case.case_name + ' (' + percentWork + '% done)';
            daysLeft = 'No time limit'
        } else {
            let bossDat = BasicGame.global.case.boss;
            let percentWork = Math.round(((bossDat.max_health - bossDat.curr_health)/ bossDat.max_health) * 100);
            info = 'Case: ' + BasicGame.global.case.case_name + ' (' + percentWork + '% done)';
            let numDays = BasicGame.global.case.due_date - calendar.date.getDate();
            if (numDays == 0) {
                daysLeft = 'Case due today!!!';
                this.lastDayTofinish = true;
            }
            else {
                daysLeft = 'Case due in: ' + (BasicGame.global.case.due_date - calendar.date.getDate()) + ' day';
                if (numDays != 1)
                    daysLeft += 's';
            }
        }
        this.caseInfoText = this.add.text(textbox.left + 60, 65, info, { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
        caseInfo.scale.setTo(this.caseInfoText.width + 90, this.caseInfoText.height);
        if (daysLeft != '') {
            var daysLeftSprite = this.add.sprite(game.world.width, 20, 'bg_black');
            daysLeftSprite.alpha = 0.75;
            this.daysLeftText = this.add.text(game.world.width, 20, daysLeft, { font: 'bold Trebuchet MS', fontSize: '32px', fill: '#fff' });
            daysLeftSprite.scale.setTo(this.daysLeftText.width + 90, this.daysLeftText.height);
            daysLeftSprite.x -= this.daysLeftText.width + 90;
            this.daysLeftText.x -= this.daysLeftText.width + 60;
        }

        //get scene data
        this.sceneData = calendar.getSceneData();
        this.exit = false;

        // add choice buttons
        if (calendar.print() == "3/2 Saturday" || (BasicGame.global.case_flags.Case_2 == true && BasicGame.global.case_number != 'final')) {
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
        if (this.sceneData == 'no_option' || this.lastDayTofinish)
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
                    this.menuEnterBadSfx.play('', 0, 0.6);
                    return;
                }
                if (BasicGame.global.player_stats.fatigue < 3 && BasicGame.global.case_number != 'final')
                    BasicGame.global.player_stats.fatigue++;
                if (BasicGame.global.case == undefined) {
                    BasicGame.global.case_number++;
                    BasicGame.global.case = JSON.parse(this.game.cache.getText('next_case'));
                    bgm.fadeOut(4000);
                    this.exit = true;
                    this.camera.fade('#000', 1000);
                    this.menuEnterGoodSfx.play('', 0, 0.75);
                    this.camera.onFadeComplete.addOnce(function () {
                        BasicGame.global.case_flags['Case_' + BasicGame.global.case_number] = false;
                        this.state.start('Cutscene', true, false, 'case/CaseStart_' + (BasicGame.global.case_number));
                    }, this);
                } else {
                    bgm.fadeOut(4000);
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
                if (this.sceneData == 'no_option' || this.lastDayTofinish) {
                    this.menuEnterBadSfx.play('', 0, 0.6);
                    return;
                }  
                BasicGame.global.player_stats.fatigue = 0;
                this.camera.fade('#000', 1000);
                if (this.sceneData == "nobody_there") {
                    this.exit = true;
                    this.menuEnterGoodSfx.play('', 0, 0.75);
                    this.camera.onFadeComplete.addOnce(function () {
                        this.state.start('Cutscene', true, false, 'NobodyThere');
                    }, this);
                } else if (this.sceneData.length == 1) {
                    this.exit = true;
                    this.menuEnterGoodSfx.play('', 0, 0.75);
                    this.camera.onFadeComplete.addOnce(function () {
                        calendar.scenes[this.sceneData[0] + '_ind']++;
                        BasicGame.global.player_stats.relationships[this.sceneData[0]]++;
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