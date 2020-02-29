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

    let seasonName = document.getElementsByClassName("calendar-season-name");
    let seasonMonth = document.getElementsByClassName("calendar-season-month-value");
    let seasonDay = document.getElementsByClassName("calendar-season-day");
    let seasonTemp = document.getElementsByClassName("calendar-season-temp");
    let seasonHumid = document.getElementsByClassName("calendar-season-humidity");
    let seasonColor = document.getElementsByClassName("calendar-season-color");
    let event = {};
    let day = 0;
    for (var i = 0, max = seasonName.length; i < max; i++) {
      if (seasonName[i].value == "") {
        event['name'] = "Season " + i
      } else {
        event['name'] =seasonName[i].value;
      }

      day = parseInt(seasonDay[i].selectedIndex) + 1
      event['date'] = {
        month: seasonMonth[i].options[seasonMonth[i].selectedIndex].value,
        day: day,
        combined: seasonMonth[i].options[seasonMonth[i].selectedIndex].value + '-' + day,
      };
      //temp
      event['temp'] = seasonTemp[i].options[seasonTemp[i].selectedIndex].value;
      //humid
      event['humidity'] = seasonHumid[i].options[seasonHumid[i].selectedIndex].value;
      //color
      event['color'] = seasonColor[i].options[seasonColor[i].selectedIndex].value;
      savedData.seasons.push(event);
      event = {};
    }

    let reEventName = document.getElementsByClassName("calendar-reEvent-name");
    let reEventMonth = document.getElementsByClassName("calendar-reEvent-month-value");
    let reEventDay = document.getElementsByClassName("calendar-reEvent-day");
    let reEventContent = document.getElementsByClassName("calendar-reEvent-text");
    event = {};
    day = 0;
    for (var i = 0, max = reEventName.length; i < max; i++) {
      if (reEventName[i].value == "") {
        event['name'] = "Event " + i
      } else {
        event['name'] = reEventName[i].value;
      }
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

    let eventName = document.getElementsByClassName("calendar-event-name");
    let eventContent = document.getElementsByClassName("calendar-event-content");
    let eventMonth = document.getElementsByClassName("calendar-event-month-value");
    let eventDay = document.getElementsByClassName("calendar-event-day");
    let eventYear = document.getElementsByClassName("calendar-event-year");
    let eventHours = document.getElementsByClassName("calendar-event-time-hours");
    let eventMin = document.getElementsByClassName("calendar-event-time-min");
    let eventSec = document.getElementsByClassName("calendar-event-time-sec");
    let ampm = document.getElementsByClassName("calendar-event-ampm");
    let allDay = document.getElementsByClassName("calendar-event-allDay");
    event = {};
    day = 0;

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    for (var i = 0, max = eventName.length; i < max; i++) {
      if (eventName[i].value == "") {
        event['name'] = "Event " + i
      } else {
        event['name'] = eventName[i].value;
      }
      day = parseInt(eventDay[i].selectedIndex) + 1

      hours = parseInt(eventHours[i].value)
      if (hours > 24 || hours < 0) {
        hours = 23;
      }
      if (ampm[i].value == "PM" && hours < 12) {
        hours = hours + 12;
      }
      if (ampm[i].value == "AM" && hours == 12) {
        hours = hours - 12;
      }
      minutes = parseInt(eventMin[i].value);
      if (minutes > 59 || minutes < 0) {
        minutes = 59;
      }
      seconds = parseInt(eventSec[i].value)
      if (seconds > 59 || seconds < 0) {
        seconds = 59
      }

      event['date'] = {
        month: eventMonth[i].options[eventMonth[i].selectedIndex].value,
        day: day,
        year: eventYear[i].value,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        combined: eventMonth[i].options[eventMonth[i].selectedIndex].value + '-' + day + '-' + eventYear[i].value,
      };
      event['text'] = eventContent[i].value;
      event['allDay'] = allDay[i].checked;

      savedData.events.push(event);
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
    //wait until form is loaded
    // await this.formLoaded('calendar-reEvent-' + (this.data.reEvents.length - 1));
    //get form data

    let names = document.getElementsByClassName("calendar-season-name");
    let days = document.getElementsByClassName("calendar-season-day");
    let months = document.getElementsByClassName("calendar-season-month-value");
    let temp = document.getElementsByClassName("calendar-season-temp");
    let humidity = document.getElementsByClassName("calendar-season-humidity");
    let color = document.getElementsByClassName("calendar-season-color");
    //init vars
    let length = 0;
    let event = undefined
    let numElements = this.data.seasons.length

    //loop through all events setting dropdowns to correct value
    for (var i = 0; i < numElements; i++) {
      //makes sure element exists at i
      if (names[i] && months[i]) {
        //gets event that matches element from data
        event = this.data.seasons.find(fEvent => fEvent.name == names[i].value);
        if (event) {
          for (var k = 0, max = temp[i].getElementsByTagName('option').length; k < max; k++) {
            if (temp[i].getElementsByTagName('option')[k].value == event.temp) {
              temp[i].getElementsByTagName('option')[k].selected = true;
            }
          }
          for (var k = 0, max = humidity[i].getElementsByTagName('option').length; k < max; k++) {
            if (humidity[i].getElementsByTagName('option')[k].value == event.humidity) {
              humidity[i].getElementsByTagName('option')[k].selected = true;
            }
          }
          for (var k = 0, max = color[i].getElementsByTagName('option').length; k < max; k++) {
            if (color[i].getElementsByTagName('option')[k].value == event.color) {
              color[i].getElementsByTagName('option')[k].selected = true;
            }
          }

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
          while (element.firstChild) {
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

    names = document.getElementsByClassName("calendar-reEvent-name");
    days = document.getElementsByClassName("calendar-reEvent-day");
    months = document.getElementsByClassName("calendar-reEvent-month-value");
    //init vars
    length = 0;
    event = undefined
    numElements = this.data.reEvents.length

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
          while (element.firstChild) {
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

    names = document.getElementsByClassName("calendar-event-name");
    days = document.getElementsByClassName("calendar-event-day");
    months = document.getElementsByClassName("calendar-event-month-value");
    let allDay = document.getElementsByClassName("calendar-event-allDay");
    let ampm = document.getElementsByClassName("calendar-event-ampm");
    let hours = document.getElementsByClassName("calendar-event-time-hours");
    //init vars
    length = 0;
    event = undefined
    numElements = this.data.events.length

    //loop through all events setting dropdowns to correct value
    for (var i = 0; i < numElements; i++) {
      //makes sure element exists at i
      if (names[i] && months[i]) {
        //gets event that matches element from data
        event = this.data.events.find(fEvent => fEvent.name == names[i].value);
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
          while (element.firstChild) {
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

          //check if the event is all day
          allDay[i].checked = event.allDay;

          if (event.date.hours >= 12) {
            ampm[i].getElementsByTagName('option')[1].selected = "true";
          } else {
            ampm[i].getElementsByTagName('option')[0].selected = "true";
          }
          hours[i].value = ((event.date.hours + 11) % 12 + 1);

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
    const addEvent = "#calendar-events-add-event";
    const delEvent = "button[class='calendar-event-del']";

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
        month: "1",
        day: 1,
      });
      this.render(true);
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
    });
    html.find(addEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      let dt = game.Gametime.DTNow();
      this.data.events.push({
        name: "",
        date: {
          month: this.data.months[this.data.currentMonth].abbrev,
          day: this.data.day,
          year: this.data.year,
          hours: dt.hours,
          minutes: dt.minutes,
          seconds: dt.seconds,
          combined: this.data.months[this.data.currentMonth].abbrev + "-" + this.data.day + "-" + this.data.year
        },
        allDay: false,
      });
      this.render(true);
    });
    html.find(delSeason).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.seasons.splice(index, 1);
      this.render(true);
    });
    html.find(delReEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.reEvents.splice(index, 1);
      this.render(true);
    });
    html.find(delEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.events.splice(index, 1);
      this.render(true);
    });
  }

  renderForm(newData) {
    this.data = Object.assign(this.data, JSON.parse(newData));
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
      hours = hours - 12;
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
          console.log("calendar-weather| Generating month abbrev")
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

class WeatherForm extends Application {
  isOpen = false;
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = "modules/calendar-weather/templates/calendar-weather.html";
    options.popOut = false;
    options.resizable = false;
    return options;
  }

  getData() {
    return this.data;
  }

  updateDisplay(){
    let units = " °F";
    if(this.data.isC){
      units = " °C"
      document.getElementById("calendar-weather-temp").innerHTML = this.data.cTemp;
    } else {
      document.getElementById("calendar-weather-temp").innerHTML = this.data.temp;
    }
    document.getElementById("calendar-weather-units").innerHTML = units;
    Hooks.callAll('calendarWeatherUpdateUnits', this.data.isC)
  }

  updateData(newData){
    this.data = newData;
  }

  activateListeners(html) {
    const toggleTemp = '#calendar-weather-temp';
    const regen = '#calendar-weather-precip'
    html.find(toggleTemp).click(ev => {
      ev.preventDefault();
      if (game.user.isGM) {
        this.data.isC = !this.data.isC;
        this.updateDisplay()
      }
    });
    html.find(regen).click(ev => {
      ev.preventDefault();
      if (game.user.isGM) {
        Hooks.callAll('calendarWeatherRegenerate');
      }
    });
  }

  toggleForm(newData) {
    let templatePath = "modules/calendar-weather/templates/calendar-weather.html";
    if(this.isOpen){
      this.isOpen = false;
      this.close();
    } else {
      this.isOpen = true;
      this.data = newData;
      renderTemplate(templatePath, this.data).then(html => {
        this.render(true);
      });
    }
  }
}

