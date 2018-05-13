// I actually don't know if we really need a calendar state, I was thinking of using it to update kinda like
// the schedules during the day but maybe that can also be done during Bedtime?

function Calendar() {
    //new Date(year, month [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
    this.date = new Date(2020, 5, 1);
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