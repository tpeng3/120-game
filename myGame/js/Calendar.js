// I actually don't know if we really need a calendar state, I was thinking of using it to update kinda like
// the schedules during the day but maybe that can also be done during Bedtime?

function Calendar() {
    //new Date(year, month [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
    this.date = new Date(2018, 3, 2);
};

Calendar.prototype = {
    getSceneKey: function () { },
    // Month here is 1-indexed (January is 1, February is 2, etc). This is
    // because we're using 0 as the day so that it returns the last day
    // of the last month, so you have to add 1 to the month number 
    // so it returns the correct amount of days
    // from: https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
    daysInMonth: function (month, year) {
        return new Date(year, month, 0).getDate();
    },
    //Go to the next day, where months and years automaticall roll over
    nextDay: function () {
        if (this.date.getDate() + 1 > this.daysInMonth(this.date.getMonth(), this.date.getFullYear())) {
            if (this.date.getMonth() == 12) {
                this.date.setMonth(0);
                this.date.setFullYear(this.date.getFullYear() + 1);
            }
            else
            {
                this.date.setMonth(this.date.getMonth() + 1);
                this.date.setDate(1);
            }

        }
        else {
            this.date.setDate(this.date.getDate() + 1);
        }
        console.log(this.date);
    },
};


var calendar = new Calendar();

//BasicGame.Calendar = function (game) {
//	//this.music = null;
//	//this.playButton = null;
//};

//BasicGame.Calendar.prototype = {
//	preload: function() {
//		console.log('Calendar: preload');
//		// load assets if necessary, maybe we want an actual calendar image, who knows
//	},

//	create: function() {
//		console.log('Calendar: create');
//		this.stage.backgroundColor = "#abcabc";
//	},

//	update: function () {
//		// press ENTER to proceed to the next state
//		// decide here whether that state should be MorningClient, MorningTalk, DaytimeWork or DaytimeHang
//		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
//			// if mc finished case, the client flag should be false and state 100% goes to MorningClient
//			// OR
//			// if it's a something% chance that a morning event doesn't trigger, also go to MorningClient
//			// so the player can decide whether they want to work on the case or hang out with people
//			if(this.client == false || Math.random() < .5)
//				this.state.start('MorningClient');
//			// else there is a something% chance that a morning event will trigger? That or we can plan it-
//			// up to further discussion
//			else if(Math.random() < .5)
//				// and maybe we should decide who will be the character talking
//				this.state.start('MorningTalk');
//		}
//	}

//};