class Calendar extends Application {
  isOpen = false;
  showToPlayers = true;
  eventsForm = new CalendarEvents();
  weatherForm = new WeatherForm();
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

  getPlayerDisp() {
    return this.showToPlayers
  }

  loadSettings() {
    let data = game.settings.get('calendar-weather', 'dateTime');
    this.showToPlayers = game.settings.get('calendar-weather', 'calendarDisplay');
    templateData.dt.weather.showFX = game.settings.get('calendar-weather', 'fxDisplay')
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
    templateData.dt.weather.load(data.default.weather);
    templateData.dt.seasons = data.default.seasons;
    templateData.dt.reEvents = data.default.reEvents;
    templateData.dt.events = data.default.events;
    templateData.dt.isRunning = data.default.isRunning;
  }

  checkEventBoxes() {
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
  }

  settingsOpen(isOpen) {
    this.isOpen = isOpen;
    if (isOpen) {
      game.Gametime.stopRunning();
      console.log("calendar-weather | Pausing real time clock.")
    } else {
      if (templateData.dt.isRunning) {
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

  setEvents(data) {
    data = JSON.parse(data);
    templateData.dt.seasons = data.seasons
    templateData.dt.reEvents = data.reEvents
    templateData.dt.events = data.events
    templateData.dt.findSeasonEvents();
    // templateData.dt.checkEvents();
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

  isRunning(){
    return templateData.dt.isRunning;
  }

  updateDisplay() {
    document.getElementById("calendar-date").innerHTML = templateData.dt.dateWordy;
    document.getElementById("calendar-date-num").innerHTML = templateData.dt.dateNum;
    document.getElementById("calendar-weekday").innerHTML = templateData.dt.currentWeekday;
    templateData.dt.setTimeDisp();
    document.getElementById("calendar-time").innerHTML = templateData.dt.timeDisp;
    let temp = document.getElementById("calendar-weather-temp")
    if(temp){
      if(templateData.dt.weather.isC){
        temp.innerHTML = templateData.dt.getWeatherObj().cTemp;
      } else {
        temp.innerHTML = templateData.dt.getWeatherObj().temp;
      }
      document.getElementById("calendar-weather-precip").innerHTML = templateData.dt.getWeatherObj().precipitation
      let offset = document.getElementById("calendar").offsetWidth + 225
      document.getElementById("calendar-weather-container").style.left = offset + 'px'
      this.weatherForm.updateData(templateData.dt.getWeatherObj())
    }
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
      events: templateData.dt.events,
      isRunning: templateData.dt.isRunning,
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
    const weather = '#calendar-weather';
    this.updateDisplay()
    templateData.dt.checkEvents();
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
      if (!this.isOpen && game.user.isGM && !templateData.dt.isRunning) {
        console.log("calendar-weather | Advancing 1 sec.");
        game.Gametime.advanceClock(1)
      }
    });
    //advance 30s
    html.find(halfMin).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM && !templateData.dt.isRunning) {
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
        if (templateData.dt.isRunning) {
          console.log("calendar-weather | Stopping about-time pseudo clock.");
          templateData.dt.isRunning = false;
          game.Gametime.stopRunning();
          document.getElementById('calendar-btn-sec').disabled = false;
          document.getElementById('calendar-btn-halfMin').disabled = false;
          document.getElementById('calendar-btn-sec').style.cursor = 'pointer';
          document.getElementById('calendar-btn-halfMin').style.cursor = 'pointer';
          document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 1)";
          document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 1)";
        } else {
          console.log("calendar-weather | Starting about-time pseudo clock.");
          templateData.dt.isRunning = true;
          game.Gametime.startRunning();
          document.getElementById('calendar-btn-sec').disabled = true;
          document.getElementById('calendar-btn-halfMin').disabled = true;
          document.getElementById('calendar-btn-sec').style.cursor = 'not-allowed';
          document.getElementById('calendar-btn-halfMin').style.cursor = 'not-allowed';
          document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 0.5)";
          document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 0.5)";
        }
        this.updateSettings();
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
    html.find(weather).click(ev => {
      ev.preventDefault();
      if (game.user.isGM) {
        this.weatherForm.toggleForm(templateData.dt.getWeatherObj());
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
  season = "";
  seasonTemp = 0;
  seasonHumidity = 0;
  climate = "temperate";
  climateTemp = 0;
  climateHumidity = 0;
  precipitation = "";
  isVolcanic = false;
  outputToChat = true;
  showFX = true;
  isC = false;
  cTemp = 21.11

  load(newData){
    this.outputToChat = game.settings.get('calendar-weather', 'weatherDisplay');
    this.humidity = newData.humidity;
    this.temp = newData.temp;
    this.cTemp = newData.cTemp;
    this.lastTemp = newData.lastTemp;
    this.season = newData.season;
    this.seasonTemp = newData.seasonTemp;
    this.seasonHumidity = newData.seasonHumidity;
    this.climate = newData.climate;
    this.climateTemp = newData.climateTemp;
    this.climateHumidity = newData.climateHumidity;
    this.precipitation = newData.precipitation;
    this.isVolcanic = newData.isVolcanic;
    this.isC = newData.isC;
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  extremeWeather() {
    console.log("-------------------------EXTREME WEATHER")
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
    return "<b>Extreme Weather!</b> <hr>" + event;
  }

  setClimate(climate) {
    this.isVolcanic = false;
    switch (climate) {
      case "temperate":
        this.climateHumidity = 0;
        this.climateTemp = 0;
        this.climate = "temperate";
        this.generate(true)
        break;
      case "tempMountain":
        this.climateHumidity = 0;
        this.climateTemp = -10;
        this.climate = "tempMountain";
        this.generate(true)
        break;
      case "desert":
        this.climateHumidity = -1;
        this.climateTemp = 20;
        this.climate = "desert";
        this.generate(true)
        break;
      case "tundra":
        this.climateHumidity = 0;
        this.climateTemp = -20;
        this.climate = "tundra";
        this.generate(true)
        break;
      case "tropical":
        this.climateHumidity = 1;
        this.climateTemp = 10;
        this.climate = "tropical";
        this.generate(true)
        break;
      case "taiga":
        this.climateHumidity = -1;
        this.climateTemp = -20;
        this.climate = "taiga";
        this.generate(true)
        break;
      case "volcanic":
        this.climateHumidity = 0;
        this.climateTemp = 40;
        this.climate = "volcanic";
        this.isVolcanic = true;
        this.generate(true)
        break;
    }
  }

  genPrecip(roll) {
    let fxAvailable = false;
    let effects = undefined;
    if(this.showFX){
      if(game.modules.find(module => module.id === 'fxmaster')){
        fxAvailable = true;
      }
    }
    console.log()
    if (roll < 0) {
      roll = this.rand(1, 6);
    }
    if (roll <= 3) {
      if (this.isVolcanic) {
        return "Ashen skies today";
      }
      if(fxAvailable){
        effects = {
          type: 'Rain',
          config: {
            density:1,
            speed:1,
            scale:1,
            tint:1,
            direction:1,
            apply_tint:1,
          }
        }
        canvas.scene.setFlag("fxmaster", "effects", null).then(_ => {
          canvas.scene.setFlag("fxmaster", "effects", effects);
        });
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

  output(){
    let tempOut = "";
    if(this.isC){
      tempOut = this.cTemp + " °C";
    } else {
      tempOut = this.temp + " °F"
    }
    let messageLvl = ChatMessage.getWhisperIDs("GM")
    let chatOut = "<b>" + tempOut + "</b> - " + this.precipitation;
    ChatMessage.create({
      speaker: {
        alias: "Today's Weather:",
      },
      whisper: messageLvl,
      content: chatOut,
    });
  }

  generate(force = false) {
    let roll = this.rand(1, 6) + this.humidity + this.climateHumidity;
    if (force) {
      let temp = this.rand(this.lastTemp - 5, this.lastTemp + 5);
      this.temp = temp + this.seasonTemp + this.climateTemp;
      // console.log("Forced Roll: " + temp + " Season Mod: " + this.seasonTemp + " Climate Mod: " + this.climateTemp)
      this.lastTemp = this.temp;
    } else if(this.rand(1, 5) >= 5){
      let temp = this.rand(20, 60)
      // console.log("Fresh Roll: " + temp + " Season Mod: " + this.seasonTemp + " Climate Mod: " + this.climateTemp)
      this.temp = temp + this.seasonTemp + this.climateTemp;
      this.lastTemp = this.temp;
    }else {
      let temp = this.rand(this.lastTemp - 5, this.lastTemp + 5);
      this.temp = temp;
      // console.log("Roll: " + temp + " Season Mod: " + this.seasonTemp + " Climate Mod: " + this.climateTemp)
      this.lastTemp = this.temp;
    }
    this.cTemp = ((this.temp - 32) * 5/9).toFixed(2);
    this.precipitation = this.genPrecip(roll);
    if(this.outputToChat){
      this.output();
    }
  }

  setSeason(season){
    this.season = season.name;
    if(season.temp == "-") {
      this.seasonTemp = -10
    } else if (season.temp = "+") {
      this.seasonTemp = 10
    } else {
      this.seasonTemp = 0
    }
    if(season.humidity == "-") {
      this.seasonHumidity = -10
    } else if (season.humidity = "+") {
      this.seasonHumidity = 10
    } else {
      this.seasonHumidity = 0
    }
    let icon = document.getElementById('calendar-weather');
    switch(season.color){
      case 'red':
        icon.style.color = "#B12E2E"
        break;
      case 'orange':
        icon.style.color = "#B1692E"
        break;
      case 'yellow':
        icon.style.color = "#B99946"
        break;
      case 'green':
        icon.style.color = "#258E25"
        break;
      case 'blue':
        icon.style.color = "#5b80a5"
        break;
      case 'white':
        icon.style.color = "#CCC"
        break;
      default:
        icon.style.color = "#000"
        break
    }
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
  isRunning = true;

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

  load(newData){
    this.months = newData.months;
    this.daysOfTheWeek = newData.daysOfTheWeek;
    this.year = newData.year;
    this.day = newData.day;
    this.numDayOfTheWeek = newData.numDayOfTheWeek;
    this.currentMonth = newData.currentMonth;
    this.currentWeekday = newData.currentWeekday;
    this.dateWordy = newData.dateWordy;
    this.era = newData.era;
    this.timeDisp = newData.timeDisp;
    this.dateNum = newData.dateNum;
    this.weather.load(newData.weather);
    this.seasons = newData.seasons;
    this.reEvents = newData.reEvents;
    this.events = newData.events;
    this.isRunning = newData.isRunning;
  }

  findSeasonEvents(){
    let tempMonth = new DateTime();
    let flag = false;
    let index = 0;
    tempMonth.load(JSON.parse(JSON.stringify(this)))

    if(this.seasons.length == 1){
      this.weather.setSeason(this.seasons[0])
    } else {
      while(!flag){
        let combinedDate = (tempMonth.months[tempMonth.currentMonth].abbrev) + "-" + tempMonth.day
        for(var i = 0; i<this.seasons.length; i++){
          if(this.seasons[i].date.combined == combinedDate){
            flag = true;
            index = i;
          }
        }
        if(!flag){
          tempMonth.advanceDay(true);
        }
      }
      if(index - 1 < 0){
        this.weather.setSeason(this.seasons[this.seasons.length - 1])
      } else {
        this.weather.setSeason(this.seasons[index - 1])
      }
    }
    this.checkEvents();
  }

  checkEvents() {
    // this.seasons
    let messageLvl = ChatMessage.getWhisperIDs("GM")
    let combinedDate = (this.months[this.currentMonth].abbrev) + "-" + this.day
    if(this.seasons){
      let index = -1;
      for(var i = 0; i<this.seasons.length; i++){
        if(this.seasons[i].date.combined == combinedDate){
          index = i;
          break;
        }
      }
      if(index != -1){
        let event = this.seasons[index];
        this.weather.setSeason(event)
        let chatOut = "<b>" + event.name + "</b> - " + this.dateNum;
        ChatMessage.create({
          speaker: {
            alias: "Season Change:",
          },
          whisper: messageLvl,
          content: chatOut,
        });
      }
    }

    //Find reoccuring events
    let filtReEvents = [];
    if(this.reEvents){
      filtReEvents = this.reEvents.filter(function (event) {
        return event.date.combined == combinedDate;
      });
    }
    if (filtReEvents) {
      filtReEvents.forEach((event) => {
        let chatOut = "<b>" + event.name + "</b> - " + this.dateNum + "<hr>" + event.text;
        ChatMessage.create({
          speaker: {
            alias: "Reoccuring Event:",
          },
          whisper: messageLvl,
          content: chatOut,
        });
      })
    }

    combinedDate = (this.months[this.currentMonth].abbrev) + "-" + this.day + "-" + this.year
    let filtEvents = [];
    if(this.events){
      filtEvents = this.events.filter(function (event) {
        return event.date.combined == combinedDate;
      });
    }


    if (filtEvents) {
      filtEvents.forEach((event) => {
        if (event.allDay) {
          let chatOut = "<b>" + event.name + "</b> - " + this.dateNum + "<hr>" + event.text;
          ChatMessage.create({
            speaker: {
              alias: "Event:",
            },
            whisper: messageLvl,
            content: chatOut,
          });
        } else {

          let eventMessage = () => {
            let hours = event.date.hours;
            let minutes = event.date.minutes;
            let sec = event.date.seconds;
            let AmOrPm = hours >= 12 ? 'PM' : 'AM';
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            if (sec < 10) {
              sec = "0" + sec;
            }
            hours = (hours % 12) || 12;
            let timeOut = hours + ":" + minutes + ":" + sec + " " + AmOrPm;
            let chatOut = "<b>" + event.name + "</b> - " + this.dateNum + ", " +
              timeOut + "<hr>" + event.text;

            ChatMessage.create({
              speaker: {
                alias: "Event:",
              },
              whisper: messageLvl,
              content: chatOut,
            });
          }
          let dt = game.Gametime.DTNow()
          let time = game.Gametime.DMf({
            years: dt.years,
            days: dt.days,
            months: dt.months,
            hours: event.date.hours,
            minutes: event.date.minutes,
            seconds: event.date.seconds
          })
          game.Gametime.doAt(time, eventMessage)
        }
      })
      if(this.events){
        this.events = this.events.filter(function (event) {
          return event.date.combined != combinedDate;
        });
      }
    }
    // this.events.find()
  }

  getWeatherObj() {
    return {
      temp: this.weather.temp,
      cTemp: this.weather.cTemp,
      humidity: this.weather.humidity,
      lastTemp: this.weather.lastTemp,
      season: this.weather.season,
      seasonTemp: this.weather.seasonTemp,
      seasonHumidity: this.weather.seasonHumidity,
      climate: this.weather.climate,
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

  advanceDay(suppress = false) {
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
    if(!suppress){
      this.weather.generate();
      this.genDateWordy();
      this.checkEvents();
    }
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

class WarningSystem{
  constructor(){}

  static validateAboutTime(){
    let aboutTime = game.modules.find(module => module.id === 'about-time' && module.active);
    if(!aboutTime && game.user.isGM){
      return WarningSystem.generateDialog();
    }
  }

  static generateDialog(){
    new Dialog({
      title: "About Time is not found",
      content: "The Calendar/Weather mod requires AboutTime by Tim Posney in order to run properly.",
      buttons: {
        one: {
        icon: '<i class="fas fa-check"></i>',
        label: "Open the Gitlab page now",
        callback: () => window.open('https://gitlab.com/tposney/about-time/-/tree/master/src', '_blank',"fullscreen=no")
        },
        two: {
        icon: '<i class="fas fa-times"></i>',
        label: "Disregard this message",
        callback: () => {}
        }
      },
      default: "two",
      close: () => {}
      }).render(true);
  }
}


$(document).ready(() => {
  const templatePath = "modules/calendar-weather/templates/calendar.html";

  templateData = {
    dt: new DateTime()
  }

  const GregorianCalendar = {
    "month_len": {
      "January": {
        days: [31, 31]
      },
      "February": {
        days: [28, 29]
      },
      "March": {
        days: [31, 31]
      },
      "April": {
        days: [30, 30]
      },
      "May": {
        days: [31, 31]
      },
      "June": {
        days: [30, 30]
      },
      "July": {
        days: [31, 31]
      },
      "August": {
        days: [31, 31]
      },
      "September": {
        days: [30, 30]
      },
      "October": {
        days: [31, 31]
      },
      "November": {
        days: [30, 30]
      },
      "December": {
        days: [31, 31]
      },
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
    game.settings.register('calendar-weather', 'calendarDisplay', {
      name: "Calendar Display for Non-GM",
      hint: "If false, clients without GM-level permissions will not see the calendar displayed",
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    game.settings.register('calendar-weather', 'weatherDisplay', {
      name: "Output weather to chat?",
      hint: "If true, the weather will be output to chat, displayed only to GM level users.",
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    game.settings.register('calendar-weather', 'fxDisplay', {
      name: "Display Weather Effects? (Requires FXMaster)",
      hint: "If true, each time weather is generated it will activate a weather effect on the currently active scene.",
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    c.loadSettings();
  });

  Hooks.on('renderCalendarEvents', () => {
    c.checkEventBoxes();
    c.settingsOpen(true);
  })

  Hooks.on('calendarEventsClose', (newEvents) => {
    console.log("calendar-settings | Saving events.")
    c.settingsOpen(false);
    c.setEvents(newEvents);
    c.updateSettings();
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
    if (document.getElementById('calendar-time-container')) {
      c.updateDisplay();
    }
    if(c.isRunning()){
      game.Gametime.startRunning();
    } else {
      game.Gametime.stopRunning();
    }
  })
  Hooks.on("renderWeatherForm", ()=>{
    let offset = document.getElementById("calendar").offsetWidth + 225
    document.getElementById("calendar-weather-container").style.left = offset + 'px'  
    document.getElementById('calendar-weather-climate').value = templateData.dt.weather.climate;
  })

  Hooks.on("calendarWeatherUpdateUnits", (newUnits)=>{
    templateData.dt.weather.isC = newUnits;
    c.updateSettings()
  })

  Hooks.on("calendarWeatherRegenerate", ()=>{
    templateData.dt.weather.generate();
    c.updateDisplay();
    c.updateSettings();
  })
  
  Hooks.on('calendarWeatherClimateSet', (newClimate) => {
    console.log("calendar-weather | Setting climate: " + newClimate)
    templateData.dt.weather.setClimate(newClimate);
    c.updateDisplay();
    c.updateSettings();
  });

  Hooks.on("renderCalendar", ()=>{
    if (c.isRunning()) {
      game.Gametime.startRunning();
      document.getElementById('calendar-btn-sec').disabled = true;
      document.getElementById('calendar-btn-halfMin').disabled = true;
      document.getElementById('calendar-btn-sec').style.cursor = 'not-allowed';
      document.getElementById('calendar-btn-halfMin').style.cursor = 'not-allowed';
      document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 0.5)";
      document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 0.5)";
    } else {
      game.Gametime.stopRunning();
      document.getElementById('calendar-btn-sec').disabled = false;
      document.getElementById('calendar-btn-halfMin').disabled = false;
      document.getElementById('calendar-btn-sec').style.cursor = 'pointer';
      document.getElementById('calendar-btn-halfMin').style.cursor = 'pointer';
      document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 1)";
      document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 1)";
    }
  })

  Hooks.on('ready', () => {
    WarningSystem.validateAboutTime();
    if (!c.getPlayerDisp()) {
      if (game.user.isGM) {
        renderTemplate(templatePath, templateData).then(html => {
          c.render(true);
        });
      }
    } else {
      renderTemplate(templatePath, templateData).then(html => {
        c.render(true);
      });
    }
    game.Gametime.DTC.createFromData(GregorianCalendar);
  });
});