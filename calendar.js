class CalendarForm extends FormApplication {
  
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = "modules/calendar-weather/templates/calendar-form.html";
    options.width = 600;
    options.height = "auto";
    return options;
  }

  activateListeners(html){
    const nextDay = '#calendar-keys';
    //Next Morning
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      console.log("CLICKY");
    });
  }
  
  getData(){
    return {};
  }

  renderForm(){
    let templatePath = "modules/calendar-weather/templates/calendar-form.html";
    let templateData = {}
    renderTemplate(templatePath, templateData).then(html => {
      this.render(true);
    });
  }

}

class Calendar extends Application {
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

  loadSettings(){
    let data = game.settings.get('calendar-weather', 'dateTime');
    templateData.dt.months = data.default.months;
    templateData.dt.daysOfTheWeek = data.default.daysOfTheWeek;
    templateData.dt.year = data.default.year;
    templateData.dt.day = data.default.day;
    templateData.dt.numDayOfTheWeek = data.default.numDayOfTheWeek;
    templateData.dt.currentMonth = data.default.currentMonth;
    templateData.dt.currentWeekday = data.default.currentWeekday;
    templateData.dt.dateWordy = data.default.dateWordy;
    templateData.dt.era = data.default.era;
    templateData.dt.minutes = data.default.minutes;
    templateData.dt.hours = data.default.hours;
    templateData.dt.dayLength = data.default.dayLength;
    templateData.dt.timeDisp = data.default.timeDisp;
    templateData.dt.dateNum = data.default.dateNum;
  }

  populateData(){
      let newMonth1 = new Month("Month 1", 30, true);
      templateData.dt.addMonth(newMonth1);
      templateData.dt.addWeekday("Monday");
      templateData.dt.addWeekday("Tuesday");
      templateData.dt.addWeekday("Wednesday");
      templateData.dt.addWeekday("Thursday");
      templateData.dt.setYear(2020);
      templateData.dt.setEra("AD");
      templateData.dt.setWeekday("Monday")
      templateData.dt.setTimeDisp();
      templateData.dt.setDayLength(24);
      templateData.dt.genDateWordy();
  }

  updateSettings(){
    game.settings.update('calendar-weather.dateTime', {
      name: "Date/Time Data",
      scope: 'world',
      config: false,
      default: this.toObject(),
      type: Object,
    });
  }

  updateDisplay(){
    document.getElementById("calendar-date").innerHTML = templateData.dt.dateWordy;
    document.getElementById("calendar-date-num").innerHTML = templateData.dt.dateNum;
    document.getElementById("calendar-weekday").innerHTML = templateData.dt.currentWeekday;
    document.getElementById("calendar-time").innerHTML = templateData.dt.timeDisp;
  }

  toObject(){
    return {
      months: templateData.dt.months,
      daysOfTheWeek: templateData.dt.daysOfTheWeek,
      year: templateData.dt.year,
      day: templateData.dt.day,
      numDayOfTheWeek: templateData.dt.numDayOfTheWeek,
      currentMonth: templateData.dt.currentMonth,
      currentWeekday : templateData.dt.currentWeekday,
      dateWordy: templateData.dt.dateWordy,
      era : templateData.dt.era,
      minutes: templateData.dt.minutes,
      hours: templateData.dt.hours,
      dayLength: templateData.dt.dayLength,
      timeDisp : templateData.dt.timeDisp,
      dateNum : templateData.dt.dateNum,
    }
  }

  activateListeners(html){
    const nextDay = '#calendar-btn-day';
    const quickAction = '#calendar-btn-quick';
    const calendarSetup = '#calendar-date';
    const calendarSetupOverlay = '#calendar-date-num'
    const longAction = '#calendar-btn-long';
    const nightSkip = '#calendar-btn-night';
    this.updateDisplay()
    let form = new CalendarForm();
    //Next Morning
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      templateData.dt.advanceMorning();
      this.updateDisplay();
      this.updateSettings();
    });
    //Quick Action
    html.find(quickAction).click(ev => {
      ev.preventDefault();
      templateData.dt.quickAction();
      this.updateDisplay();
      this.updateSettings();
    });
    //Long Action
    html.find(longAction).click(ev => {
      ev.preventDefault();
      templateData.dt.advanceHour();
      this.updateDisplay();
      this.updateSettings();
    });
    //To Midnight
    html.find(nightSkip).click(ev => {
      ev.preventDefault();
      templateData.dt.advanceNight();
      this.updateDisplay();
      this.updateSettings();
    });
    //Launch Calendar Form
    html.find(calendarSetup).click(ev => {
      ev.preventDefault();
      console.log("-------DISPLAYING CALENDAR FORM----------")
      form.renderForm(true);
    });
    html.find(calendarSetupOverlay).click(ev => {
      ev.preventDefault();
      console.log("-------DISPLAYING CALENDAR FORM----------")
      form.renderForm(true);
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

  setAbbrev(abbrev){this.abbrev = abbrev};
  getAbbrev(){return this.abbrev};
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
  dateNum = "";

  addMonth(month){this.months.push(month)};
  addWeekday(day){this.daysOfTheWeek.push(day)};
  setYear(year){this.year = year}
  setEra(era){this.era = era}
  setDayLength(length) {this.dayLength = length}
  setWeekday(day){this.currentWeekday = day}

  setTimeDisp(){
    let minDisp = ""
    let sunDisp = ""
    if(6 <= this.hours && this.hours <= 11){
      sunDisp = "Morning";
    } else if(this.hours == 12){
      sunDisp = "Noon";
    } else if (13 <= this.hours && this.hours <= 16){
      sunDisp = "Afternoon";
    } else if (17 <= this.hours && this.hours <= 21){
      sunDisp = "Evening";
    } else if (22 <= this.hours && this.hours <= 24){
      sunDisp = "Night";
    } else if (this.hours == 0){
      sunDisp = "Midnight";
    } else if (1 <= this.hours && this.hours <= 3){
      sunDisp = "Night";
    } else if (4 <= this.hours && this.hours <= 5){
      sunDisp = "Early Morning";
    }

    if(this.minutes == 0){
      minDisp = "00";
    } else {
      minDisp = this.minutes * 15;
    }
    this.timeDisp = this.hours + ":" + minDisp + ", " + sunDisp;
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
    
    let monthNum = "";
    if(this.months[this.currentMonth].isNumbered){
      monthNum = this.currentMonth + 1;
    } else {
      monthNum = this.months[this.currentMonth].getAbbrev()
    }
    this.dateNum = this.day + "/" + monthNum + "/" + this.year + " " + this.era;
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
  // Init settings so they can be wrote to later
  Hooks.on('init', ()=> {
    c.populateData();
    game.settings.register('calendar-weather', 'dateTime', {
      name: "Date/Time Data",
      scope: 'world',
      config: false,
      default: c.toObject(),
      type: Object,
    });
    c.loadSettings();
  });

  Hooks.on('ready', ()=> {
    renderTemplate(templatePath, templateData).then(html => {
      c.render(true);
    });
  });  
});