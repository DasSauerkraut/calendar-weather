import  { CalendarEvents } from "./calendarEvents.mjs";
import { WeatherForm } from "./weatherForm.mjs";
import { _myCalendarSpec, DateTime } from "./dateTime.mjs";
import { Month } from "./month.mjs";
import { WeatherTracker } from "./weatherTracker.mjs";
import { CalendarForm } from "./calendarForm.mjs";
import { cwdtData } from "../init.mjs";


export class Calendar extends Application {
    isOpen = false;
    showToPlayers = true;
    eventsForm = new CalendarEvents();
    weatherForm = new WeatherForm();
    cwdtData = {};
    static get defaultOptions() {
      const options = super.defaultOptions;
      options.template = "modules/calendar-weather/templates/calendar.html";
      options.popOut = false;
      options.resizable = false;
      return options;
    }
  
    getData() {
      return cwdtData;
    }
  
    getPlayerDisp() {
      return this.showToPlayers
    }

    setPos(pos) {
      return new Promise(resolve => {
        function check() {
          let elmnt = document.getElementById("calendar-time-container")
          if (elmnt) {
            elmnt.style.top = (pos.top) + "px";
            elmnt.style.left = (pos.left) + "px";
            resolve();
          } else {
            setTimeout(check, 30);
          }
        }
        check();
      })
    }
  
    loadSettings() {
      let data = game.settings.get('calendar-weather', 'dateTime');
      let pos = game.settings.get('calendar-weather', 'calendarPos')
      if(pos){
        this.setPos(pos)
      }
      this.showToPlayers = game.settings.get('calendar-weather', 'calendarDisplay');
      cwdtData.dt.is24 = game.settings.get('calendar-weather', 'is24')
      if (!data || !data.months) {
        if (data.default) {
          console.log("calendar-weather | rebuilding data", data.default);
          // recover previous data
          cwdtData.dt = new DateTime();
          data.default.months = data.default.months.map((m, i) => {
            m.leapLength = m.length;
            if (!m.abbrev) m.abbrev = `${i+1}`;
            return m
          });
          cwdtData.dt.months = data.default.months;
          cwdtData.dt.daysOfTheWeek = data.default.daysOfTheWeek;
          cwdtData.dt.setDayLength(data.default.dayLength);
          DateTime.updateDTC(); // set the calendar spec for correct date time calculations
          cwdtData.dt.era = data.default.era;
          cwdtData.dt.weather = cwdtData.dt.weather.load(data.default.weather);
          cwdtData.dt.seasons = data.default.seasons;
          cwdtData.dt.reEvents = data.default.reEvents;
          cwdtData.dt.events = data.default.events;
          let timeout = game.settings.get("about-time", "election-timeout");
          setTimeout(function () {
            if (game.Gametime.isMaster()) {
              Gametime.setAbsolute({
                years: data.default.year,
                months: data.default.currentMonth,
                days: data.default.day - 1,
                hours: 0,
                minutes: 0,
                seconds: 0
              })
              let now = Gametime.DTNow();
              cwdtData.dt.currentWeekday = cwdtData.dt.daysOfTheWeek[now.dow()];
              cwdtData.dt.timeDisp = now.shortDate().time;
            }
          }, timeout * 1000 + 100);
  
        } else {
          this.populateData();
          let timeout = game.settings.get("about-time", "election-timeout");
          setTimeout(() => {
            if (game.Gametime.isMaster()) {
              Gametime.setAbsolute({
                years: 2020,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
              })
            }
          }, timeout * 1000 + 100);
        }
      } else {
        let now = Gametime.DTNow();
        if (!cwdtData.dt) cwdtData.dt = new DateTime();
        cwdtData.dt.months = data.months;
        cwdtData.dt.daysOfTheWeek = data.daysOfTheWeek;
        cwdtData.dt.setDayLength(data.dayLength);
        _myCalendarSpec.first_day = data.first_day;
        DateTime.updateDTC(); // set the calendar spec for correct date time calculations
        cwdtData.dt.currentWeekday = cwdtData.dt.daysOfTheWeek[now.dow()];
        cwdtData.dt.era = data.era;
        cwdtData.dt.dayLength = Gametime.DTC.hpd;
        cwdtData.dt.timeDisp = now.shortDate().time;
        cwdtData.dt.weather = cwdtData.dt.weather.load(data.weather);
        cwdtData.dt.seasons = data.seasons;
        cwdtData.dt.reEvents = data.reEvents;
        cwdtData.dt.events = data.events;
        cwdtData.dt.genDateWordy();
      }
    }
  
    checkEventBoxes() {
      this.eventsForm.checkBoxes();
      return;
    }
  
