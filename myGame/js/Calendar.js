function Calendar() {
    //new Date(year, month [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
    this.date = new Date(2019, 2, 1);
    this.week = 0;
    this.fedelynn_unlocked = false;
    this.scenes = {
        Fedelynn: {
            'normal': ['Fedelynn_1', 'Fedelynn_2', 'Fedelynn_3', 'Fedelynn_4']
        },
        Fedelynn_ind: 0,
        Keyna: {
            'normal': ['Keyna_1', 'Keyna_2', 'Keyna_3', 'Keyna_4', 'Keyna_5']
        },
        Keyna_ind: 0,
        Tai: {
            'normal': ['Tai_1', 'Tai_2', 'Tai_3', 'Tai_4']
        },
        Tai_ind: 0
    },
    this.schedule = {
            '3/1 Friday': 'no_option',
            '3/2 Saturday': ['Tai'],

            '3/4 Monday': 'nobody_there',
            '3/5 Tuesday': ['Keyna'],
            '3/6 Wednesday': 'nobody_there',
            '3/7 Thursday': ['Keyna'],
            '3/8 Friday': ['Keyna', 'Tai'],
            '3/9 Saturday': ['Fedelynn', 'Keyna', 'Tai'],

            '3/11 Monday': 'nobody_there',
            '3/12 Tuesday': ['Keyna'],
            '3/13 Wednesday': ['Fedelynn', 'Tai'],
            '3/14 Thursday': ['Fedelynn', 'Keyna'],
            '3/15 Friday': ['Tai'],
            '3/16 Saturday': ['Fedelynn', 'Keyna', 'Tai'],

            '3/18 Monday': 'nobody_there',
            '3/19 Tuesday': ['Keyna'],
            '3/20 Wednesday': ['Fedelynn', 'Tai'],
            '3/21 Thursday': ['Fedelynn', 'Keyna'],
            '3/22 Friday': ['Tai'],
            '3/23 Saturday': ['Fedelynn', 'Keyna', 'Tai'],

            '3/25 Monday': 'no_option',
            '3/26 Tuesday': 'no_option',
            '3/27 Wednesday': 'no_option',
            '3/28 Thursday': 'no_option',
            '3/29 Friday': 'no_option',
            '3/30 Saturday': 'no_option'
    }
};

Calendar.prototype = {
    getSceneData: function () {
        var today = this.schedule[this.print()];
        if (today == 'no_option' || today == 'nobody_there') {
            console.log(this.print() + ': ' + today);
            return today;
        }
        for (let i = 0; i < today.length;) {
            if (this.scenes[today[i] + '_ind'] > this.week || (!this.fedelynn_unlocked && today[i] == 'Fedelynn')) {
                today.splice(i, 1);
            }
            else {
                i++;
            }
        }
        if (today.length <= 0)
            today = 'nobody_there';
        console.log(this.print() + ': ' + today);
        return today;
    },
    // Prints a specially formatted version of the date for the game's purposes
    print: function () {
        return (this.date.getMonth() + 1) + '/' + this.date.getDate() + ' ' + this.date.toLocaleString('en-us', { weekday: 'long' });
    },
    // Prints the date 3/X
    printDate: function() {
        return (this.date.getDate());
    },
    // Prints the current day of the week
    printDay: function () {
        return (this.date.toLocaleString('en-us', { weekday: 'long' }));
    },
    // Month here is 1-indexed (January is 1, February is 2, etc). This is
    // because we're using 0 as the day so that it returns the last day
    // of the last month, so you have to add 1 to the month number 
    // so it returns the correct amount of days
    // from: https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
    daysInMonth: function (month, year) {
        return new Date(year, month, 0).getDate();
    },
    //Go to the next day, where months and years automatically roll over
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