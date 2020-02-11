class CalendarForm extends FormApplication {
  data = {};
  constructor(newData){
    super();
    newData = JSON.parse(newData);
    this.data = {
      months: newData.months,
      daysOfTheWeek: newData.daysOfTheWeek,
      year: newData.year,
      day: newData.day,
      numDayOfTheWeek: newData.numDayOfTheWeek,
      currentMonth: newData.currentMonth,
      currentWeekday: newData.currentWeekday,
      era: newData.era,
      minutes: newData.minutes,
      hours: newData.hours,
    };
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = "modules/calendar-weather/templates/calendar-form.html";
    options.width = 600;
    options.height = "auto";
    return options;
  }

  saveData(){
    let savedData = new DateTime();
    savedData.year = parseInt(document.getElementById("calendar-form-year-input").value);
    savedData.era = document.getElementById("calendar-form-era-input").value;
    savedData.day = parseInt(document.getElementById("calendar-form-cDay-input").value);
    savedData.hours = parseInt(document.getElementById("calendar-form-hour-input").value);
    
    let newWeekdays = document.getElementsByClassName("calendar-form-weekday-input");
    for(var i = 0, max=newWeekdays.length; i < max; i++){
      savedData.addWeekday(newWeekdays[i].value);
    }

    let weekdayTarget = 0;
    if(document.querySelector('input[class="calendar-form-weekday-radio"]:checked') == null){
      weekdayTarget = savedData.daysOfTheWeek.length-1
    } else {
      weekdayTarget = document.querySelector('input[class="calendar-form-weekday-radio"]:checked').value;
    }
    savedData.currentWeekday = savedData.daysOfTheWeek[weekdayTarget];
    savedData.numDayOfTheWeek = weekdayTarget;
    
    let newMonthsName = document.getElementsByClassName("calendar-form-month-input");
    let newMonthsLength = document.getElementsByClassName("calendar-form-month-length-input");
    let newMonthsIsNum = document.getElementsByClassName("calendar-form-month-isnum");
    let newMonthsAbbrev = document.getElementsByClassName("calendar-form-month-abbrev");
    let tempMonth = new Month("Month 1", 30, true);
    for(var i = 0, max = newMonthsName.length; i < max; i++){
      tempMonth.name = newMonthsName[i].value;
      tempMonth.length = newMonthsLength[i].value;
      tempMonth.isNumbered = !newMonthsIsNum[i].checked;
      tempMonth.abbrev = newMonthsAbbrev[i].value;
      savedData.addMonth(tempMonth);
      tempMonth = new Month("Month 1", 30, true);
    }

    let monthTarget = 0;
    if(document.querySelector('input[class="calendar-form-month-radio"]:checked') == null){
      monthTarget = savedData.months.length-1
    } else {
      monthTarget = document.querySelector('input[class="calendar-form-month-radio"]:checked').value;
    }
    savedData.currentMonth = monthTarget;
    savedData.setTimeDisp();
    savedData.setDayLength(24);
    savedData.genDateWordy();
    savedData.genAbbrev();
    let returnData = {
      months: savedData.months,
      daysOfTheWeek: savedData.daysOfTheWeek,
      year: savedData.year,
      day: savedData.day,
      numDayOfTheWeek: savedData.numDayOfTheWeek,
      currentMonth: savedData.currentMonth,
      currentWeekday : savedData.currentWeekday,
      dateWordy: savedData.dateWordy,
      era : savedData.era,
      minutes: savedData.minutes,
      hours: savedData.hours,
      dayLength: savedData.dayLength,
      timeDisp : savedData.timeDisp,
      dateNum : savedData.dateNum,
    }
    console.log(returnData);
    return JSON.stringify(returnData);
  }
  
  

  activateListeners(html){
    const submit = '#calendar-form-submit';
    const addWeekday = '#calendar-form-add-weekday';
    const addMonth = '#calendar-form-add-month';
    const delWeekday = "button[class='calendar-form-weekday-del']";
    const delMonth = "button[class='calendar-form-month-del']"
    html.find(submit).click(ev => {
      ev.preventDefault();
      this.close();
      Hooks.callAll("calendarSettingsClose", this.saveData());
    });
    html.find(addWeekday).click(ev => {
      ev.preventDefault();
      this.data.daysOfTheWeek.push("");
      this.render(true);
    });
    html.find(addMonth).click(ev => {
      ev.preventDefault();
      let newMonth = new Month("", 30, true);
      this.data.months.push(newMonth);
      this.render(true);
    });
    html.find(delWeekday).click(ev => {
      ev.preventDefault();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.daysOfTheWeek.splice(index, 1);
      this.render(true);
    });
    html.find(delMonth).click(ev => {
      ev.preventDefault();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.months.splice(index, 1);
      this.render(true);
    });
  }
  
  getData(){
    return this.data;
  }
  
  formLoaded(){
    return new Promise(resolve => {
      function check() {
        if(document.getElementById('calendar-form-submit')){
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    })
  }

  async checkBoxes() {
    await this.formLoaded();
    let weekdays = document.getElementsByClassName("calendar-form-weekday-radio");
    let monthsNum = document.getElementsByClassName("calendar-form-month-isnum");
    let monthsAbbrev = document.getElementsByClassName("calendar-form-month-abbrev");
    let months = document.getElementsByClassName("calendar-form-month-radio");
    for(var i = 0, max=weekdays.length; i < max; i++){
      if(i == this.data.numDayOfTheWeek){
        weekdays[i].checked = true;
        break;
      } else {
        weekdays[i].checked = false;
      }
    }

    for(var i = 0, max=monthsNum.length; i < max; i++){
      monthsNum[i].checked = !this.data.months[i].isNumbered;
      if(monthsNum[i].checked){
        monthsAbbrev[i].disabled = false; 
        monthsAbbrev[i].style.cursor ='auto'
      }
      if(i == this.data.currentMonth){
        months[i].checked = true;
      }
    }
  }

  renderForm(newData){
    let templatePath = "modules/calendar-weather/templates/calendar-form.html";
    this.data = newData = JSON.parse(newData);
    renderTemplate(templatePath, this.data).then(html => {
      this.render(true)
    }).then(this.checkBoxes());

    Hooks.callAll("calendarSettingsOpen");
  }
}

class Calendar extends Application {
  isOpen = false;
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

  settingsOpen(isOpen){
    this.isOpen = isOpen;
  }

  rebuild(obj){
    if(obj.months.length != 0){templateData.dt.months = obj.months;}
    if(obj.daysOfTheWeek != []){templateData.dt.daysOfTheWeek = obj.daysOfTheWeek;}
    if(obj.year != 0){templateData.dt.year = obj.year;}
    if(obj.day != 0){templateData.dt.day = obj.day;}
    templateData.dt.numDayOfTheWeek = obj.numDayOfTheWeek;
    templateData.dt.currentMonth = obj.currentMonth;
    if(obj.currentWeekday != ""){templateData.dt.currentWeekday = obj.currentWeekday;}
    if(obj.dateWordy != ""){templateData.dt.dateWordy = obj.dateWordy;}
    if(obj.era != ""){templateData.dt.era = obj.era;}
    templateData.dt.minutes = obj.minutes;
    templateData.dt.hours = obj.hours;
    if(obj.dayLength != 0){templateData.dt.dayLength = obj.dayLength;}
    if(obj.timeDisp != ""){templateData.dt.timeDisp = obj.timeDisp;}
    if(obj.dateNum != ""){templateData.dt.dateNum = obj.dateNum;}
    templateData.dt.setTimeDisp();
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

  getFormattedDate(){
    let date = game.Gametime.DTNow().longDate().date.split(" ");
    let month = date[1];
    let day = date[2];
    let year = date[3];
    let dayAppendage = "";
    day = parseInt(day);
    if(day % 10 == 1 && day != 11){
      dayAppendage = "st";
    } else if (day % 10 == 2) {
      dayAppendage = "nd";
    } else if (day % 10 == 3) {
      dayAppendage = "rd";
    } else {
      dayAppendage = "th";
    }
    return day + dayAppendage + " of " + month + ", " + year;
  }

  getWeekday(){
    let date = game.Gametime.DTNow().longDate().date.split(" ")
    return date[0];
  }

  getAMPMTime(){
    let longTime = game.Gametime.DTNow().shortDate().time;
    longTime = longTime.split(":");
    let hours = longTime[0];
    let minutes = longTime[1];
    let sec = longTime[2];
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    return hours + ":" + minutes + ":" + sec + " " + AmOrPm;
  }

  updateDisplay(){
    document.getElementById("calendar-date").innerHTML = this.getFormattedDate();
    document.getElementById("calendar-date-num").innerHTML = game.Gametime.DTNow().shortDate().date;
    document.getElementById("calendar-weekday").innerHTML = this.getWeekday();
    document.getElementById("calendar-time").innerHTML = this.getAMPMTime();
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
      weather: templateData.dt.weather
    }
  }

  activateListeners(html){
    const nextDay = '#calendar-btn-day';
    const quickAction = '#calendar-btn-quick';
    const oneSec = '#calendar-btn-sec';
    const halfMin = '#calendar-btn-halfMin';
    const min = '#calendar-btn-min';
    const fiveMin = '#calendar-btn-fiveMin';
    const calendarSetup = '#calendar-date';
    const calendarSetupOverlay = '#calendar-date-num'
    const longAction = '#calendar-btn-long';
    const nightSkip = '#calendar-btn-night';
    const toggleClock = '#calendar-time';
    this.clockIsRunning = true;
    
    this.updateDisplay()
    //Next Morning
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM){
        console.log("calendar-weather | To morning.");
        game.Gametime.advanceTime({days: 1})
      }
    });
    //Quick Action
    html.find(quickAction).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM){
        console.log("calendar-weather | Advancing 15 min.");
        game.Gametime.advanceTime({minutes: 15})
      }
    });
    //1 sec advance
    html.find(oneSec).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM && !this.clockIsRunning){
        console.log("calendar-weather | Advancing 1 sec.");
        game.Gametime.advanceClock(1)
      }
    });
    //advance 30s
    html.find(halfMin).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM && !this.clockIsRunning){
        console.log("calendar-weather | Advancing 30 sec");
        game.Gametime.advanceClock(30)
      }
    });
    //advance 1 min
    html.find(min).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM){
        console.log("calendar-weather | Advancing 1 min.");
        game.Gametime.advanceTime({minutes: 1})
      }
    });
    //advance 5 min
    html.find(fiveMin).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM){
        console.log("calendar-weather | Advancing 5 min.");
        game.Gametime.advanceTime({minutes: 5})
      }
    });
    //Long Action
    html.find(longAction).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM){
        console.log("calendar-weather | Advancing 1 hr.");
        game.Gametime.advanceTime({hours: 1})
      }
    });
    //To Midnight
    html.find(nightSkip).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM){
        console.log("calendar-weather | Advancing to midnight.");
        game.Gametime.advanceTime({days: 1})
      }
    });
    //toggles real time clock on off, disabling granular controls
    html.find(toggleClock).click(ev => {
      ev.preventDefault();
      if(!this.isOpen && game.user.isGM){
        if(this.clockIsRunning){
          console.log("calendar-weather | Stopping about-time pseudo clock.");
          this.clockIsRunning = false;
          game.Gametime.stopRunning();
          document.getElementById('calendar-btn-sec').disabled = false;
          document.getElementById('calendar-btn-halfMin').disabled = false;
          document.getElementById('calendar-btn-sec').style.cursor = 'pointer';
          document.getElementById('calendar-btn-halfMin').style.cursor = 'pointer';
          document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 1)";
          document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 1)";
        } else {
          console.log("calendar-weather | Starting about-time pseudo clock.");
          this.clockIsRunning = true;
          game.Gametime.startRunning();
          document.getElementById('calendar-btn-sec').disabled = true;
          document.getElementById('calendar-btn-halfMin').disabled = true;
          document.getElementById('calendar-btn-sec').style.cursor = 'not-allowed';
          document.getElementById('calendar-btn-halfMin').style.cursor = 'not-allowed';
          document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 0.5)";
          document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 0.5)";
        }
      }
    });
    //handles hover events because can't access css hover property
    html.find(oneSec).mouseover(ev => {
      ev.preventDefault();
      if(!this.clockIsRunning){
        document.getElementById('calendar-btn-sec').style.color = "#FFF"
      }
    });
    html.find(oneSec).mouseleave(ev => {
      ev.preventDefault();
      if(!this.clockIsRunning){
        document.getElementById('calendar-btn-sec').style.color = "#000"
      }
    });
    html.find(halfMin).mouseover(ev => {
      ev.preventDefault();
      if(!this.clockIsRunning){
        document.getElementById('calendar-btn-halfMin').style.color = "#FFF"
      }
    });
    html.find(halfMin).mouseleave(ev => {
      ev.preventDefault();
      if(!this.clockIsRunning){
        document.getElementById('calendar-btn-halfMin').style.color = "#000"
      }
    });
    //Launch Calendar Form
    html.find(calendarSetup).click(ev => {
      ev.preventDefault();
      if(game.user.isGM){
        this.updateDisplay();
      }
      
    });
    html.find(calendarSetupOverlay).click(ev => {
      ev.preventDefault();
      if(game.user.isGM){
        // form.renderForm(JSON.stringify(this.toObject()));
        this.updateDisplay();
      }
    });
    
  }
}

