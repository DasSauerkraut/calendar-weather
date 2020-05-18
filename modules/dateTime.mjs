import { WeatherTracker } from "./weatherTracker.mjs";
import { Month } from "./month.mjs";
import { cwdtData } from "../init.mjs";

export var _myCalendarSpec = {
    "leap_year_rule": (year) => 0,
    "clock_start_year": 0,
    "first_day": 0,
    "notes": {},
    "hours_per_day": 24,
    "seconds_per_minute": 60,
    "minutes_per_hour": 60,
    "has_year_0": true,
    "month_len": {},
    "weekdays": [],
  };
  
  class DateTimeStatics {
    _weather = new WeatherTracker();
    _seasons = [];
    _reEvents = [];
    _events = [];
    _moons = [];
    _months = [];
    _daysOfTheWeek = [];
    _lastDays = 0;
  }
  
  let dateTimeStatics = new DateTimeStatics();
  
  export class DateTime {
    is24 = false;
    static updateDTC() { // update the calendar spec so that about-time will know the new calendar
      Gametime.DTC.createFromData(_myCalendarSpec);
    }
  
    static updateFromDTC(calendarName) {
      let calSpec = duplicate(game.Gametime.calendars[calendarName]);
      if (calSpec) {
        _myCalendarSpec = calSpec;
        _myCalendarSpec.leap_year_rule = game.Gametime.calendars[calendarName].leap_year_rule;
        // Remove this when leap years are supported in this module
        _myCalendarSpec.leap_year_rule = (year) => 0;
        this.months = Object.keys(calSpec.month_len).map((k, i) => {
          let m = calSpec.month_len[k];
          return new Month(k, m.days[0], m.days[1], !m.intercalary, m.intercalary ? "XX" : `${i+1}`)
        })
        this.daysOfTheWeek = calSpec.weekdays;
        game.Gametime.DTC.createFromData(_myCalendarSpec);
      }
    }
  
    _year = 0;
    _dateWordy = "";
    _era = "";
    timeDisp = "";
    _dateNum = "";
  
    static get lastDays() {
      return dateTimeStatics._lastDays
    };
    static set lastDays(days) {
      dateTimeStatics._lastDays = days
    }
    get lastDays() {
      return DateTime.lastDays
    };
    set lastDays(days) {
      DateTime.lastDays = days
    }

    static get moons() {
      return dateTimeStatics._moons ? dateTimeStatics._moons : []
    };
    static set moons(moons) {
      dateTimeStatics._moons = moons || []
    };
    get moons() {
      return DateTime.moons
    };
    set moons(moons) {
      DateTime.moons = moons
    };
  
    static get reEvents() {
      return dateTimeStatics._reEvents ? dateTimeStatics._reEvents : []
    };
    static set reEvents(reEvents) {
      dateTimeStatics._reEvents = reEvents || []
    };
    get reEvents() {
      return DateTime.reEvents
    };
    set reEvents(reEvents) {
      DateTime.reEvents = reEvents
    };
  
    static get events() {
      return dateTimeStatics._events ? dateTimeStatics._events : []
    };
    static set events(events) {
      dateTimeStatics._events = events || []
    };
    get events() {
      return DateTime.events
    };
    set events(events) {
      DateTime.events = events
    };
  
    static get seasons() {
      return dateTimeStatics._seasons ? dateTimeStatics._seasons : []
    };
    static set seasons(seasons) {
      dateTimeStatics._seasons = seasons || []
    };
    get seasons() {
      return DateTime.seasons
    };
    set seasons(seasons) {
      DateTime.seasons = seasons
    };
  
    static get weather() {
      return dateTimeStatics._weather ? dateTimeStatics._weather : new WeatherTracker()
    }
    static set weather(weather) {
      dateTimeStatics._weather = weather || new WeatherTracker()
    }
    get weather() {
      return DateTime.weather
    }
    set weather(weather) {
      DateTime.weather = weather
    }
  
    static get months() {
      return dateTimeStatics._months
    }
    static set months(months) {
      _myCalendarSpec._month_len = {};
      months.forEach(m => _myCalendarSpec.month_len[m.name] = {
        "days": [Number(m.length), Number(m.leapLength)],
        "intercalary": !m.isNumbered
      })
      dateTimeStatics._months = months;
    }
    get months() {
      return DateTime.months
    }
    set months(months) {
      DateTime.months = months
    }
  
    static set daysOfTheWeek(days) {
      _myCalendarSpec.weekdays = days;
      dateTimeStatics._daysOfTheWeek = days;
    }
    static get daysOfTheWeek() {
      return dateTimeStatics._daysOfTheWeek
    }
    set daysOfTheWeek(days) {
      DateTime.daysOfTheWeek = days
    }
    get daysOfTheWeek() {
      return DateTime.daysOfTheWeek
    }
  
    get year() {
      return Gametime.DTNow().years;
    }
    get day() {
      return Gametime.DTNow().days
    }
  
    get dateWordy() {
      return this._dateWordy;
    }
    set dateWordy(dateWordy) {
      this._dateWordy = dateWordy;
    }
  
    set year(y) {
      this.setYear(y)
    }
  
    get currentWeekDay() {
      return Gametime.weekDays[Gametime.DTNow().dow()];
    }
  
    addMonth(month) {
      DateTime.months.push(month);
      _myCalendarSpec.month_len[month.name] = {
        days: [Number(month.length), Number(month.leapLength)]
      };
      // Gametime.DTC.createFromData(_myCalendarSpec);
    };
  
    addWeekday(day) {
      _myCalendarSpec.weekdays.push(day);
      DateTime.daysOfTheWeek.push(day);
      // Gametime.DTC.createFromData(_myCalendarSpec);
    };
  
    setYear(year) {
      Gametime.setAbsolute(Gametime.DTNow().setAbsolute({
        years: Number(year)
      }));
      this._year = year
    }
  
    get currentMonth() {
      return Gametime.DTNow().months
    }
    set currentMonth(currentMonth) {
      Gametime.setAbsolute(Gametime.DTNow().setAbsolute({
        months: Number(currentMonth)
      }))
    }
  
    set era(era) {
      this._era = era
    }
    get era() {
      return this._era
    }
    setEra(era) {
      this._era = era
    }
  
    setDayLength(length) {
      _myCalendarSpec.hours_per_day = Number(length);
      if (isNaN(_myCalendarSpec.hours_per_day)) {
        console.warn("Error setting day length to", length)
        _myCalendarSpec.hours_per_day = 24;
  
      }
    }
  
    set numDayOfTheWeek(dow) {
      Gametime.DTNow().setCalDow(dow);
      _myCalendarSpec.first_day = Gametime.DTC.firstDay
    }
    get numDayOfTheWeek() {
      return Gametime.DTNow().dow()
    }
  
  
    get dateNum() {
      return this._datenum
    }
    set dateNum(dateNum) {
      this._datenum = dateNum
    };
  
    get weekday() {
      return this.daysOfTheWeek[this.numDayOfTheWeek]
    }
    set weekday(day) {
      let newDow = this.daysOfTheWeek.indexOf(day);
      if (newDow != -1) this.numDayOfTheWeek = newDow;
    }
  
    getEntity(text, collection, matchRe) {
      if (text && text.startsWith("@")) {
        let macroMatch = text.match(matchRe);
        if (macroMatch && macroMatch.length === 2) {
          // match by id
          let entity = collection.get(macroMatch[1])
          // if no match search by name
          if (!entity) entity = collection.entities.find(m => m.name === macroMatch[1]);
          return entity;
        }
      }
      return null;
    }
  
    findSeason(dateTime) {
      let targetDay = dateTime.days + 1;
      let targetMonth = dateTime.months;
  
      let abbrevs = this.months.map(m => `${m.abbrev}`); // need text abbreviations here so they can be looked up
  
      // find the first season after today (if there is one) and set the current season to the one before that or the last season if nothing matched.
      let season = this.seasons.find(s => {
        let smn = abbrevs.indexOf(s.date.month);
        return smn > targetMonth || (smn === targetMonth && s.date.day > targetDay)
      });
      let index = season ? ((this.seasons.indexOf(season) - 1 + this.seasons.length) % this.seasons.length) : this.seasons.length - 1;
  
      return this.seasons[index];
    }

    checkMoons(moonSet = false){
      console.log('Checking moons!')
      if (!Gametime.isMaster()) return;

      this.moons.forEach((moon, index) => {
        console.log(moon)
        if(!moonSet){
          let percentIncrease = 1/moon.cycleLength * 100;
          if(moon.isWaxing)
            moon.cyclePercent += percentIncrease;
          else
            moon.cyclePercent -= percentIncrease;
        }
        let moonPhase = ''
        let phasePrefix = ''
        let moonSymbol = ''
        //New Moon
        if(moon.cyclePercent <= 0){
          moonPhase = game.i18n.localize('MoonNew')
          moonSymbol = './modules/calendar-weather/icons/new.png'
          moon.cyclePercent = 0;
          moon.isWaxing = true;
        }else if(moon.cyclePercent > 0 && moon.cyclePercent <= 33){
          moonPhase = game.i18n.localize('MoonCrescent')
          if(moon.isWaxing){
            phasePrefix = game.i18n.localize('MoonIsWaxing')
            moonSymbol = './modules/calendar-weather/icons/waxingCrescent.png'
          }
          else{
            phasePrefix = game.i18n.localize('MoonWaning')
            moonSymbol = './modules/calendar-weather/icons/waningCrescent.png'
          }
        }else if(moon.cyclePercent > 33 && moon.cyclePercent <= 66){
          moonPhase = game.i18n.localize('MoonQuarter')
          if(moon.isWaxing){
            phasePrefix = game.i18n.localize('MoonFirstQuarter')
            moonSymbol = './modules/calendar-weather/icons/firstQuarter.png'
          }
          else{
            phasePrefix = game.i18n.localize('MoonThirdQuarter')
            moonSymbol = './modules/calendar-weather/icons/lastQuarter.png'
          }
        }else if(moon.cyclePercent > 66 && moon.cyclePercent < 100){
          moonPhase = game.i18n.localize('MoonGibbous')
          if(moon.isWaxing){
            phasePrefix = game.i18n.localize('MoonIsWaxing')
            moonSymbol = './modules/calendar-weather/icons/waxingGibbous.png'
          }
          else{
            phasePrefix = game.i18n.localize('MoonWaning')
            moonSymbol = './modules/calendar-weather/icons/waningGibbous.png'
          }
        }else if(moon.cyclePercent >= 100){
          moonPhase = game.i18n.localize('MoonFull')
          moonSymbol = './modules/calendar-weather/icons/full.png'
          moon.cyclePercent = 100;
          moon.isWaxing = false;
        }

        if(!document.getElementById(`calender-moon-symbol-${index}`)){
          document.getElementsByClassName('calendar-weekday-cntr')[0].innerHTML += `
            <img src="./modules/calendar-weather/icons/new.png" id='calender-moon-symbol-${index}'>
          `
        }

        if(document.getElementById(`calender-moon-symbol-${index}`).src != moonSymbol){
          document.getElementById(`calender-moon-symbol-${index}`).src = moonSymbol;
          document.getElementById(`calender-moon-symbol-${index}`).title = `${moon.name} | ${phasePrefix} ${moonPhase}`
          if(game.settings.get('calendar-weather', 'moonDisplay')){
            let messageLvl = ChatMessage.getWhisperIDs("GM")
            let chatOut = `<img src="${moonSymbol}"> ${moon.name} | ${phasePrefix} ${moonPhase}`
            ChatMessage.create({
              speaker: {
              alias: moon.name,
            },
            whisper: messageLvl,
            content: chatOut,
            });
          }
        }

        let percentMod = (Math.pow(10, (-Math.floor( Math.log(moon.solarEclipseChance) / Math.log(10)))))
        let solar = moon.solarEclipseChance * percentMod
        let roll = Math.floor(Math.random() * Math.floor(100)) * percentMod;
        if(roll < solar){
          let chatOut = `<img src="${'./modules/calendar-weather/icons/sEclipse.png'}"> ${moon.name} | ${game.i18n.localize('MoonSEclipseEventIncoming')}`
          ChatMessage.create({
            speaker: {
            alias: moon.name,
          },
          whisper: ChatMessage.getWhisperIDs("GM"),
          content: chatOut,
          });
          let solarEclipse = (moon, index, moonSymbol, moonPhase, phasePrefix) => {
            let chatOut = ``
            if(document.getElementById(`calender-moon-symbol-${index}`).src.includes('Eclipse')){
              chatOut = `<img src="${moonSymbol}"> ${moon.name} | ${game.i18n.localize('MoonSEclipseEventEnd')}`
              document.getElementById(`calender-moon-symbol-${index}`).src = moonSymbol;
              document.getElementById(`calender-moon-symbol-${index}`).title = `${moon.name} | ${phasePrefix} ${moonPhase}`
              if (this.weather.doNightCycle && Gametime.isMaster()) {
                canvas.scene.update({darkness: 0}, { animateDarkness: true})
              }
            } else {
              chatOut = `<img src="${'./modules/calendar-weather/icons/sEclipse.png'}"> ${moon.name} | ${game.i18n.localize('MoonSEclipseEvent')}`
              document.getElementById(`calender-moon-symbol-${index}`).src = './modules/calendar-weather/icons/sEclipse.png';
              document.getElementById(`calender-moon-symbol-${index}`).title = `${moon.name} | ${game.i18n.localize('MoonSEclipseEvent')}`
              console.log('doNightCycle ' + cwdtData.dt.weather.doNightCycle)
              if (this.weather.doNightCycle && Gametime.isMaster()) {
                canvas.scene.update({darkness: 1}, { animateDarkness: true})
              }
              game.Gametime.doIn({minutes:30}, solarEclipse, moon, index, moonSymbol, moonPhase, phasePrefix)
            }
            
            ChatMessage.create({
              speaker: {
              alias: moon.name,
            },
            whisper: ChatMessage.getWhisperIDs("GM"),
            content: chatOut,
            });

          }
          game.Gametime.doAt(game.Gametime.DTNow().setAbsolute({hours: 11, minutes: 45}), solarEclipse, moon, index, moonSymbol, moonPhase, phasePrefix)
        } else {
          percentMod = (Math.pow(10, (-Math.floor( Math.log(moon.lunarEclipseChance) / Math.log(10)))))
          let lunar = moon.lunarEclipseChance * percentMod
          roll = Math.floor(Math.random() * Math.floor(100)) * percentMod;
          if(roll < lunar){
            let chatOut = ``
            if(moonPhase == game.i18n.localize('MoonFull')){
              chatOut = `<img src="${'./modules/calendar-weather/icons/totalLEclipse.png'}"> ${moon.name} | ${game.i18n.localize('MoonTotalLEclipse')}`
              document.getElementById(`calender-moon-symbol-${index}`).src = './modules/calendar-weather/icons/totalLEclipse.png';
              document.getElementById(`calender-moon-symbol-${index}`).title = `${moon.name} | ${game.i18n.localize('MoonTotalLEclipse')}`
            }
            else{
              chatOut = `<img src="${moonSymbol}"> ${moon.name} | ${game.i18n.localize('MoonPartialLEclipse')}`
              document.getElementById(`calender-moon-symbol-${index}`).title = `${moon.name} | ${game.i18n.localize('MoonPartialLEclipse')}`
            }
            let messageLvl = ChatMessage.getWhisperIDs("GM")
            ChatMessage.create({
              speaker: {
              alias: moon.name,
            },
            whisper: messageLvl,
            content: chatOut,
            });
          }
        }
      })
    }
  
    checkEvents() {
      if (!Gametime.isMaster()) return;
  
      let currentMonth = this.currentMonth;
      let combinedDate = (this.months[currentMonth].abbrev) + "-" + (this.day + 1);
  
      // seasons
      let newSeason = this.findSeason(Gametime.DTNow());
      let newTemp = 0
      let newHumidity = 0
      if (newSeason) {
        if (newSeason.temp == "-") {
          newTemp = -10
        } else if (newSeason.temp == "+") {
          newTemp = 10
        }
        if (newSeason.humidity == "-") {
          newHumidity = -1
        } else if (newSeason.humidity == "+") {
          newHumidity = 1
        }
        let updateFlag = this.weather.season !== newSeason.name || 
        this.weather.dawn !== newSeason.dawn || 
        this.weather.dusk !== newSeason.dusk || 
        this.weather.seasonColor !== newSeason.color || 
        this.weather.seasonTemp !== newTemp || 
        this.weather.seasonHumidity !== newHumidity ||
        this.weather.seasonRolltable !== newSeason.rolltable
        if (newSeason && updateFlag) {
          // season change
          this.weather.setSeason(newSeason)
          if (this.weather.season !== newSeason.name) {
            let chatOut = "<b>" + newSeason.name + "</b> - " + this.dateNum;
            ChatMessage.create({
              speaker: {
                alias: "Season Change:",
              },
              whisper: ChatMessage.getWhisperIDs("GM"),
              content: chatOut,
            });
          }
        }
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
          dt = dt.setAbsolute({
            hours: 0,
            minutes: 0,
            seconds: 0
          });
        } else {
          let hours = event.date.hours;
          let AmOrPm = hours >= 12 ? 'PM' : 'AM';
          hours = (hours % 12) || 12;
          timeOut = ", " + hours + ":" + `${event.date.minutes}`.padStart(2, "0") + ":" + `${event.date.seconds}`.padStart(2, "0") + " " + AmOrPm;
          dt = dt.setAbsolute({
            hours: event.date.hours,
            minutes: event.date.minutes,
            seconds: event.date.seconds
          });
        }
        let macro = this.getEntity(event.text, game.macros, macroRe);
        if (macro) {
          game.Gametime.doAt(dt, macro.name)
        } else {
          let journal = this.getEntity(event.text, game.journal, journalRe);
          let infoOut = (journal != null) ? journal.data.content : event.text
          let chatOut = "<b>" + event.name + "</b> - " + this.dateNum + timeOut + "<hr>" + infoOut;
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
        seasonColor: this.weather.seasonColor,
        seasonTemp: this.weather.seasonTemp,
        seasonHumidity: this.weather.seasonHumidity,
        climate: this.weather.climate,
        climateTemp: this.weather.climateTemp,
        climateHumidity: this.weather.climateHumidity,
        precipitation: this.weather.precipitation,
        isVolcanic: this.weather.isVolcanic,
        isC: this.weather.isC,
        weatherFX: this.weather.weatherFX,
        dawn: this.weather.dawn,
        dusk: this.weather.dusk,
        tempRange: this.weather.tempRange
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
      if (this.is24) {
        this.timeDisp = hours + ":" + minutes + ":" + sec
      } else {
        hours = (hours % 12) || 12;
        this.timeDisp = hours + ":" + minutes + ":" + sec + " " + AmOrPm;
      }
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
      this.dateWordy = days + dayAppendage + " of " +
        this.months[now.months].name + ", " + now.years + " " + this.era;
  
      let abbrev = this.months[now.months] ? this.months[now.months].abbrev : now.months;
  
      this.dateNum = days + "/" + `${abbrev}` + "/" + now.years + " " + this.era;
    }
  
    advanceMonth() {
      Gametime.setAbsolute(Gametime.DTNow().add({
        months: 1
      }));
    }
  }