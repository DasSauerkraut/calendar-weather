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
  activateListeners(html){
    const nextDay = '#calendar-btn-right';
    const prevDay = '#calendar-btn-left'
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      templateData.day += 1;
      var output = templateData.day + "-" + templateData.month + "-" + templateData.year;
      document.getElementById("calendar-text").innerHTML = output;
    })
    html.find(prevDay).click(ev => {
      ev.preventDefault();
      templateData.day -= 1;
      var output = templateData.day + "-" + templateData.month + "-" + templateData.year;
      document.getElementById("calendar-text").innerHTML = output;
    })
  }
}
class Month {
  name = "";
  length = 0;
  isNumbered = true;
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
  addMonth(month){this.months.append(month)};

  advanceDay(){
    if (day == this.months[this.currentMonth].length){
      day = 1;
      this.advanceMonth();
      if(this.daysOfTheWeek[this.numDayOfTheWeek+1] == null){
        this.numDayOfTheWeek = 0;
      } else {
        this.numDayOfTheWeek += 1;
      }
    } else {
      day += 1;
      if(this.daysOfTheWeek[this.numDayOfTheWeek+1] == null){
        this.numDayOfTheWeek = 0;
      } else {
        this.numDayOfTheWeek += 1;
      }
    }
  }

  advanceMonth(){
    if(this.month[this.currentMonth+1] == null){
      this.currentMonth = 0;
      year += 1;
    } else {
      this.currentMonth += 1;
    }
  }
}

$(document).ready(() => {
  const templatePath = "modules/calendar-weather/templates/calendar.html";
  
  
  templateData = {
    month: 0,
    day: 0,
    year: 0,
    date: "new",
  }
  let c = new Calendar();
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