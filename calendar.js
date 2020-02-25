class CalendarEvents extends FormApplication {
  data = {
    seasons: [],
    reEvents: [],
    events: []
  };
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = "modules/calendar-weather/templates/calendar-events.html";
    options.width = 600;
    options.height = "auto";
    return options;
  }

  saveData() {
    let savedData = {
      seasons: [],
      reEvents: [],
      events: [],
    };

    let reEventName = document.getElementsByClassName("calendar-reEvent-name");
    let reEventMonth = document.getElementsByClassName("calendar-reEvent-month-value");
    let reEventDay = document.getElementsByClassName("calendar-reEvent-day");
    let reEventContent = document.getElementsByClassName("calendar-reEvent-text");
    let event = {};
    let day = 0;
    for (var i = 0, max = reEventName.length; i < max; i++) {
      event['name'] = reEventName[i].value;
      day = parseInt(reEventDay[i].selectedIndex) + 1
      event['date'] = {
        month: reEventMonth[i].options[reEventMonth[i].selectedIndex].value,
        day: day,
        combined: reEventMonth[i].options[reEventMonth[i].selectedIndex].value + '-' + day,
      };
      event['text'] = reEventContent[i].value;
      savedData.reEvents.push(event);
      event = {};
    }
    this.data = Object.assign(this.data, savedData);
    return JSON.stringify(this.data);
  }

  getData() {
    return this.data;
  }

  formLoaded(element) {
    return new Promise(resolve => {
      function check() {
        if (document.getElementById(element)) {
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    })
  }

  async checkBoxes() {
    console.log(this.data.reEvents.length);
    //wait until form is loaded
    await this.formLoaded('calendar-reEvent-' + (this.data.reEvents.length - 1));
    //get form data
    let names = document.getElementsByClassName("calendar-reEvent-name");
    let days = document.getElementsByClassName("calendar-reEvent-day");
    let months = document.getElementsByClassName("calendar-reEvent-month-value");
    //init vars
    let length = 0;
    let event = undefined
    const numElements = this.data.reEvents.length

    //loop through all events setting dropdowns to correct value
    for (var i = 0; i < numElements; i++) {
      //makes sure element exists at i
      if (names[i] && months[i]) {
        //gets event that matches element from data
        event = this.data.reEvents.find(fEvent => fEvent.name == names[i].value);
        if (event) {
          //loop through each option for the month dropdown, finding the one that matches the event's date and selects it
          for (var k = 0, max = months[i].getElementsByTagName('option').length; k < max; k++) {
            if (months[i].getElementsByTagName('option')[k].value == event.date.month) {
              months[i].getElementsByTagName('option')[k].selected = true;
              //also grabs the months length, while it's there.
              length = parseInt(months[i].getElementsByTagName('option')[k].attributes['name'].value);
            }
          }
          //create a whole bunch of options corresponding to each day in the selected month.
          let frag = document.createDocumentFragment();
          let element = days[i];
          //clears day selection to prevent day duplication
          while(element.firstChild){
            element.removeChild(element.firstChild);
          }
          //create a dropdown option for the length of the selected month
          for (var k = 1, max = length + 1; k < max; k++) {
            var option = document.createElement('option');
            option.value = k;
            //if the index is the same as the event's day, select it.
            if (k == event.date.day) {
              option.selected = true;
            }
            option.appendChild(document.createTextNode(k));
            frag.appendChild(option);
          }
          //add generated days to the day dropdown.
          element.appendChild(frag);
        }
      }
    }
  }

  activateListeners(html) {
    const submit = '#calendar-events-submit';
    const addSeason = '#calendar-events-add-season';
    const delSeason = "button[class='calendar-season-del']";
    const addReEvent = "#calendar-events-add-reEvent";
    const delReEvent = "button[class='calendar-reEvent-del']";
    html.find(submit).click(ev => {
      ev.preventDefault();
      Hooks.callAll("calendarEventsClose", this.saveData());
      // this.saveData();
      this.close();
      // Hooks.callAll("calendarSettingsClose", this.saveData());
    });
    html.find(addSeason).click(ev => {
      ev.preventDefault();
      this.saveData();
      this.data.seasons.push({
        name: ""
      });
      this.render(true);
      // this.checkBoxes();
    });
    html.find(addReEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      this.data.reEvents.push({
        name: "",
        date: {
          month: "1",
          day: 1,
          combined: "1-" + 1
        }
      });
      this.render(true);
      // this.checkBoxes();
    });
    html.find(delSeason).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.seasons.splice(index, 1);
      this.render(true);
      // this.checkBoxes();
    });
    html.find(delReEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.reEvents.splice(index, 1);
      this.render(true);
      // this.checkBoxes();

    });
  }

  renderForm(newData) {
    this.data = Object.assign(this.data, JSON.parse(newData));
    this.data.events.push({
      name: "test",
      date: {year: 1257},
    });
    console.log(this.data.events)
    let templatePath = "modules/calendar-weather/templates/calendar-events.html";
    renderTemplate(templatePath, this.data).then(html => {
      this.render(true)
    });
  }
}

