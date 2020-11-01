import { _myCalendarSpec, DateTime } from "./dateTime.mjs";
import { Month } from "./month.mjs";

export class CalendarForm extends FormApplication {
  data = {};
  constructor(newData) {
    super();
    newData = JSON.parse(newData);
    let now = game.Gametime.DTNow();

    this.data = {
      months: newData.months,
      daysOfTheWeek: newData.daysOfTheWeek,
      year: now.years,
      day: now.days + 1,
      numDayOfTheWeek: now.dow(),
      currentMonth: now.months + 1,
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
    options.title = "Calendar Weather Settings";
    return options;
  }

  saveData() {
    let savedData = new DateTime();

    let year = parseInt(
      document.getElementById("calendar-form-year-input").value
    );
    if (year < 0) {
      year = 1;
    }

    console.log("year" + year);

    savedData.era = document.getElementById("calendar-form-era-input").value;

    let hours = parseInt(
      document.getElementById("calendar-form-hour-input").value
    );
    if (hours > 24 || hours < 0) {
      hours = 23;
    }

    if (
      document.getElementById("calendar-form-ampm").value == "PM" &&
      hours < 12
    ) {
      hours = hours + 12;
    }
    if (
      document.getElementById("calendar-form-ampm").value == "AM" &&
      hours == 12
    ) {
      hours = hours - 12;
    }

    let minutes = parseInt(
      document.getElementById("calendar-form-minute-input").value
    );
    if (minutes > 59 || minutes < 0) {
      minutes = 59;
    }

    let seconds = parseInt(
      document.getElementById("calendar-form-second-input").value
    );
    if (seconds > 59 || seconds < 0) {
      seconds = 59;
    }

    let newMonthsName = document.getElementsByClassName(
      "calendar-form-month-input"
    );
    let newMonthsLength = document.getElementsByClassName(
      "calendar-form-month-length-input"
    );
    let newMonthsIsNum = document.getElementsByClassName(
      "calendar-form-month-isnum"
    );
    let newMonthsAbbrev = document.getElementsByClassName(
      "calendar-form-month-abbrev"
    );

    let newMonths = [];
    if (newMonthsName.length < 1) {
      savedData.addMonth(new Month("Month 1", 30, 30, true));
    }

    for (var i = 0; i < newMonthsName.length; i++) {
      let tempMonth = new Month("Month 1", 30, 30, true);

      if (newMonthsName[i].value == "") {
        tempMonth.name = "New Month";
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
          console.log("calendar-weather| Generating month abbrev");
          tempMonth.abbrev = tempMonth.name.substring(0, 2).toUpperCase();
        }
      } else tempMonth.abbrev = newMonthsAbbrev[i].value;
      newMonths.push(tempMonth);
    }
    savedData.months = newMonths;

    let weekDays = [];
    let newWeekdays = document.getElementsByClassName(
      "calendar-form-weekday-input"
    );
    for (var i = 0; i < newWeekdays.length; i++) {
      if (!newWeekdays[i].value) newWeekdays[i].value = "Weekday";
      weekDays.push(newWeekdays[i].value);
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
        let newData = this.saveData();
        newData.then( ( result ) => {
          console.log( result )
          Hooks.callAll("calendarSettingsClose", result );
        });
      });
      html.find(addWeekday).click(ev => {
        ev.preventDefault();
        this.saveData().then( ( result ) => {
          this.data = JSON.parse( result );
          this.data.daysOfTheWeek.push("");
          this.render(true);
          this.checkBoxes();
        });
      });
      html.find(addMonth).click(ev => {
        ev.preventDefault();
        this.saveData().then( ( result ) => {
          this.data = JSON.parse( result );
          let newMonth = new Month("", 30, 30, true);
          this.data.months.push(newMonth);
          this.render(true);
          this.checkBoxes();
        });
      });
      html.find(delWeekday).click(ev => {
        ev.preventDefault();
        this.saveData().then( ( result ) => {
          this.data = JSON.parse( result );
          const targetName = ev.currentTarget.name.split("-");
          const index = targetName[targetName.length - 1];
          this.data.daysOfTheWeek.splice(index, 1);
          this.render(true);
          this.checkBoxes();
        });
      });
      html.find(delMonth).click(ev => {
        ev.preventDefault();
        this.saveData().then( ( result ) => {
          this.data = JSON.parse( result );
          const targetName = ev.currentTarget.name.split("-");
          const index = targetName[targetName.length - 1];
          this.data.months.splice(index, 1);
          this.render(true);
          this.checkBoxes();
        });
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
                this.data.months = DateTime.months;
                this.data.daysOfTheWeek = DateTime.daysOfTheWeek;
                await this.render(true);
                try {
                  await this.checkBoxes();
                } catch (err) {}
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
          this.saveData().then( ( result ) => {
            Hooks.callAll("calendarSettingsClose", result );
          });
        }
      });
    }
    monthTarget = Number(monthTarget);

    let day = parseInt(
      document.getElementById("calendar-form-cDay-input").value
    );
    if (savedData.months[monthTarget].length < day) {
      day = savedData.months[monthTarget].length;
    }
    day -= 1;

    const timeSettings = {
      years: Number(year),
      months: Number(monthTarget),
      days: Number(day),
      hours: Number(hours),
      minutes: Number(minutes),
      seconds: Number(seconds),
    };

    const newDT = game.Gametime.DTf(timeSettings);
    let weekdayTarget = 0;
    if (
      document.querySelector(
        'input[class="calendar-form-weekday-radio"]:checked'
      ) == null
    ) {
      weekdayTarget = savedData.daysOfTheWeek.length - 1;
    } else {
      weekdayTarget = document.querySelector(
        'input[class="calendar-form-weekday-radio"]:checked'
      ).value;
    }

    savedData.numDayOfTheWeek = Number(weekdayTarget);
    savedData.setTimeDisp();
    savedData.genAbbrev();
    let returnData = {
      months: savedData.months,
      daysOfTheWeek: savedData.daysOfTheWeek,
      year: newDT.years,
      day: newDT.days,
      numDayOfTheWeek: newDT.dow(),
      firstDay: _myCalendarSpec.first_day,
      currentMonth: newDT.months,
      currentWeekday: game.Gametime.DTC.weekDays[newDT.dow()],
      dateWordy: savedData.dateWordy,
      era: savedData.era,
      dayLength: game.Gametime.DTC.hpd,
      timeDisp: savedData.timeDisp,
      dateNum: savedData.dateNum,
      events: DateTime.events,
    };

    console.log(
      "calendar-weather | Building new calendar with the following object:",
      returnData
    );
    return returnData;
  }

  activateListeners(html) {
    const submit = "#calendar-form-submit";
    const addWeekday = "#calendar-form-add-weekday";
    const addMonth = "#calendar-form-add-month";
    const delWeekday = "button[class='calendar-form-weekday-del']";
    const delMonth = "button[class='calendar-form-month-del']";
    const loadDefault = "#calendar-form-load-default";
    html.find(submit).click((ev) => {
      ev.preventDefault();
      this.close();
      Hooks.callAll("calendarSettingsClose", JSON.stringify(this.saveData()));
    });
    html.find(addWeekday).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      this.data.daysOfTheWeek.push("");
      this.render(true);
      this.checkBoxes();
    });
    html.find(addMonth).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      let newMonth = new Month("", 30, 30, true);
      this.data.months.push(newMonth);
      this.render(true);
      this.checkBoxes();
    });
    html.find(delWeekday).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.daysOfTheWeek.splice(index, 1);
      this.render(true);
      this.checkBoxes();
    });
    html.find(delMonth).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      const targetName = ev.currentTarget.name.split("-");
      const index = targetName[targetName.length - 1];
      this.data.months.splice(index, 1);
      this.render(true);
      this.checkBoxes();
    });
    html.find(loadDefault).click((ev) => {
      ev.preventDefault();
      let defaultCalendar = Object.keys(game.Gametime.calendars)[
        game.settings.get("about-time", "calendar")
      ];
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
              this.data.months = DateTime.months;
              this.data.daysOfTheWeek = DateTime.daysOfTheWeek;
              await this.render(true);
              try {
                await this.checkBoxes();
              } catch (err) {}
            },
          },
          no: {
            icon: '<i class="fas fa-times"></i>',
            label: "Don't Load",
          },
        },
      }).render(true);
    });

    html.find("*").keydown((ev) => {
      if (ev.which == 13) {
        ev.preventDefault();
        this.close();
        Hooks.callAll("calendarSettingsClose", JSON.stringify(this.saveData()));
      }
    });
  }

  getData() {
    let now = game.Gametime.DTNow();
    this.data.year = now.years;
    this.data.day = now.days + 1;
    this.data.numDayOfTheWeek = now.dow();
    this.data.currentMonth = now.months;
    this.data.currentWeekday = game.Gametime.DTC.weekDays[now.dow()];
    this.data.hours = ((now.hours + 11) % 12) + 1;
    this.data.minutes = now.minutes;
    this.data.seconds = now.seconds;
    return this.data;
  }

  formLoaded() {
    return new Promise((resolve) => {
      function check() {
        if (document.getElementById("calendar-form-submit")) {
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    });
  }

  async checkBoxes() {
    await this.formLoaded();
    let weekdays = document.getElementsByClassName(
      "calendar-form-weekday-radio"
    );
    let monthsNum = document.getElementsByClassName(
      "calendar-form-month-isnum"
    );
    let monthsAbbrev = document.getElementsByClassName(
      "calendar-form-month-abbrev"
    );
    let months = document.getElementsByClassName("calendar-form-month-radio");
    for (var i = 0, max = weekdays.length; i < max; i++) {
      weekdays[i].checked = i === this.data.numDayOfTheWeek;
    }

    for (var i = 0, max = this.data.months.length; i < max; i++) {
      if (monthsNum[i]) {
        monthsNum[i].checked = !this.data.months[i].isNumbered;
        if (monthsNum[i].checked) {
          monthsAbbrev[i].disabled = false;
          monthsAbbrev[i].style.cursor = "auto";
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