    populateData() {
      cwdtData.dt = new DateTime();
      let newMonth1 = new Month(game.i18n.localize("DefMonth"), 30, 30, true, "1");
      cwdtData.dt.addMonth(newMonth1);
      cwdtData.dt.addWeekday(game.i18n.localize("Monday"));
      cwdtData.dt.addWeekday(game.i18n.localize("Tuesday"));
      cwdtData.dt.addWeekday(game.i18n.localize("Wednesday"));
      cwdtData.dt.addWeekday(game.i18n.localize("Thursday"));
      cwdtData.dt.setDayLength(24);
      cwdtData.dt.settings = [];
      cwdtData.dt.events = [];
      cwdtData.dt.reEvents = [];
      cwdtData.dt.settings = [];
      cwdtData.dt.weather = new WeatherTracker();
      DateTime.updateDTC();
      cwdtData.dt.setEra("AD");
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
      cwdtData.dt = new DateTime();
      if (obj.months.length != 0) {
        cwdtData.dt.months = obj.months;
      }
      if (obj.daysOfTheWeek != []) {
        cwdtData.dt.daysOfTheWeek = obj.daysOfTheWeek;
      }
      let now = Gametime.DTNow();
      if (obj.dayLength != 0) {
        cwdtData.dt.dayLength = obj.dayLength;
      }
      let years = obj.year !== 0 ? obj.year : now.years;
      let months = obj.currentMonth;
      let days = obj.day !== 0 ? obj.day : now.days;
      Gametime.setAbsolute(now.setAbsolute({
        years,
        months,
        days
      }));
      cwdtData.dt.numDayOfTheWeek = obj.numDayOfTheWeek;
  
      if (obj.dateWordy != "") {
        cwdtData.dt.dateWordy = obj.dateWordy;
      } else cwdtData.dt.genDateWordy();
      if (obj.era != "") {
        cwdtData.dt.era = obj.era;
      }
      if (obj.dateNum != "") {
        cwdtData.dt.dateNum = obj.dateNum;
      }
  
    }
  
    setEvents(newData) {
      let data = JSON.parse(newData);
      cwdtData.dt.seasons = data.seasons
      cwdtData.dt.reEvents = data.reEvents
      cwdtData.dt.events = data.events
      cwdtData.dt.checkEvents();
    }
  
    updateSettings() {
      if (game.user.isGM) {
        game.settings.set("calendar-weather", "dateTime", this.toObject());
        if (Gametime.DTC.saveUserCalendar && game.user.isGM) {
          Gametime.DTC.saveUserCalendar(_myCalendarSpec);
          // set about-time to use our calendar spec on startup
          if (game.settings.get("about-time", "calendar") !== 0) game.settings.set("about-time", "calendar", 0);
        }
        if (Gametime.isMaster()) Gametime._save(true);
      }
    }
  
    updateDisplay() {
      let now = game.Gametime.DTNow();
      if (Gametime.DTNow().toDays().days * 24 * 60 * 60 + Gametime.DTNow().seconds == 0) {
        document.getElementById("calendar-date").innerHTML = "Calendar Loading...";
      } else {
        document.getElementById("calendar-date").innerHTML = cwdtData.dt.dateWordy;
      }
      document.getElementById("calendar-date-num").innerHTML = cwdtData.dt.dateNum;
      document.getElementById("calendar-weekday").innerHTML = Gametime.DTC.weekDays[now.dow()];
      cwdtData.dt.setTimeDisp();
      document.getElementById("calendar-time").innerHTML = cwdtData.dt.timeDisp;
      let temp = document.getElementById("calendar-weather-temp")
      if (temp && this) {
        if (cwdtData.dt.weather.isC) {
          temp.innerHTML = cwdtData.dt.getWeatherObj().cTemp;
        } else {
          temp.innerHTML = cwdtData.dt.getWeatherObj().temp;
        }
        document.getElementById("calendar-weather-precip").innerHTML = cwdtData.dt.getWeatherObj().precipitation
        let offset = document.getElementById("calendar-time-container")
        document.getElementById("calendar-weather-container").style.left = (parseInt(offset.style.left.slice(0, -2)) + offset.offsetWidth) + 'px'
        this.weatherForm.updateData(cwdtData.dt.getWeatherObj())
      }
      if (Gametime.isRunning()) {
        document.getElementById('calender-time-running').style.color = "rgba(0, 255, 0, 1)";
      } else {
        document.getElementById('calender-time-running').style.color = "rgba(255, 0, 0, 1)";
      }
  
      game.Gametime._save(true);
    }
  
