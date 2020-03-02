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
        event['name'] = seasonName[i].value;
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
          month: this.data.months[dt.months].abbrev,
          day: this.data.day + 1,

          year: this.data.year,
          hours: dt.hours,
          minutes: dt.minutes,
          seconds: dt.seconds,
          combined: this.data.months[dt.months].abbrev + "-" + this.data.day + "-" + this.data.year
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

    let reText =  html.find(".calendar-reEvent-text");
    for (let i = 0; i < reText.length; i++) reText[i].ondrop =  this.onDrop.bind(null, reText[i]);
    let evText =  html.find(".calendar-event-content");
    for (let i = 0; i < evText.length; i++) evText[i].ondrop =  this.onDrop.bind(null, evText[i]);
  }

  onDrop = (html, event) => {
    const collections = {JournalEntry: JournalEntry, Macro: Macro};
    try {
        let data = JSON.parse(event.dataTransfer.getData("text"));
        if (collections[data.type]) {
            event.preventDefault();
            let name = collections[data.type].collection.get(data.id).data.name;
            html.value = `@${data.type}[${data.id}]{${name}}`;
        }
      } catch(err) {
          console.log(event.dataTransfer.getData("text"));
          console.warn(err);
      }
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
    let now = game.Gametime.DTNow();
    this.data = {
      months: newData.months,
      daysOfTheWeek: newData.daysOfTheWeek,
      year: now.years,
      day: now.days+1,
      numDayOfTheWeek: now.dow(),
      currentMonth: now.months+1,
      currentWeekday: game.Gametime.DTC.weekDays[now.dow()],
      era: newData.era,
      hours: now.hours,
      minutes: now.minutes,
      seconds: now.seconds,
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

    let newMonthsName = document.getElementsByClassName("calendar-form-month-input");
    let newMonthsLength = document.getElementsByClassName("calendar-form-month-length-input");
    let newMonthsIsNum = document.getElementsByClassName("calendar-form-month-isnum");
    let newMonthsAbbrev = document.getElementsByClassName("calendar-form-month-abbrev");

    let newMonths = [];
    if (newMonthsName.length < 1) {
      savedData.addMonth(new Month("Month 1", 30, 30, true));
    }

    for (var i = 0; i < newMonthsName.length; i++) {
      let tempMonth = new Month("Month 1", 30, 30, true);

      if (newMonthsName[i].value == "") {
        tempMonth.name = "New Month"
      } else {
        tempMonth.name = newMonthsName[i].value;
      }
      tempMonth.length = newMonthsLength[i].value;
      // change this for leapYears
      tempMonth.leapLength = newMonthsLength[i].value;
      tempMonth.isNumbered = !newMonthsIsNum[i].checked;
      if (newMonthsIsNum[i].checked) {
        if (newMonthsAbbrev[i].value) {
          tempMonth.abbrev = newMonthsAbbrev[i].value;
        } else {
          console.log("calendar-weather| Generating month abbrev")
          tempMonth.abbrev = tempMonth.name.substring(0, 2).toUpperCase();
        }
      }
      newMonths.push(tempMonth);
    }
    savedData.months = newMonths;

    let weekDays = [];
    let newWeekdays = document.getElementsByClassName("calendar-form-weekday-input");
    for (var i = 0; i < newWeekdays.length; i++) {
      if (!newWeekdays[i].value) newWeekdays[i].value = "Weekday";
      weekDays.push(newWeekdays[i].value)
    }
    if (weekDays.length < 1) weekDays = ["Weekday"];
    savedData.daysOfTheWeek = weekDays;
 
    savedData.setDayLength(24);

    DateTime.updateDTC();

    let monthTarget = 0;
    if (document.querySelector('input[class="calendar-form-month-radio"]:checked') == null) {
      monthTarget = savedData.months.length - 1
    } else {
      monthTarget = document.querySelector('input[class="calendar-form-month-radio"]:checked').value;
    }
    monthTarget = Number(monthTarget);

    let day = parseInt(document.getElementById("calendar-form-cDay-input").value);
    if (savedData.months[monthTarget].length < day) {
      day = savedData.months[monthTarget].length;
    }
    day -= 1;

    Gametime.setAbsolute({years: year, months: monthTarget, days: day, hours: hours, minutes: minutes, seconds: seconds})

    let weekdayTarget = 0;
    if (document.querySelector('input[class="calendar-form-weekday-radio"]:checked') == null) {
      weekdayTarget = savedData.daysOfTheWeek.length - 1
    } else {
      weekdayTarget = document.querySelector('input[class="calendar-form-weekday-radio"]:checked').value;
    }
    savedData.numDayOfTheWeek = weekdayTarget;

    savedData.setTimeDisp();
    savedData.genAbbrev();
    let now = game.Gametime.DTNow();
    let returnData = {
      months: savedData.months,
      daysOfTheWeek: savedData.daysOfTheWeek,
      year: now.years,
      day: now.days,
      numDayOfTheWeek: now.dow(),
      currentMonth: now.months,
      currentWeekday: game.Gametime.DTC.weekDays[now.dow()],
      dateWordy: savedData.dateWordy,
      era: savedData.era,
      dayLength: game.Gametime.DTC.hpd,
      timeDisp: savedData.timeDisp,
      dateNum: savedData.dateNum,
      events: DateTime._events
    }

    console.log("calendar-weather | Building new calendar with the following object:", returnData)
    return JSON.stringify(returnData);
  }

  activateListeners(html) {
    const submit = '#calendar-form-submit';
    const addWeekday = '#calendar-form-add-weekday';
    const addMonth = '#calendar-form-add-month';
    const delWeekday = "button[class='calendar-form-weekday-del']";
    const delMonth = "button[class='calendar-form-month-del']"
    const loadDefault = "#calendar-form-load-default";
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
      let newMonth = new Month("", 30, 30, true);
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
    html.find(loadDefault).click(ev => {
      ev.preventDefault();
      let defaultCalendar = Object.keys(game.Gametime.calendars)[game.settings.get("about-time", "calendar")];
      new Dialog({
        title: "Choose Calendar",
        content: `<p>${defaultCalendar}</p>`,
        buttons: {
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: "Load",
            callback: async () => {
              DateTime.updateFromDTC(defaultCalendar);
              DateTime.updateDTC();
              this.data.months = DateTime._months;
              this.data.daysOfTheWeek = DateTime._daysOfTheWeek;
              await this.render(true);
              try {
                await this.checkBoxes();
              } catch(err) {}
            }
          },
          no: {
            icon: '<i class="fas fa-times"></i>',
            label: "Don't Load"
          }
        }
      }).render(true);
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
    let now = game.Gametime.DTNow();
    this.data.year =  now.years;
    this.data.day = now.days+1;
    this.data.numDayOfTheWeek = now.dow();
    this.data.currentMonth = now.months;
    this.data.currentWeekday = game.Gametime.DTC.weekDays[now.dow()];
    this.data.hours = ((now.hours + 11) % 12 + 1);
    this.data.minutes = now.minutes;
    this.data.seconds = now.seconds;
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
      weekdays[i].checked = i === this.data.numDayOfTheWeek;
    }

    console.log(duplicate(months));
    for (var i = 0, max = this.data.months.length; i < max; i++) {
      if (monthsNum[i]) {
        monthsNum[i].checked = !this.data.months[i].isNumbered;
        if (monthsNum[i].checked) {
          monthsAbbrev[i].disabled = false;
          monthsAbbrev[i].style.cursor = 'auto'
          monthsAbbrev[i].value = this.data.months[i].abbrev;
        }
      }
    }
    months[this.data.currentMonth].checked = true;

    if (game.Gametime.DTNow().hours >= 12) {
      document.getElementById("calendar-form-ampm")[1].selected = "true";
    } else {
      document.getElementById("calendar-form-ampm")[0].selected = "true";
    }
  }

  renderForm(newData) {
    let templatePath = "modules/calendar-weather/templates/calendar-form.html";
    this.data = JSON.parse(newData);
    let now = game.Gametime.DTNow();
    this.data["hours"] = (now.hours % 12) || 12;
    this.data["minutes"] = now.minutes;
    this.data["seconds"] = now.seconds;
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

  updateDisplay() {
    let units = " °F";
    if (this.data.isC) {
      units = " °C"
      document.getElementById("calendar-weather-temp").innerHTML = this.data.cTemp;
    } else {
      document.getElementById("calendar-weather-temp").innerHTML = this.data.temp;
    }
    document.getElementById("calendar-weather-units").innerHTML = units;
    Hooks.callAll('calendarWeatherUpdateUnits', this.data.isC)
  }

  updateData(newData) {
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
    if (this.isOpen) {
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

    if (!data || !data.months) {
      if (data.default) {
        console.log("calendar-weather | rebuilding data", data.default);
        // recover previous data
        templateData.dt = new DateTime();
        data.default.months = data.default.months.map(m=>{m.leapLength = m.length; return m});
        templateData.dt.months = data.default.months;
        templateData.dt.daysOfTheWeek = data.default.daysOfTheWeek;
        templateData.dt.setDayLength(data.default.dayLength);
        DateTime.updateDTC(); // set the calendar spec for correct date time calculations

        templateData.dt.era = data.default.era;
        templateData.dt.weather = templateData.dt.weather.load(data.default.weather);
        templateData.dt.seasons = data.default.seasons;
        templateData.dt.reEvents = data.default.reEvents;
        templateData.dt.events = data.default.events;
        console.log(data.default.events);
        console.log(templateData.dt.events);
        let timeout = game.settings.get("about-time", "election-timeout");
        setTimeout(function(){ 
          if (game.Gametime.isMaster()) {
            Gametime.setAbsolute({years: data.default.year, months: data.default.currentMonth, days: data.default.day-1, hours:0, minutes: 0, seconds:0})
            let now = Gametime.DTNow();
            templateData.dt.currentWeekday = templateData.dt.daysOfTheWeek[now.dow()];
            templateData.dt.timeDisp = now.shortDate().time;
          }
        }, timeout * 1000 + 100);

      } else {
        this.populateData();
        let timeout = game.settings.get("about-time", "election-timeout");
        setTimeout(() => { 
          if (game.Gametime.isMaster()) {
              Gametime.setAbsolute({years: data.default.year, months: data.default.currentMonth, days: data.default.day-1, hours:0, minutes: 0, seconds:0})
          }
        }, timeout * 1000 + 100);

      }
    } else {
      let now = Gametime.DTNow();
      templateData.dt = new DateTime();
      templateData.dt.months = data.months;
      templateData.dt.daysOfTheWeek = data.daysOfTheWeek;
      templateData.dt.setDayLength(data.dayLength);
      DateTime.updateDTC(); // set the calendar spec for correct date time calculations
      templateData.dt.currentWeekday = templateData.dt.daysOfTheWeek[now.dow()];
      templateData.dt.era = data.era;
      templateData.dt.dayLength = Gametime.DTC.hpd;
      templateData.dt.timeDisp = now.shortDate().time;
      templateData.dt.weather = templateData.dt.weather.load(data.weather);
      templateData.dt.seasons = data.seasons;
      templateData.dt.reEvents = data.reEvents;
      templateData.dt.events = data.events;
    }
  }

  checkEventBoxes() {
    this.eventsForm.checkBoxes();
    return;
  }

  populateData() {
    let newMonth1 = new Month("Month 1", 30, 30, true);
    templateData.dt.addMonth(newMonth1);
    templateData.dt.addWeekday("Monday");
    templateData.dt.addWeekday("Tuesday");
    templateData.dt.addWeekday("Wednesday");
    templateData.dt.addWeekday("Thursday");
    templateData.dt.setYear(2020);
    templateData.dt.setEra("AD");
    templateData.dt.numDayOfTheWeek = 0
    templateData.dt.setDayLength(24);
    templateData.dt.genDateWordy();
  }

  settingsOpen(isOpen) {
    this.isOpen = isOpen;
    if (isOpen) {
      game.Gametime.stopRunning();
      console.log("calendar-weather | Pausing real time clock.")
    } else {
        game.Gametime.startRunning();
        console.log("calendar-weather | Resuming real time clock.")
    }
  }


  rebuild(obj) {
    templateData.dt = new DateTime();
    if (obj.months.length != 0) {
      templateData.dt.months = obj.months;
    }
    if (obj.daysOfTheWeek != []) {
      templateData.dt.daysOfTheWeek = obj.daysOfTheWeek;
    }
    let now = Gametime.DTNow();
    if (obj.dayLength != 0) {
      templateData.dt.dayLength = obj.dayLength;
    }
    let years = obj.year !== 0 ? obj.year : now.years;
    let months = obj.currentMonth;
    let days = obj.day !== 0 ? obj.day : now.days;
    Gametime.setAbsolute(now.setAbsolute({years, months, days}));
    templateData.dt.numDayOfTheWeek = obj.numDayOfTheWeek;

    if (obj.dateWordy != "") {
      templateData.dt.dateWordy = obj.dateWordy;
    }
    if (obj.era != "") {
      templateData.dt.era = obj.era;
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
    templateData.dt.checkEvents();
  }

  updateSettings() {
    game.settings.set("calendar-weather", "dateTime", this.toObject());
    game.Gametime._save(true);
  }

  updateDisplay() {
    let now = game.Gametime.DTNow();
    if(templateData.dt.dateWordy == ""){
      document.getElementById("calendar-date").innerHTML = "Calendar Loading...";
    } else {
      document.getElementById("calendar-date").innerHTML = templateData.dt.dateWordy;
    }
    document.getElementById("calendar-date-num").innerHTML = templateData.dt.dateNum;
    document.getElementById("calendar-weekday").innerHTML = Gametime.DTC.weekDays[now.dow()];
    templateData.dt.setTimeDisp();
    document.getElementById("calendar-time").innerHTML = templateData.dt.timeDisp;
    let temp = document.getElementById("calendar-weather-temp")
    if (temp) {
      if (templateData.dt.weather.isC) {
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
    const weather = '#calendar-weather';
    this.updateDisplay()
    templateData.dt.checkEvents();
    let form = new CalendarForm(JSON.stringify(this.toObject()));
    //Next Morning
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && Gametime.isMaster()) {
        console.log("calendar-weather | Advancing to 7am.");
        templateData.dt.advanceMorning();
        this.updateSettings();
      }
    });
    //Quick Action
    html.find(quickAction).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && Gametime.isMaster()) {
        console.log("calendar-weather | Advancing 15 min.");
        templateData.dt.quickAction();
        this.updateSettings();
      }
    });
    //1 sec advance
    html.find(sec).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.Gametime.isMaster() && !Gametime.isRunning()) {
        console.log("calendar-weather | Advancing 1 sec.");
        game.Gametime.advanceClock(1)
      }
    });
    //advance 30s
    html.find(halfMin).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.Gametime.isMaster() && !Gametime.isRunning()) {
        console.log("calendar-weather | Advancing 30 sec");
        game.Gametime.advanceClock(30)
      }
    });
    //advance 1 min
    html.find(min).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.Gametime.isMaster()) {
        console.log("calendar-weather | Advancing 1 min.");
        game.Gametime.advanceTime({
          minutes: 1
        })
      }
    });
    //advance 5 min
    html.find(fiveMin).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.Gametime.isMaster()) {
        console.log("calendar-weather | Advancing 5 min.");
        game.Gametime.advanceTime({
          minutes: 5
        })
      }
    });
    //Long Action
    html.find(longAction).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.Gametime.isMaster()) {
        console.log("calendar-weather | Advancing 1 hour.");
        templateData.dt.advanceHour();
        this.updateSettings();
      }
    });
    //To Midnight
    html.find(nightSkip).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.Gametime.isMaster()) {
        console.log("calendar-weather | Advancing to midnight.");
        templateData.dt.advanceNight();
        this.updateSettings();
      }
    });
    //toggles real time clock on off, disabling granular controls
    html.find(toggleClock).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.Gametime.isMaster()) {
        if (Gametime.isRunning()) {
          console.log("calendar-weather | Stopping about-time pseudo clock.");
          game.Gametime.stopRunning();

          document.getElementById('calendar-btn-sec').disabled = false;
          document.getElementById('calendar-btn-halfMin').disabled = false;
          document.getElementById('calendar-btn-sec').style.cursor = 'pointer';
          document.getElementById('calendar-btn-halfMin').style.cursor = 'pointer';
          document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 1)";
          document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 1)";
        } else {
          console.log("calendar-weather | Starting about-time pseudo clock.");
          Gametime.startRunning();
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
      if (!Gametime.isRunning()) {
        document.getElementById('calendar-btn-sec').style.color = "#FFF"
      }
    });
    html.find(sec).mouseleave(ev => {
      ev.preventDefault();
      if (!Gametime.isRunning()) {
        document.getElementById('calendar-btn-sec').style.color = "#000"
      }
    });
    html.find(halfMin).mouseover(ev => {
      ev.preventDefault();
      if (!Gametime.isRunning()) {
        document.getElementById('calendar-btn-halfMin').style.color = "#FFF"
      }
    });
    html.find(halfMin).mouseleave(ev => {
      ev.preventDefault();
      if (!Gametime.isRunning()) {
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
  leapLength = 0;
  isNumbered = true;
  abbrev = "";
  constructor(name = "", length = 0, leapLength = 0, isNumbered = true, abbrev = "") {
    this.name = name;
    this.length = Number(length);
    this.leapLength = Number(leapLength) || 1;
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
  seasonColor = "";
  seasonTemp = 0;
  seasonHumidity = 0;
  climate = "temperate";
  climateTemp = 0;
  climateHumidity = 0;
  precipitation = "";
  isVolcanic = false;
  outputToChat = true;
  showFX = false;
  isC = false;
  cTemp = 21.11

  load(newData) {
    this.outputToChat = game.settings.get('calendar-weather', 'weatherDisplay');
    this.humidity = newData.humidity;
    this.temp = newData.temp;
    this.cTemp = newData.cTemp;
    this.lastTemp = newData.lastTemp;
    this.season = newData.season;
    this.seasonColor = newData.seasonColor
    this.seasonTemp = newData.seasonTemp;
    this.seasonHumidity = newData.seasonHumidity;
    this.climate = newData.climate;
    this.climateTemp = newData.climateTemp;
    this.climateHumidity = newData.climateHumidity;
    this.precipitation = newData.precipitation;
    this.isVolcanic = newData.isVolcanic;
    this.isC = newData.isC;
    return this;
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
    let weather = "";
    let effects = [];
    if (this.showFX && game.modules.find(module => module.id === 'fxmaster')) {
      fxAvailable = true;
    }
    if (roll < 0) {
      roll = this.rand(1, 6);
    }
    if (roll <= 3) {
      if (this.isVolcanic) {
        weather = "Ashen skies today";
      } else {
        weather = "Clear sky today.";
      }
    } else if (roll <= 6) {
      this.humidity += 1;
      if (this.isVolcanic) {
        effects.push({
          "darkcloudsID": {
            type: 'clouds',
            config: {
              density: "4",
              speed: "29",
              scale: "20",
              tint: "#4a4a4a",
              direction: "50",
              apply_tint: true
            }
          }
        })
        weather = "Dark, smokey skies today";
      } else {
        effects.push({
          "lightcloudsID": {
            type: 'clouds',
            config: {
              density: "4",
              speed: "29",
              scale: "20",
              tint: "#bcbcbc",
              direction: "50",
              apply_tint: true
            }
          }
        })
        weather = "Scattered clouds, but mostly clear today."
      }
    } else if (roll == 7) {
      if (this.isVolcanic) {
        weather = "The sun is completely obscured by ash, possible ashfall today";
      } else {
        if (this.temp < 25) {
          effects.push({
            "lightcloudsID": {
              type: 'clouds',
              config: {
                density: "4",
                speed: "29",
                scale: "20",
                tint: "#bcbcbc",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "snowID": {
              type: 'snow',
              config: {
                density: "8",
                speed: "50",
                scale: "30",
                tint: "#ffffff",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Completely overcast with some snow flurries possible.";
        } else if (this.temp < 32) {
          effects.push({
            "lightcloudsID": {
              type: 'clouds',
              config: {
                density: "40",
                speed: "29",
                scale: "20",
                tint: "#bcbcbc",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "lightrainID": {
              type: 'rain',
              config: {
                density: "8",
                speed: "50",
                scale: "15",
                tint: "#acd2cd",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "lightsnowID": {
              type: 'snow',
              config: {
                density: "8",
                speed: "50",
                scale: "15",
                tint: "#ffffff",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Completely overcast with light freezing rain possible.";
        } else {
          console.log(effects)
          effects.push({
            "lightcloudsID": {
              type: 'clouds',
              config: {
                density: "40",
                speed: "29",
                scale: "20",
                tint: "#bcbcbc",
                direction: "50",
                apply_tint: true
              }
            }
          })
          console.log(effects)
          effects.push({
            "lightrainID": {
              type: 'rain',
              config: {
                density: "40",
                speed: "50",
                scale: "30",
                tint: "#acd2cd",
                direction: "50",
                apply_tint: true
              }
            }
          })
          console.log(effects)
          weather = "Completely overcast; light drizzles possible.";
        }
      }
    } else if (roll == 8) {
      this.humidity -= 1;
      if (this.isVolcanic) {
        effects.push({
          "lightsnowID": {
            type: 'snow',
            config: {
              density: "50",
              speed: "50",
              scale: "50",
              tint: "#000000",
              direction: "50",
              apply_tint: true
            }
          }
        })
        effects.push({
          "embersID": {
            type: 'embers',
            config: {
              density: "50",
              speed: "50",
              scale: "50",
              tint: "#ff1c1c",
              direction: "50",
              apply_tint: true
            }
          }
        })
        weather = "Large ashfall today.";
      } else {
        if (this.temp < 25) {
          effects.push({
            "lightsnowID": {
              type: 'snow',
              config: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#ffffff",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "A light to moderate amount of snow today.";
        } else if (this.temp < 32) {
          effects.push({
            "lightsnowID": {
              type: 'snow',
              config: {
                density: "25",
                speed: "50",
                scale: "25",
                tint: "#ffffff",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "lightRainID": {
              type: 'rain',
              config: {
                density: "25",
                speed: "50",
                scale: "50",
                tint: "#acd2cd",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Light to moderate freezing rain today.";
        } else {
          effects.push({
            "lightRainID": {
              type: 'rain',
              config: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#acd2cd",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Light to moderate rain today.";
        }
      }

    } else if (roll == 9) {
      this.humidity -= 2;
      if (this.isVolcanic) {
        effects.push({
          "lightsnowID": {
            type: 'rain',
            config: {
              density: "72",
              speed: "50",
              scale: "67",
              tint: "#ff8040",
              direction: "50",
              apply_tint: true
            }
          }
        })
        effects.push({
          "embers": {
            type: 'embers',
            config: {
              density: "50",
              speed: "50",
              scale: "50",
              tint: "#ff1c1c",
              direction: "50",
              apply_tint: true
            }
          }
        })
        weather = "Firey rain today, take cover.";
      } else {
        if (this.temp < 25) {
          effects.push({
            "lightsnowID": {
              type: 'snow',
              config: {
                density: "72",
                speed: "50",
                scale: "67",
                tint: "#ffffff",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Large amount of snowfall today.";
        } else if (this.temp < 32) {
          effects.push({
            "lightsnowID": {
              type: 'snow',
              config: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#ffffff",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "lightRainID": {
              type: 'rain',
              config: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#acd2cd",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Large amount of freezing rain today.";
        } else {
          effects.push({
            "lightsnowID": {
              type: 'rain',
              config: {
                density: "72",
                speed: "50",
                scale: "67",
                tint: "#acd2cd",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Heavy Rain today.";
        }
      }

    } else if (roll >= 10) {
      this.humidity -= 2;
      if (this.rand(1, 20) == 20) {
        weather = this.extremeWeather();
      } else {
        if (this.isVolcanic) {
          effects.push({
            "lightsnowID": {
              type: 'rain',
              config: {
                density: "100",
                speed: "75",
                scale: "100",
                tint: "#ff8040",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "embers": {
              type: 'embers',
              config: {
                density: "100",
                speed: "50",
                scale: "100",
                tint: "#ff1c1c",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "lightsnowID": {
              type: 'snow',
              config: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#ffffff",
                direction: "50",
                apply_tint: true
              }
            }
          })
          effects.push({
            "clouds": {
              type: 'clouds',
              config: {
                density: "50",
                speed: "8",
                scale: "50",
                tint: "#d2e8ce",
                direction: "50",
                apply_tint: true
              }
            }
          })
          weather = "Earthquake, firey rain, and toxic gases today.";
        } else {
          if (this.temp < 25) {
            effects.push({
              "lightsnowID": {
                type: 'snow',
                config: {
                  density: "100",
                  speed: "75",
                  scale: "100",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
              }
            })
            effects.push({
              "snow2": {
                type: 'snow',
                config: {
                  density: "100",
                  speed: "75",
                  scale: "100",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
              }
            })
            weather = "Blizzard today.";
          } else if (this.temp < 32) {
            effects.push({
              "lightsnowID": {
                type: 'snow',
                config: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
              }
            })
            effects.push({
              "rain": {
                type: 'rain',
                config: {
                  density: "83",
                  speed: "17",
                  scale: "100",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
              }
            })
            weather = "Icestorm today.";
          } else {
            effects.push({
              "lightsnowID": {
                type: 'rain',
                config: {
                  density: "100",
                  speed: "75",
                  scale: "100",
                  tint: "#acd2cd",
                  direction: "50",
                  apply_tint: true
                }
              }
            })
            effects.push({
              "rain": {
                type: 'rain',
                config: {
                  density: "100",
                  speed: "75",
                  scale: "100",
                  tint: "#acd2cd",
                  direction: "50",
                  apply_tint: true
                }
              }
            })
            weather = "Torrential rains today.";
          }
        }

      }
    }
    if(fxAvailable){
        canvas.scene.setFlag("fxmaster", "effects", null).then(_ => {
        if(effects){
          effects.forEach((effect) => {
            canvas.scene.setFlag("fxmaster", "effects", effect);
          })
        }
      });
    }
    return weather;
  }

  output() {
    let tempOut = "";
    if (this.isC) {
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
    } else if (this.rand(1, 5) >= 5) {
      let temp = this.rand(20, 60)
      // console.log("Fresh Roll: " + temp + " Season Mod: " + this.seasonTemp + " Climate Mod: " + this.climateTemp)
      this.temp = temp + this.seasonTemp + this.climateTemp;
      this.lastTemp = this.temp;
    } else {
      let temp = this.rand(this.lastTemp - 5, this.lastTemp + 5);
      this.temp = temp;
      // console.log("Roll: " + temp + " Season Mod: " + this.seasonTemp + " Climate Mod: " + this.climateTemp)
      this.lastTemp = this.temp;
    }
    this.cTemp = ((this.temp - 32) * 5 / 9).toFixed(2);
    this.precipitation = this.genPrecip(roll);
    if (this.outputToChat) {
      this.output();
    }
  }

  setSeason(season) {
    this.season = season.name;
    if (season.temp == "-") {
      this.seasonTemp = -10
    } else if (season.temp = "+") {
      this.seasonTemp = 10
    } else {
      this.seasonTemp = 0
    }
    if (season.humidity == "-") {
      this.seasonHumidity = -10
    } else if (season.humidity = "+") {
      this.seasonHumidity = 10
    } else {
      this.seasonHumidity = 0
    }
    let icon = document.getElementById('calendar-weather');
    switch (season.color) {
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
    this.seasonColor = season.color;
  }
}

class DateTime {
  static myCalendarSpec = {
    "leap_year_rule": (year) => 0,
    "clock_start_year": 0,
    "first_day": 0,
    "notes": {},
    "hours_per_day": 24,
    "seconds_per_minute": 60,
    "minutes_per_hour": 60,
    "has_year_0": true,
    "month_len": {},
    "weekdays": []
  };

  static updateDTC() { // update the calendar spec so that about-time will know the new calendar
    Gametime.DTC.createFromData(DateTime.myCalendarSpec)
  }

  static updateFromDTC(calendarName) {
    let calSpec = duplicate(game.Gametime.calendars[calendarName]);
    if (calSpec) {
      DateTime.myCalendarSpec = calSpec;
      DateTime.myCalendarSpec.leap_year_rule = game.Gametime.calendars[calendarName].leap_year_rule;
      // Remove this when leap years are supported in this module
      DateTime.myCalendarSpec.leap_year_rule = (year) => 0;
      this._months = Object.keys(calSpec.month_len).map((k, i) => {
        let m = calSpec.month_len[k];
        return new Month(k, m.days[0],  m.days[1], !m.intercalary, m.intercalary ? "XX" : `${i+1}`)
      })
      this._daysOfTheWeek = calSpec.weekdays;
      game.Gametime.DTC.createFromData(DateTime.myCalendarSpec);
    }

  }
  static _months = [];
  static _daysOfTheWeek = [];
  _year = 0;
  _dateWordy = "";
  _era = "";
  timeDisp = "";
  _dateNum = "";
  static _weather = new WeatherTracker();
  static _seasons = [];
  static _reEvents = [];
  static _events = [];

  get reEvents() {return DateTime._reEvents};
  set reEvents(reEvents) {DateTime._reEvents = reEvents};

  get events() {return DateTime._events};
  set events(events) {DateTime._events = events};

  get seasons() {return DateTime._seasons};
  set seasons(seasons) {DateTime._seasons = seasons};

  get weather() {return DateTime._weather}
  set weather(weather) {DateTime._weather = weather}

  get seasons() {
    return DateTime._seasons
  };
  set seasons(seasons) {
    DateTime._seasons = seasons
  };

  get weather() {
    return DateTime._weather
  }
  set weather(weather) {
    DateTime._weather = weather
  }

  get year() {
    return Gametime.DTNow().years;
  }
  get day() {
    return Gametime.DTNow().days
  }


  get dateWordy() {return this._dateWordy;}
  set dateWordy(dateWordy) {this._dateWordy = dateWordy;}

  set months(months) {
    DateTime.myCalendarSpec.month_len = {};
    months.forEach(m => DateTime.myCalendarSpec.month_len[m.name] = {"days": [Number(m.length), Number(m.leapLength)], "intercalary": !m.isNumbered})
    DateTime._months = months;
  }
  get months() { return DateTime._months}

  set daysOfTheWeek(days) {
    DateTime.myCalendarSpec.weekdays = days;
    DateTime._daysOfTheWeek = days;
  }
  get daysOfTheWeek() { 
    return DateTime._daysOfTheWeek}



  set year(y) {
    this.setYear(y)
  }

  get currentWeekDay () {
    return Gametime.weekDays[Gametime.DTNow().dow()];
  }
  
  addMonth(month) {
    this._months.push(month);
    DateTime.myCalendarSpec.month_len[month.name]={days:[Number(month.length), Number(month.leapLength)]};
    // Gametime.DTC.createFromData(DateTime.myCalendarSpec);
  };

  addWeekday(day) {
    DateTime.myCalendarSpec.weekdays.push(day);
    this._daysOfTheWeek.push(day);
    // Gametime.DTC.createFromData(DateTime.myCalendarSpec);
  };

  setYear(year) {
    Gametime.setAbsolute(Gametime.DTNow().setAbsolute({years: Number(year)}));
    this._year = year
  }

  get currentMonth() {return Gametime.DTNow().months}
  set currentMonth(currentMonth) {Gametime.setAbsolute(Gametime.DTNow().setAbsolute({months: Number(currentMonth)}))}

  set era(era) {this._era = era}
  get era() {return this._era}
  setEra(era) {this._era = era}

  setDayLength(length) {
    DateTime.myCalendarSpec.hours_per_day = length;
  }
  
  set numDayOfTheWeek(dow) {game.Gametime.DTNow().setCalDow(dow)}
  get numDayOfTheWeek() {return Gametime.DTNow().dow()}

  get dateNum() { return this._datenum}
  set dateNum(dateNum) {this._datenum = dateNum};

  get weekday() { return this._daysOfTheWeek[this.numDayOfTheWeek]}
  set weekday(day) {
    let newDow = this._daysOfTheWeek.indexOf(day);
    if (newDow != -1) this.numDayOfTheWeek = newDow;
  }

  getEntity(text, collection, matchRe) {
    if (text && text.startsWith("@")) {
      let macroMatch = text.match(matchRe);
      if (macroMatch && macroMatch.length === 2) {
        // match by id
        let entity = collection.get(macroMatch[1])
        // if no match search by name
        if (!entity) entity = collection.entities.find(m=>m.name === macroMatch[1]);
        return entity;
      }
    }
    return null;
  }

findSeason(dateTime){
  let targetDay = dateTime.days + 1;
  let targetMonth = dateTime.months;

  let abbrevs = this.months.map(m=>""+m.abbrev); // need text abbreviations here so they can be looked up

  // find the first season after today (if there is one) and set the current season to the one before that or the last season if nothing matched.
  let season = this.seasons.find(s=>{let smn = abbrevs.indexOf(s.date.month); return smn > targetMonth || (smn === targetMonth && s.date.day > targetDay)});
  let index = season ? ((this.seasons.indexOf(season) - 1  + this.seasons.length) % this.seasons.length) : this.seasons.length - 1;

  return this.seasons[index];
}

checkEvents() {
  if (!Gametime.isMaster()) return;

  let currentMonth = this.currentMonth;
  let combinedDate = (this.months[currentMonth].abbrev) + "-" + (this.day + 1);

  // seasons
  let newSeason = this.findSeason(Gametime.DTNow());
  if (newSeason && this.weather.season !== newSeason.name) {
    // season change
    this.weather.setSeason(newSeason)
    let chatOut = "<b>" + newSeason.name + "</b> - " + this.dateNum;
    ChatMessage.create({
      speaker: {
        alias: "Season Change:",
      },
      whisper: ChatMessage.getWhisperIDs("GM"),
      content: chatOut,
    });
  }

  //Find reoccuring events
  const macroRe = /\@Macro\[(.*)\].*/;
  const journalRe = /\@\@JournalEntry\[(.*)\].*/

  let filtReEvents = this.reEvents.filter(event => event.date.combined === combinedDate);
  filtReEvents.forEach((event) => {
    let macro = this.getEntity(event.text, game.macros, macroRe);
    if (macro) {
      macro.execute();
    } else {
      let journal = this.getEntity(event.text, game.journal, journalRe);
      let chatOut = "<b>" + event.name + "</b> - " + this.dateNum + "<hr>" + (journal ? journal.data.content : event.text);
      ChatMessage.create({
        speaker: {
          alias: "Reoccuring Event:",
        },
        whisper: ChatMessage.getWhisperIDs("GM"),
        content: chatOut,
      });
    }
  })

  combinedDate += "-" + this.year
  let filtEvents = this.events.filter(event => event.date.combined === combinedDate);
  this.events = this.events.filter(event => event.date.combined !== combinedDate)

  filtEvents.forEach((event) => {
    let dt = game.Gametime.DTNow();
    let timeOut = "";
    if (event.allDay) {
      dt = dt.setAbsolute({hours: 0, minutes: 0, seconds: 0});
    } else {
      let hours = event.date.hours;
      let AmOrPm = hours >= 12 ? 'PM' : 'AM';
      hours = (hours % 12) || 12;
      timeOut = ", " + hours + ":" + `${event.date.minutes}`.padStart(2,"0") + ":" + `${event.date.seconds}`.padStart(2,"0") + " " + AmOrPm;
      dt = dt.setAbsolute({hours: event.date.hours, minutes: event.date.minutes, seconds: event.date.seconds});
    }
    let macro = this.getEntity(event.text, game.macros, macroRe);
    if (macro) {
      game.Gametime.doAt(dt, macro.name)
    }
    else
    {
      let journal = this.getEntity(event.text, game.journal, journalRe);
      let chatOut = "<b>" + event.name + "</b> - " + this.dateNum + timeOut + "<hr>" + journal ? journal.data.content : event.text;
      game.Gametime.reminderAt(dt, chatOut, "Event:", "GM");
    } 
  })
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
    Gametime.advanceTime({minutes: 15});
    this.setTimeDisp();
  }

  advanceHour() {
    Gametime.advanceTime({hours: 1});
    this.setTimeDisp();
  }

  advanceNight() {
    let newDT = Gametime.DTNow().add({days: 1}).setAbsolute({ hours: 0, minutes: 0, seconds: 0 });
    Gametime.setAbsolute(newDT);
  }

  advanceMorning() {
    let now = Gametime.DTNow();
    let newDT = now.add({days: now.hours < 7 ? 0 : 1}).setAbsolute({ hours: 7, minutes: 0, seconds: 0 });
    Gametime.setAbsolute(newDT);
    this.setTimeDisp();
  }

  genDateWordy() {
    let now = Gametime.DTNow();
    let days = now.days + 1;
    let dayAppendage = "";
    if (days % 10 == 1 && days != 11) {
      dayAppendage = "st";
    } else if (days % 10 == 2 && days != 12) {
      dayAppendage = "nd";
    } else if (days % 10 == 3 && days != 13) {
      dayAppendage = "rd";
    } else {
      dayAppendage = "th";
    }
    this._dateWordy = days + dayAppendage + " of " +
      this.months[now.months].name + ", " + now.years + " " + this.era;

    let abbrev = this.months[now.months] ? this.months[now.months].abbrev : now.months;
    this.dateNum = days + "/" + abbrev + "/" + now.years + " " + this.era;
  }

  advanceDay(suppress = false) {
    Gametime.setAbsolute(Gametime.DTNow().add({days: 1}));
    if(!suppress){
      this.weather.generate();
    }
  }

  advanceMonth() {
    Gametime.setAbsolute(Gametime.DTNow().add({months: 1}));
  }
}

class WarningSystem {
  constructor() {}

  static validateAboutTime() {
    let aboutTime = game.modules.find(module => module.id === 'about-time' && module.active);
    if (!aboutTime && game.user.isGM) {
      return WarningSystem.generateDialog();
    }
  }

  static generateDialog() {
    new Dialog({
      title: "About Time is not found",
      content: "The Calendar/Weather mod requires AboutTime by Tim Posney in order to run properly.",
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: "Open the Gitlab page now",
          callback: () => window.open('https://gitlab.com/tposney/about-time/-/tree/master/src', '_blank', "fullscreen=no")
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

  let c = new Calendar();
  // Init settings so they can be wrote to later
  Hooks.on('init', () => {
    // c.populateData();

    game.settings.register('calendar-weather', 'dateTime', {
      name: "Date/Time Data",
      scope: 'world',
      config: false,
      // default: {},
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
  });

  Hooks.on('renderCalendarEvents', () => {
    c.checkEventBoxes();
    c.settingsOpen(true);
  })

  // close without save
  Hooks.on('closeCalendarEvents', () => {
    c.settingsOpen(false);
  });

  Hooks.on('calendarEventsClose', (newEvents) => {
    console.log("calendar-settings | Saving events.")
    c.setEvents(newEvents);
    c.updateSettings();
    c.settingsOpen(false);

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

  let lastDays = 0;
  Hooks.on("pseudoclockSet", () => {
    let newDays = Gametime.DTNow().toDays().days;

    if (lastDays !== newDays) {
      templateData.dt.genDateWordy();
      templateData.dt.checkEvents();
      templateData.dt.weather.generate();
    }
    lastDays = newDays;

    if (document.getElementById('calendar-time-container')) {
      c.updateDisplay();
    }
  })
  Hooks.on("renderWeatherForm", () => {
    let offset = document.getElementById("calendar").offsetWidth + 225
    document.getElementById("calendar-weather-container").style.left = offset + 'px'
    document.getElementById('calendar-weather-climate').value = templateData.dt.weather.climate;
  })

  Hooks.on("calendarWeatherUpdateUnits", (newUnits) => {
    templateData.dt.weather.isC = newUnits;
    c.updateSettings()
  })

  Hooks.on("calendarWeatherRegenerate", () => {
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
    if (Gametime.isRunning()) {
      document.getElementById('calendar-btn-sec').disabled = true;
      document.getElementById('calendar-btn-halfMin').disabled = true;
      document.getElementById('calendar-btn-sec').style.cursor = 'not-allowed';
      document.getElementById('calendar-btn-halfMin').style.cursor = 'not-allowed';
      document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 0.5)";
      document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 0.5)";
    } else {
      document.getElementById('calendar-btn-sec').disabled = false;
      document.getElementById('calendar-btn-halfMin').disabled = false;
      document.getElementById('calendar-btn-sec').style.cursor = 'pointer';
      document.getElementById('calendar-btn-halfMin').style.cursor = 'pointer';
      document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 1)";
      document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 1)";
    }
    let icon = document.getElementById('calendar-weather');
    switch (templateData.dt.weather.seasonColor) {
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
  })

  Hooks.on("renderSceneConfig", (app, html, data) => {
    let loadedData = canvas.scene.getFlag('calendar-weather', 'showFX');
    const fxHtml = `
    <div class="form-group">
        <label>Calendar/Weather - Weather Effects</label>
        <input type="checkbox" name="calendarFX" data-dtype="Boolean" ${loadedData ? 'checked' : ''} onChange="canvas.scene.setFlag('calendar-weather', 'showFX', this.checked);">
        <p class="notes">When checked, and the FXMaster module is enabled, generating new weather will change the scene's current effect.</p>
    </div>
    `

    const fxFind = html.find("select[name ='weather']");
    const formGroup = fxFind.closest(".form-group");
    formGroup.after(fxHtml);
});

  Hooks.on("canvasInit", async canvas => {
    console.log("loading Da Flag:" + canvas.scene.getFlag('calendar-weather', 'showFX'));
    templateData.dt.weather.showFX = canvas.scene.getFlag('calendar-weather', 'showFX');
  });

  Hooks.on("closeSceneConfig", () => {
    console.log("loading Da Flag:" + canvas.scene.getFlag('calendar-weather', 'showFX'));
    templateData.dt.weather.showFX = canvas.scene.getFlag('calendar-weather', 'showFX');
  });

  Hooks.on('ready', () => {
    c.loadSettings();
    WarningSystem.validateAboutTime();
    if (c.getPlayerDisp() || game.user.isGM) {
      renderTemplate(templatePath, templateData).then(html => {
        c.render(true);
      });
    }
  });
});