class CalendarForm extends FormApplication {
  data = {};
  constructor(newData) {
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
      hours: game.Gametime.DTNow().hours,
      minutes: game.Gametime.DTNow().minutes,
      seconds: game.Gametime.DTNow().seconds,
    };
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = "modules/calendar-weather/templates/calendar-form.html";
    options.width = 600;
    options.height = "auto";
    return options;
  }

  saveData() {
    let savedData = new DateTime();
    let year = parseInt(document.getElementById("calendar-form-year-input").value);
    if (year < 0) {
      year = 1;
    }
    savedData.year = year;

    savedData.era = document.getElementById("calendar-form-era-input").value;

    let hours = parseInt(document.getElementById("calendar-form-hour-input").value)
    if (hours > 24 || hours < 0) {
      hours = 23;
    }
    if (document.getElementById("calendar-form-ampm").value == "PM" && hours < 12) {
      hours = hours + 12;
    }
    if (document.getElementById("calendar-form-ampm").value == "AM" && hours == 12) {
      hours == hours - 12;
    }

    let minutes = parseInt(document.getElementById("calendar-form-minute-input").value);
    if (minutes > 59 || minutes < 0) {
      minutes = 59;
    }

    let seconds = parseInt(document.getElementById("calendar-form-second-input").value)
    if (seconds > 59 || seconds < 0) {
      seconds = 59
    }

    if (this.data.hours != hours || this.data.minutes != minutes || this.data.seconds != seconds) {
      game.Gametime.setTime({
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
    }

    let newWeekdays = document.getElementsByClassName("calendar-form-weekday-input");
    if (newWeekdays.length < 1) {
      savedData.addWeekday("Weekday");
    }
    for (var i = 0, max = newWeekdays.length; i < max; i++) {
      if (newWeekdays[i].value) {
        savedData.addWeekday(newWeekdays[i].value);
      } else {
        savedData.addWeekday("Weekday");
      }

    }

    let weekdayTarget = 0;
    if (document.querySelector('input[class="calendar-form-weekday-radio"]:checked') == null) {
      weekdayTarget = savedData.daysOfTheWeek.length - 1
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
    if (newMonthsName.length < 1) {
      savedData.addMonth(tempMonth);
    }
    for (var i = 0, max = newMonthsName.length; i < max; i++) {
      if (newMonthsName[i].value == "") {
        tempMonth.name = "New Month"
      } else {
        tempMonth.name = newMonthsName[i].value;
      }
      tempMonth.length = newMonthsLength[i].value;
      tempMonth.isNumbered = !newMonthsIsNum[i].checked;
      if (newMonthsIsNum[i].checked) {
        if (newMonthsAbbrev[i].value) {
          tempMonth.abbrev = newMonthsAbbrev[i].value;
        } else {
          console.log("Generating Abbrev")
          tempMonth.abbrev = tempMonth.name.substring(0, 2).toUpperCase();
        }
      }
      savedData.addMonth(tempMonth);
      tempMonth = new Month("Month 1", 30, true);
    }

    let monthTarget = 0;
    if (document.querySelector('input[class="calendar-form-month-radio"]:checked') == null) {
      monthTarget = savedData.months.length - 1
    } else {
      monthTarget = document.querySelector('input[class="calendar-form-month-radio"]:checked').value;
    }
    savedData.currentMonth = monthTarget;

    let day = parseInt(document.getElementById("calendar-form-cDay-input").value);
    if (savedData.months[savedData.currentMonth].length < day) {
      day = savedData.months[savedData.currentMonth].length - 1
    }
    if (savedData.months[savedData.currentMonth].length == 1) {
      day = 1;
    }

    savedData.day = day;

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
      currentWeekday: savedData.currentWeekday,
      dateWordy: savedData.dateWordy,
      era: savedData.era,
      dayLength: savedData.dayLength,
      timeDisp: savedData.timeDisp,
      dateNum: savedData.dateNum,
    }
    console.log("calendar-weather | Building new calendar with the following object:")
    console.log(returnData);
    return JSON.stringify(returnData);
  }



  activateListeners(html) {
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
      this.data = JSON.parse(this.saveData());
      this.data.daysOfTheWeek.push("");
      this.render(true);
      this.checkBoxes();
    });
    html.find(addMonth).click(ev => {
      ev.preventDefault();
      this.data = JSON.parse(this.saveData());
      let newMonth = new Month("", 30, true);
      this.data.months.push(newMonth);
      this.render(true);
      this.checkBoxes();
    });
    html.find(delWeekday).click(ev => {
      ev.preventDefault();
      this.data = JSON.parse(this.saveData());
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.daysOfTheWeek.splice(index, 1);
      this.render(true);
      this.checkBoxes();
    });
    html.find(delMonth).click(ev => {
      ev.preventDefault();
      this.data = JSON.parse(this.saveData());
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.months.splice(index, 1);
      this.render(true);
      this.checkBoxes();
    });
    html.find("*").keydown(ev => {
      if (ev.which == 13) {
        ev.preventDefault();
        this.close();
        Hooks.callAll("calendarSettingsClose", this.saveData());
      }
    });

  }

  getData() {
    return this.data;
  }

  formLoaded() {
    return new Promise(resolve => {
      function check() {
        if (document.getElementById('calendar-form-submit')) {
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
    for (var i = 0, max = weekdays.length; i < max; i++) {
      if (i == this.data.numDayOfTheWeek) {
        weekdays[i].checked = true;
        break;
      } else {
        weekdays[i].checked = false;
      }
    }

    for (var i = 0, max = monthsNum.length; i < max; i++) {
      monthsNum[i].checked = !this.data.months[i].isNumbered;
      if (monthsNum[i].checked) {
        monthsAbbrev[i].disabled = false;
        monthsAbbrev[i].style.cursor = 'auto'
      }
      if (i == this.data.currentMonth) {
        months[i].checked = true;
      }
    }
    if (game.Gametime.DTNow().hours >= 12) {
      document.getElementById("calendar-form-ampm")[1].selected = "true";
    } else {
      document.getElementById("calendar-form-ampm")[0].selected = "true";
    }
  }

  renderForm(newData) {
    let templatePath = "modules/calendar-weather/templates/calendar-form.html";
    this.data = JSON.parse(newData);
    this.data["hours"] = (game.Gametime.DTNow().hours % 12) || 12;
    this.data["minutes"] = game.Gametime.DTNow().minutes;
    this.data["seconds"] = game.Gametime.DTNow().seconds;
    renderTemplate(templatePath, this.data).then(html => {
      this.render(true)
    }).then(this.checkBoxes());

    Hooks.callAll("calendarSettingsOpen");
  }
}

class Calendar extends Application {
  isOpen = false;
  clockIsRunning = true;
  eventsForm = new CalendarEvents();
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

  loadSettings() {
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
    templateData.dt.dayLength = data.default.dayLength;
    templateData.dt.timeDisp = data.default.timeDisp;
    templateData.dt.dateNum = data.default.dateNum;
    templateData.dt.weather = data.default.weather;
    templateData.dt.seasons = data.default.seasons;
    templateData.dt.reEvents = data.default.reEvents;
    templateData.dt.events = data.default.events;
    templateData.dt.checkEvents();
  }

  checkEventBoxes(){
    this.eventsForm.checkBoxes();
    return;
  }

  populateData() {
    let newMonth1 = new Month("Month 1", 30, true);
    templateData.dt.addMonth(newMonth1);
    templateData.dt.addWeekday("Monday");
    templateData.dt.addWeekday("Tuesday");
    templateData.dt.addWeekday("Wednesday");
    templateData.dt.addWeekday("Thursday");
    templateData.dt.setYear(2020);
    templateData.dt.setEra("AD");
    templateData.dt.setWeekday("Monday")
    templateData.dt.setDayLength(24);
    templateData.dt.genDateWordy();
    templateData.dt.weather.generate();
  }

  settingsOpen(isOpen) {
    this.isOpen = isOpen;
    if (isOpen) {
      game.Gametime.stopRunning();
      console.log("calendar-weather | Pausing real time clock.")
    } else {
      if (this.clockIsRunning) {
        game.Gametime.startRunning();
        console.log("calendar-weather | Resuming real time clock.")
      }
    }
  }

  rebuild(obj) {
    if (obj.months.length != 0) {
      templateData.dt.months = obj.months;
    }
    if (obj.daysOfTheWeek != []) {
      templateData.dt.daysOfTheWeek = obj.daysOfTheWeek;
    }
    if (obj.year != 0) {
      templateData.dt.year = obj.year;
    }
    if (obj.day != 0) {
      templateData.dt.day = obj.day;
    }
    templateData.dt.numDayOfTheWeek = obj.numDayOfTheWeek;
    templateData.dt.currentMonth = obj.currentMonth;
    if (obj.currentWeekday != "") {
      templateData.dt.currentWeekday = obj.currentWeekday;
    }
    if (obj.dateWordy != "") {
      templateData.dt.dateWordy = obj.dateWordy;
    }
    if (obj.era != "") {
      templateData.dt.era = obj.era;
    }
    if (obj.dayLength != 0) {
      templateData.dt.dayLength = obj.dayLength;
    }
    if (obj.dateNum != "") {
      templateData.dt.dateNum = obj.dateNum;
    }
    templateData.dt.setTimeDisp();
    templateData.dt.genDateWordy();
  }

  setEvents(data){
    data = JSON.parse(data);
    templateData.dt.seasons = data.seasons
    templateData.dt.reEvents = data.reEvents
    templateData.dt.events = data.events
  }

  updateSettings() {
    game.settings.update('calendar-weather.dateTime', {
      name: "Date/Time Data",
      scope: 'world',
      config: false,
      default: this.toObject(),
      type: Object,
    });
    game.Gametime._save(true);
  }

  updateDisplay() {
    document.getElementById("calendar-date").innerHTML = templateData.dt.dateWordy;
    document.getElementById("calendar-date-num").innerHTML = templateData.dt.dateNum;
    document.getElementById("calendar-weekday").innerHTML = templateData.dt.currentWeekday;
    templateData.dt.setTimeDisp();
    document.getElementById("calendar-time").innerHTML = templateData.dt.timeDisp;
    game.Gametime._save(true);
  }

  toObject() {
    return {
      months: templateData.dt.months,
      daysOfTheWeek: templateData.dt.daysOfTheWeek,
      year: templateData.dt.year,
      day: templateData.dt.day,
      numDayOfTheWeek: templateData.dt.numDayOfTheWeek,
      currentMonth: templateData.dt.currentMonth,
      currentWeekday: templateData.dt.currentWeekday,
      dateWordy: templateData.dt.dateWordy,
      era: templateData.dt.era,
      dayLength: templateData.dt.dayLength,
      timeDisp: templateData.dt.timeDisp,
      dateNum: templateData.dt.dateNum,
      weather: templateData.dt.weather,
      seasons: templateData.dt.seasons,
      reEvents: templateData.dt.reEvents,
      events: templateData.dt.events
    }
  }

  activateListeners(html) {
    const nextDay = '#calendar-btn-day';
    const quickAction = '#calendar-btn-quick';
    const calendarSetup = '#calendar-date';
    const calendarSetupOverlay = '#calendar-date-num'
    const longAction = '#calendar-btn-long';
    const nightSkip = '#calendar-btn-night';
    const sec = '#calendar-btn-sec';
    const halfMin = '#calendar-btn-halfMin';
    const min = '#calendar-btn-min';
    const fiveMin = '#calendar-btn-fiveMin';
    const toggleClock = '#calendar-time';
    const events = '#calendar-events';
    this.updateDisplay()
    let form = new CalendarForm(JSON.stringify(this.toObject()));
    //Next Morning
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log("calendar-weather | Advancing to 7am.");
        templateData.dt.advanceMorning();
        this.updateSettings();
      }
    });
    //Quick Action
    html.find(quickAction).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log("calendar-weather | Advancing 15 min.");
        templateData.dt.quickAction();
        this.updateSettings();
      }
    });
    //1 sec advance
    html.find(sec).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM && !this.clockIsRunning) {
        console.log("calendar-weather | Advancing 1 sec.");
        game.Gametime.advanceClock(1)
      }
    });
    //advance 30s
    html.find(halfMin).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM && !this.clockIsRunning) {
        console.log("calendar-weather | Advancing 30 sec");
        game.Gametime.advanceClock(30)
      }
    });
    //advance 1 min
    html.find(min).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log("calendar-weather | Advancing 1 min.");
        game.Gametime.advanceTime({
          minutes: 1
        })
      }
    });
    //advance 5 min
    html.find(fiveMin).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log("calendar-weather | Advancing 5 min.");
        game.Gametime.advanceTime({
          minutes: 5
        })
      }
    });
    //Long Action
    html.find(longAction).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log("calendar-weather | Advancing 1 hour.");
        templateData.dt.advanceHour();
        this.updateSettings();
      }
    });
    //To Midnight
    html.find(nightSkip).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log("calendar-weather | Advancing to midnight.");
        templateData.dt.advanceNight();
        this.updateSettings();
      }
    });
    //toggles real time clock on off, disabling granular controls
    html.find(toggleClock).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        if (this.clockIsRunning) {
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
    html.find(sec).mouseover(ev => {
      ev.preventDefault();
      if (!this.clockIsRunning) {
        document.getElementById('calendar-btn-sec').style.color = "#FFF"
      }
    });
    html.find(sec).mouseleave(ev => {
      ev.preventDefault();
      if (!this.clockIsRunning) {
        document.getElementById('calendar-btn-sec').style.color = "#000"
      }
    });
    html.find(halfMin).mouseover(ev => {
      ev.preventDefault();
      if (!this.clockIsRunning) {
        document.getElementById('calendar-btn-halfMin').style.color = "#FFF"
      }
    });
    html.find(halfMin).mouseleave(ev => {
      ev.preventDefault();
      if (!this.clockIsRunning) {
        document.getElementById('calendar-btn-halfMin').style.color = "#000"
      }
    });
    //Launch Calendar Form
    html.find(calendarSetup).click(ev => {
      ev.preventDefault();
      if (game.user.isGM) {
        form.renderForm(JSON.stringify(this.toObject()));
      }

    });
    html.find(calendarSetupOverlay).click(ev => {
      ev.preventDefault();
      if (game.user.isGM) {
        form.renderForm(JSON.stringify(this.toObject()));
      }
    });
    html.find(events).click(ev => {
      ev.preventDefault();
      if (game.user.isGM) {
        this.eventsForm.renderForm(JSON.stringify(this.toObject()));
      }
    })
  }
}