    toObject() {
      return {
        months: cwdtData.dt.months,
        daysOfTheWeek: cwdtData.dt.daysOfTheWeek,
        year: cwdtData.dt.year,
        day: cwdtData.dt.day,
        numDayOfTheWeek: cwdtData.dt.numDayOfTheWeek,
        first_day: _myCalendarSpec.first_day,
        currentMonth: cwdtData.dt.currentMonth,
        currentWeekday: cwdtData.dt.currentWeekday,
        dateWordy: cwdtData.dt.dateWordy,
        era: cwdtData.dt.era,
        dayLength: cwdtData.dt.dayLength,
        timeDisp: cwdtData.dt.timeDisp,
        dateNum: cwdtData.dt.dateNum,
        weather: cwdtData.dt.weather,
        seasons: cwdtData.dt.seasons,
        reEvents: cwdtData.dt.reEvents,
        events: cwdtData.dt.events
      }
    }

    activateListeners(html) {
      const nextDay = '#calendar-btn-day';
      const quickAction = '#calendar-btn-quick';
      const calendarSetup = '#calendar-date';
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
      cwdtData.dt.checkEvents();
      let form = new CalendarForm(JSON.stringify(this.toObject()));
      //Next Morning
      html.find(nextDay).click(ev => {
        ev.preventDefault();
        if (!this.isOpen && game.user.isGM) {
          console.log("calendar-weather | Advancing to 7am.");
          let now = Gametime.DTNow();
          let newDT = now.add({
            days: now.hours < 7 ? 0 : 1
          }).setAbsolute({
            hours: 7,
            minutes: 0,
            seconds: 0
          });
          Gametime.setAbsolute(newDT);
        }
      });
      //Quick Action
      html.find(quickAction).click(ev => {
        ev.preventDefault();
        if (!this.isOpen && game.user.isGM) {
          console.log("calendar-weather | Advancing 15 min.");
          Gametime.advanceTime({
            minutes: 15
          });
        }
      });
      //1 sec advance
      html.find(sec).click(ev => {
        ev.preventDefault();
        if (!this.isOpen && game.user.isGM && !Gametime.isRunning()) {
          console.log("calendar-weather | Advancing 1 sec.");
          game.Gametime.advanceClock(1)
        }
      });
      //advance 30s
      html.find(halfMin).click(ev => {
        ev.preventDefault();
        if (!this.isOpen && game.user.isGM && !Gametime.isRunning()) {
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
          game.Gametime.advanceTime({
            hours: 1
          })
  
        }
      });
      //To Midnight
      html.find(nightSkip).click(ev => {
        ev.preventDefault();
        if (!this.isOpen && game.user.isGM) {
          console.log("calendar-weather | Advancing to midnight.");
          let newDT = Gametime.DTNow().add({
            days: 1
          }).setAbsolute({
            hours: 0,
            minutes: 0,
            seconds: 0
          });
          Gametime.setAbsolute(newDT);
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
            document.getElementById('calender-time-running').style.color = "rgba(255, 0, 0, 1)";
          } else {
            console.log("calendar-weather | Starting about-time pseudo clock.");
            Gametime.startRunning();
            document.getElementById('calendar-btn-sec').disabled = true;
            document.getElementById('calendar-btn-halfMin').disabled = true;
            document.getElementById('calendar-btn-sec').style.cursor = 'not-allowed';
            document.getElementById('calendar-btn-halfMin').style.cursor = 'not-allowed';
            document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 0.5)";
            document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 0.5)";
            document.getElementById('calender-time-running').style.color = "rgba(0, 255, 0, 1)";
  
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
      html.find(calendarSetup).mousedown(ev => {
        ev.preventDefault();
        ev = ev || window.event;
        let isRightMB = false;
        if ("which" in ev)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
          isRightMB = ev.which == 3
        else if ("button" in ev)  // IE, Opera 
          isRightMB = ev.button == 2;

        if (game.user.isGM && !isRightMB) {
          form.renderForm(JSON.stringify(this.toObject()));
        } else {
          dragElement(document.getElementById("calendar-time-container"))
          let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          function dragElement(elmnt) {
            elmnt.onmousedown = dragMouseDown;
            function dragMouseDown(e) {
              e = e || window.event;
              e.preventDefault();
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              document.onmousemove = elementDrag;
            }
          
            function elementDrag(e) {
              e = e || window.event;
              e.preventDefault();
              // calculate the new cursor position:
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              // set the element's new position:
              elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
              elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
          
            function closeDragElement() {
              // stop moving when mouse button is released:
              document.onmouseup = null;
              document.onmousemove = null;
              game.settings.set("calendar-weather", "calendarPos", {top: elmnt.offsetTop - pos2, left: elmnt.offsetLeft - pos1});
            }
          }
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
          this.weatherForm.toggleForm(cwdtData.dt.getWeatherObj());
        }
      })
    }
  }