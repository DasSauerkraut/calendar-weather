class Calendar extends Application {

  /**
   * Define default options for the Calendar application
   */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = "modules/calendar-weather/templates/calendar.html";
    options.popOut = false;
    options.resizable = false;
    return options;
  }
  getData() {
    return templateData;
  }

  populateData(){
    let newMonth1 = new Month("Month 1", 1, true);
    templateData.dt.addMonth(newMonth1);
    let newMonth2 = new Month("Month 2", 2, true);
    templateData.dt.addMonth(newMonth2);
    let newMonth3 = new Month("Wow look at this incredibly long month name", 11, true);
    templateData.dt.addMonth(newMonth3);
    templateData.dt.addWeekday("Monday");
    templateData.dt.addWeekday("Tuesday");
    templateData.dt.addWeekday("Wednesday");
    templateData.dt.addWeekday("Thursday");
    templateData.dt.setYear(1234);
    templateData.dt.setEra("IC");
    templateData.dt.setWeekday("Monday")
    templateData.dt.setTimeDisp();
    templateData.dt.setDayLength(24);
    templateData.dt.genDateWordy();
  }

  updateDisplay(){
    document.getElementById("calendar-text").innerHTML = templateData.dt.dateWordy;
    document.getElementById("calendar-weekday").innerHTML = templateData.dt.currentWeekday;
    document.getElementById("calendar-time").innerHTML = templateData.dt.timeDisp;
  }

  activateListeners(html){
    const nextDay = '#calendar-btn-day';
    const quickAction = '#calendar-btn-quick';
    const longAction = '#calendar-btn-long';
    const nightSkip = '#calendar-btn-night';
    this.updateDisplay()
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      templateData.dt.advanceMorning();
      this.updateDisplay()
    });
    html.find(quickAction).click(ev => {
      ev.preventDefault();
      templateData.dt.quickAction();
      this.updateDisplay();
    });
    html.find(longAction).click(ev => {
      ev.preventDefault();
      templateData.dt.advanceHour();
      this.updateDisplay();
    });
    html.find(nightSkip).click(ev => {
      ev.preventDefault();
      templateData.dt.advanceNight();
      this.updateDisplay();
    });
  }
}
class Month {
  name = "";
  length = 0;
  isNumbered = true;
  abbrev = "";
  constructor(name, length, isNumbered){
    this.name = name;
    this.length = length;
    this.isNumbered = isNumbered;
  }
}

class DateTime {
  months = [];
  daysOfTheWeek = [];
  year = 0;
  day = 0;
  numDayOfTheWeek = 0;
  currentMonth = 0;
  currentWeekday = "";
  dateWordy ="";
  era = "";
  minutes = 0;
  hours = 0;
  dayLength = 0;
  timeDisp = "";

  addMonth(month){this.months.push(month)};
  addWeekday(day){this.daysOfTheWeek.push(day)};
  setYear(year){this.year = year}
  setEra(era){this.era = era}
  setDayLength(length) {this.dayLength = length}
  setWeekday(day){this.currentWeekday = day}

  setTimeDisp(){
    let minDisp = ""
    if(this.minutes == 0){
      minDisp = "00";
    } else {
      minDisp = this.minutes * 15;
    }
    this.timeDisp = this.hours + ":" + minDisp;
  }

  quickAction(){
    if(this.minutes == 3){
      this.advanceHour()
      this.minutes = 0;
    } else {
      this.minutes += 1;
    }
    this.setTimeDisp();
  }

  advanceHour(){
    if(this.hours == this.dayLength - 1){
      this.advanceDay();
      this.hours = 0;
    } else {
      this.hours += 1;
    }
    this.setTimeDisp();
  }

  advanceNight(){
    this.advanceDay();
    this.hours = 0;
    this.minutes = 0;
    this.setTimeDisp();
  }

  advanceMorning(){
    this.advanceDay();
    this.hours = 7;
    this.minutes = 0;
    this.setTimeDisp();
  }

  genDateWordy(){
    let dayAppendage = "";
    if(this.day % 10 == 1 && this.day != 11){
      dayAppendage = "st";
    } else if (this.day % 10 == 2) {
      dayAppendage = "nd";
    } else if (this.day % 10 == 3) {
      dayAppendage = "rd";
    } else {
      dayAppendage = "th";
    }
    this.dateWordy = this.day + dayAppendage + " of " 
      + this.months[this.currentMonth].name + ", " + this.year + " " + this.era;
  }

  advanceDay(){
    if (this.day == this.months[this.currentMonth].length){
      this.day = 1;
      this.advanceMonth();
      if(this.daysOfTheWeek[this.numDayOfTheWeek+1] == null){
        this.numDayOfTheWeek = 0;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      } else {
        this.numDayOfTheWeek += 1;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      }
    } else {
      this.day += 1;
      if(this.daysOfTheWeek[this.numDayOfTheWeek+1] == null){
        this.numDayOfTheWeek = 0;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      } else {
        this.numDayOfTheWeek += 1;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      }
    }
    this.genDateWordy()
  }

  advanceMonth(){
    let lookforward = this.currentMonth+1;
    if(this.months[lookforward] == null){
      this.currentMonth = 0;
      this.year += 1;
    } else {
      this.currentMonth += 1;
    }
  }
}

$(document).ready(() => {
  const templatePath = "modules/calendar-weather/templates/calendar.html";
  
  
  templateData = {
    dt: new DateTime()
  }

  let c = new Calendar();
  c.populateData();
  // Settings
  Hooks.on('init', ()=> {
    game.settings.register('calendar-weather', 'Calendar Config', {
      name: "Calendar Configuration",
      hint: "Enter your months, days etc WIP",
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  });

  Hooks.on('ready', ()=> {
    renderTemplate(templatePath, templateData).then(html => {
      c.render(true);
    });
  });

  
});