class Month {
  name = "";
  length = 0;
  isNumbered = true;
  abbrev = "";
  constructor(name = "", length = 0, isNumbered = true, abbrev = "") {
    this.name = name;
    this.length = length;
    this.isNumbered = isNumbered;
    this.abbrev = abbrev;
  }

  setAbbrev(abbrev) {
    this.abbrev = abbrev
  };
  getAbbrev() {
    return this.abbrev
  };
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

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  extremeWeather() {
    let roll = this.rand(1, 5);
    let event = "";
    if (this.isVolcanic) {
      return "Volcano Erupts!";
    }
    switch (roll) {
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
        if (this.temp <= 32) {
          event = "Extreme blizzard"
        } else {
          event = "Monsoon-like rainfall"
        }
        break;
    }
    return event;
  }

  setClimate(climate) {
    this.isVolcanic = false;
    switch (climate) {
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

  genPrecip(roll) {
    if (roll < 1) {
      roll = this.rand(1, 6);
    }
    if (roll <= 3) {
      if (this.isVolcanic) {
        return "Ashen skies today";
      }
      return "Clear sky today.";
    } else if (roll <= 6) {
      this.humidity += 1;
      if (this.isVolcanic) {
        return "Dark, smokey skies today";
      }
      return "Scattered clouds, but mostly clear today."
    } else if (roll == 7) {
      if (this.isVolcanic) {
        return "The sun is completely obscured by ash, possible ashfall today";
      }
      if (this.temp < 25) {
        return "Completely overcast with some snow flurries possible.";
      } else if (this.temp < 32) {
        return "Completely overcast with light freezing rain possible.";
      } else {
        return "Completely overcast; light drizzles possible.";
      }
    } else if (roll == 8) {
      this.humidity -= 1;
      if (this.isVolcanic) {
        return "Large ashfall today.";
      }
      if (this.temp < 25) {
        return "A light to moderate amount of snow today.";
      } else if (this.temp < 32) {
        return "Light to moderate freezing rain today.";
      } else {
        return "Light to moderate rain today.";
      }
    } else if (roll == 9) {
      this.humidity -= 2;
      if (this.isVolcanic) {
        return "Firey rain today, take cover.";
      }
      if (this.temp < 25) {
        return "Large amount of snowfall today.";
      } else if (this.temp < 32) {
        return "Large amount of freezing rain today.";
      } else {
        return "Heavy Rain today.";
      }
    } else if (roll >= 10) {
      if (this.rand(1, 20) == 20) {
        return this.extremeWeather();
      } else {
        this.humidity -= 2;
        if (this.isVolcanic) {
          return "Earthquake, firey rain, and toxic gases today.";
        }
        if (this.temp < 25) {
          return "Blizzard today.";
        } else if (this.temp < 32) {
          return "Icestorm today.";
        } else {
          return "Torrential rains today.";
        }
      }
    }
  }

  generate() {
    this.setClimate("volcanic")
    let roll = this.rand(1, 6) + this.humidity + this.climateHumidity;
    if (this.rand(1, 5) >= 5) {
      this.temp = this.rand(20, 60) + this.seasonTemp + this.climateTemp;
      this.lastTemp = this.temp;
    } else {
      this.temp = this.rand(this.lastTemp - 5, this.lastTemp + 5);
      this.lastTemp = this.temp;
    }
    this.precipitation = this.genPrecip(roll);
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
  dateWordy = "";
  era = "";
  timeDisp = "";
  dateNum = "";
  weather = new WeatherTracker();
  seasons = [];
  reEvents = [];
  events = [];

  addMonth(month) {
    this.months.push(month)
  };
  addWeekday(day) {
    this.daysOfTheWeek.push(day)
  };
  setYear(year) {
    this.year = year
  }
  setEra(era) {
    this.era = era
  }
  setDayLength(length) {
    this.dayLength = length
  }
  setWeekday(day) {
    this.currentWeekday = day
  }

  checkEvents(){
    // this.seasons
    let combinedDate = (this.months[this.currentMonth].abbrev) + "-" + this.day
    let reEvent = undefined;
    if(this.reEvents){
      reEvent = this.reEvents.find(fEvent => fEvent.date.combined == combinedDate)
    }

    if(reEvent){
      let chatOut = "<b>" + reEvent.name + "</b> - " + this.dateNum + "<hr>" + reEvent.text;
      ChatMessage.create({
        speaker: {
            alias: "Reoccuring Event:",
        },
        content: chatOut,
    });
    }
    // this.events.find()
  }

  getWeatherObj() {
    return {
      temp: this.weather.temp,
      humidity: this.weather.humidity,
      lastTemp: this.weather.lastTemp,
      seasonTemp: this.weather.seasonTemp,
      seasonHumidity: this.weather.seasonHumidity,
      climateTemp: this.weather.climateTemp,
      climateHumidity: this.weather.climateHumidity,
      precipitation: this.weather.precipitation
    }
  }

  genAbbrev() {
    let monthNum = 1;
    for (var i = 0, max = this.months.length; i < max; i++) {
      if (this.months[i].isNumbered) {
        this.months[i].abbrev = monthNum;
        monthNum += 1;
      }
    }
  }

  setTimeDisp() {
    let dt = game.Gametime.DTNow();
    let hours = dt.hours;
    let minutes = dt.minutes;
    let sec = dt.seconds;
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    hours = (hours % 12) || 12;
    this.timeDisp = hours + ":" + minutes + ":" + sec + " " + AmOrPm;
  }

  quickAction() {
    let dt = game.Gametime.DTNow();
    let prevDay = dt.days;
    let prevMonth = dt.months;
    game.Gametime.advanceTime({
      minutes: 15
    })
    dt = game.Gametime.DTNow();
    if (prevDay != dt.days || prevMonth != dt.months) {
      this.advanceDay();
    }
    this.setTimeDisp();
  }

  advanceHour() {
    let dt = game.Gametime.DTNow();
    let prevDay = dt.days;
    let prevMonth = dt.months;
    game.Gametime.advanceTime({
      hours: 1
    })
    dt = game.Gametime.DTNow();
    if (prevDay != dt.days || prevMonth != dt.months) {
      this.advanceDay();
    }
    this.setTimeDisp();
  }

  advanceNight() {
    this.advanceDay();
    game.Gametime.setTime({
      hours: 0
    });
    this.setTimeDisp();
  }

  advanceMorning() {
    this.advanceDay();
    game.Gametime.setTime({
      hours: 7
    });
    this.setTimeDisp();
  }

  genDateWordy() {
    let dayAppendage = "";
    if (this.day % 10 == 1 && this.day != 11) {
      dayAppendage = "st";
    } else if (this.day % 10 == 2 && this.day != 12) {
      dayAppendage = "nd";
    } else if (this.day % 10 == 3 && this.day != 13) {
      dayAppendage = "rd";
    } else {
      dayAppendage = "th";
    }
    this.dateWordy = this.day + dayAppendage + " of " +
      this.months[this.currentMonth].name + ", " + this.year + " " + this.era;

    this.dateNum = this.day + "/" + this.months[this.currentMonth].abbrev + "/" + this.year + " " + this.era;
  }

  advanceDay() {
    if (this.day == this.months[this.currentMonth].length) {
      this.day = 1;
      this.advanceMonth();
      if (this.daysOfTheWeek[this.numDayOfTheWeek + 1] == null) {
        this.numDayOfTheWeek = 0;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      } else {
        this.numDayOfTheWeek += 1;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      }
    } else {
      this.day += 1;
      if (this.daysOfTheWeek[this.numDayOfTheWeek + 1] == null) {
        this.numDayOfTheWeek = 0;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      } else {
        this.numDayOfTheWeek += 1;
        this.currentWeekday = this.daysOfTheWeek[this.numDayOfTheWeek];
      }
    }
    // this.weather.generate();
    // console.log(this.weather.temp + " " + this.weather.precipitation);
    this.genDateWordy();
    this.checkEvents();
  }

  advanceMonth() {
    let lookforward = parseInt(this.currentMonth) + 1;
    if (lookforward == this.months.length) {
      this.currentMonth = 0;
      this.year += 1;
    } else {
      this.currentMonth = parseInt(this.currentMonth) + 1;
    }
  }

}

$(document).ready(() => {
  const templatePath = "modules/calendar-weather/templates/calendar.html";

  templateData = {
    dt: new DateTime()
  }

  const GregorianCalendar = {
    "month_len": {
      "January": { days: [31, 31] },
      "February": { days: [28, 29] },
      "March": { days: [31, 31] },
      "April": { days: [30, 30] },
      "May": { days: [31, 31] },
      "June": { days: [30, 30] },
      "July": { days: [31, 31] },
      "August": { days: [31, 31] },
      "September": { days: [30, 30] },
      "October": { days: [31, 31] },
      "November": { days: [30, 30] },
      "December": { days: [31, 31] },
  },
  "leap_year_rule": (year) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400),
  "weekdays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "clock_start_year": 1970,
  "first_day": 0,
  "notes": {},
  "hours_per_day": 24,
  "seconds_per_minute": 60,
  "minutes_per_hour": 60,
  "has_year_0": false
};

  let c = new Calendar();
  // Init settings so they can be wrote to later
  Hooks.on('init', () => {
    c.populateData();
    game.settings.register('calendar-weather', 'dateTime', {
      name: "Date/Time Data",
      scope: 'world',
      config: false,
      default: c.toObject(),
      type: Object,
    });
    // game.settings.register('calendar-weather', 'clockRunning', {
    //   name: "clockRunning",
    //   scope: 'world',
    //   config: false,
    //   default: true,
    //   type: Boolean,
    // });
    c.loadSettings();
  });

  Hooks.on('renderCalendarEvents', ()=> {
    c.checkEventBoxes();
  })

  Hooks.on('calendarEventsClose', (newEvents) => {
    console.log("calendar-settings | Saving events.")
    c.settingsOpen(false);
    c.setEvents(newEvents);
  });

  Hooks.on('calendarSettingsOpen', () => {
    console.log("calendar-settings | Opening Calendar form.")
    c.settingsOpen(true);
  });

  Hooks.on('calendarSettingsClose', (updatedData) => {
    console.log("calendar-settings | Closing Calendar form.");
    c.rebuild(JSON.parse(updatedData));
    c.updateDisplay();
    c.updateSettings();
    c.settingsOpen(false);
  });

  Hooks.on('closeCalendarForm', () => {
    console.log("calendar-settings | Closing Calendar form");
    c.settingsOpen(false);

  });

  Hooks.on("pseudoclockSet", () => {
    if (document.getElementById('calendar-weather-container')) {
      c.updateDisplay();
    }
  })

  Hooks.on('ready', () => {
    renderTemplate(templatePath, templateData).then(html => {
      c.render(true);
    });
    // CONFIG.debug.hooks = true

    game.Gametime.DTC.createFromData(GregorianCalendar);
    game.Gametime.startRunning();
  });
});