class WeatherTracker {
  humidity = 0;
  temp = 0;
  lastTemp = 70;
  seasonTemp = 0;
  seasonHumidity = 0;
  climateTemp = 0;
  climateHumidity = 0;
  precipitation = "";
  isVolcanic = false;

  rand(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  extremeWeather(){
    let roll = this.rand(1,5);
    let event = "";
    if(this.isVolcanic){
      return "Volcano Erupts!";
    }
    switch(roll){
      case 1:
        event = "Tornado";
        break;
      case 2:
        event = "Hurricane or large amounts of flooding";
        break;
      case 3:
        event = "Drought";
        this.humidity = -5;
        break;
      case 4:
        event = "Baseball-sized hail";
        break;
      case 5:
        if(this.temp <= 32){
          event = "Extreme blizzard"
        } else {
          event = "Monsoon-like rainfall"
        }
        break;
    }
    return event;
  }

  setClimate(climate){
    this.isVolcanic = false;
    switch(climate){
      case "temperate":
        this.climateHumidity = 0;
        this.climateTemp = 0;
        break;
      case "tempMountain":
        this.climateHumidity = 0;
        this.climateTemp = -10;
        break;
      case "desert":
        this.climateHumidity = -1;
        this.climateTemp = 20;
        break;
      case "tundra":
        this.climateHumidity = 0;
        this.climateTemp = -20;
        break;
      case "tropical":
        this.climateHumidity = 1;
        this.climateTemp = 10;
        break;
      case "taiga":
        this.climateHumidity = -1;
        this.climateTemp = -20;
        break;
      case "volcanic":
        this.climateHumidity = 0;
        this.climateTemp = 40;
        this.isVolcanic = true;
        break;
    }
  }

  genPrecip(roll){
    if(roll < 1){
      roll = this.rand(1, 6);
    }
    if(roll <= 3){
      if(this.isVolcanic){
        return "Ashen skies today";
      }
      return "Clear sky today.";
    } else if (roll <= 6){
      this.humidity += 1;
      if(this.isVolcanic){
        return "Dark, smokey skies today";
      }
      return "Scattered clouds, but mostly clear today."
    } else if (roll == 7){
      if(this.isVolcanic){
        return "The sun is completely obscured by ash, possible ashfall today";
      }
      if(this.temp < 25){
        return "Completely overcast with some snow flurries possible.";
      } else if(this.temp < 32){
        return "Completely overcast with light freezing rain possible.";
      } else {
        return "Completely overcast; light drizzles possible.";
      }
    } else if (roll == 8){
      this.humidity -= 1;
      if(this.isVolcanic){
        return "Large ashfall today.";
      }
      if(this.temp < 25){
        return "A light to moderate amount of snow today.";
      } else if(this.temp < 32){
        return "Light to moderate freezing rain today.";
      } else {
        return "Light to moderate rain today.";
      }
    } else if (roll == 9){
      this.humidity -= 2;
      if(this.isVolcanic){
        return "Firey rain today, take cover.";
      }
      if(this.temp < 25){
        return "Large amount of snowfall today.";
      } else if(this.temp < 32){
        return "Large amount of freezing rain today.";
      } else {
        return "Heavy Rain today.";
      }
    } else if (roll >= 10){
      if(this.rand(1,20) == 20){
        return this.extremeWeather();
      } else {
        this.humidity -= 2;
        if(this.isVolcanic){
          return "Earthquake, firey rain, and toxic gases today.";
        }
        if(this.temp < 25){
          return "Blizzard today.";
        } else if(this.temp < 32){
          return "Icestorm today.";
        } else {
          return "Torrential rains today.";
        }
      }
    }
  }
  
  generate(){
    this.setClimate("volcanic")
    let roll = this.rand(1, 6) + this.humidity + this.climateHumidity;
    if(this.rand(1,5) >= 5){
      this.temp = this.rand(20,60) + this.seasonTemp + this.climateTemp;
      this.lastTemp = this.temp;
    } else {
      this.temp = this.rand(this.lastTemp - 5, this.lastTemp + 5);
      this.lastTemp = this.temp;
    }
    this.precipitation = this.genPrecip(roll);
  }
}

$(document).ready(() => {
  const templatePath = "modules/calendar-weather/templates/calendar.html";

  templateData = {
    clockIsRunning: true,
  }

  const  GregorianCalendar = {
    // month lengths in days - first number is non-leap year, second is leapy year
    "month_len": {
        "January": [31,31],
        "February": [28, 29],
        "March": [31,31],
        "April": [30,30],
        "May": [31,31],
        "June": [30,30],
        "July": [31,31],
        "August": [31,31],
        "September": [30,30],
        "October": [31,31],
        "November": [30,30],
        "December": [31,31],
    },
    // a function to return the number of leap years from 0 to the specified year. 
    "leap_year_rule": (year) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400),
    // names of the days of the week. It is assumed weeklengths don't change
    "weekdays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    // year when the clock starts and time is recorded as seconds from this 1/1/clock_start_year 00:00:00. If is set to 1970 as a unix joke. you can set it to 0.
    "clock_start_year": 2000,
    // day of the week of 0/0/0 00:00:00
    "first_day": 6,
    "notes": {},
    "hours_per_day": 24,
    "seconds_per_minute": 60,
    "minutes_per_hour": 60,
    // Is there a year 0 in the calendar? Gregorian goes from -1BC to 1CE with no 0 in between.
    "has_year_0": false
  }

  let c = new Calendar();
  // Init settings so they can be wrote to later
  Hooks.on('init', ()=> {
    // game.Gametime.DTC()._createFromData(GregorianCalendar);
  });

  Hooks.on('calendarSettingsOpen', ()=> {
    console.log("Hook fired! Calendar Settings is open.")
    c.settingsOpen(true);
  });

  Hooks.on('calendarSettingsClose', (updatedData)=> {
    console.log("Hook fired! Calendar Settings is closed.");
    c.rebuild(JSON.parse(updatedData));
    c.updateDisplay();
    c.settingsOpen(false);
  });

  Hooks.on('closeCalendarForm', ()=> {
    console.log("Hook fired! Calendar Settings is closed.");
    c.settingsOpen(false);
  });

  Hooks.on('ready', ()=> {
    renderTemplate(templatePath, templateData).then(html => {
      c.render(true);
    });
    game.Gametime.startRunning();
  });
  Hooks.on("pseudoclockSet", ()=>{
    c.updateDisplay();
  })
});