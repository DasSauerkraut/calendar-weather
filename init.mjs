import { registerSettings } from "./modules/registerSettings.mjs";
import { DateTime } from "./modules/dateTime.mjs";
import { Calendar } from "./modules/calendar.mjs";
import { WarningSystem } from "./modules/warningSystem.mjs";

export var cwdtData = {
  dt: new DateTime()
}

$(document).ready(() => {
  const templatePath = "modules/calendar-weather/templates/calendar.html";

  let c = new Calendar();
  // Init settings so they can be wrote to later
  Hooks.on('init', () => {
    CONFIG.supportedLanguages['en'] = 'English';
    CONFIG.supportedLanguages['fr'] = 'French';
    console.log("calendar-weather | Initializing Calendar/Weather")
    registerSettings(c)
    c.isLoading = true;
  });

  Hooks.on('setup', () => {
    let operations = {
      resetPos: Calendar.resetPos,
      toggleCalendar: Calendar.toggleCalendar,
    }
    game.CWCalendar = operations;
    window.CWCalendar = operations;
  })

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
    console.log("calendar-weather | Opening Calendar form.")
    c.settingsOpen(true);
  });

  Hooks.on('calendarSettingsClose', (updatedData) => {
    console.log("calendar-weather | Closing Calendar form.");
    console.log(updatedData)
    c.rebuild(JSON.parse(updatedData));
    cwdtData.dt.genDateWordy();
    c.updateDisplay();
    c.updateSettings();
    c.settingsOpen(false);
  });

  Hooks.on('closeCalendarForm', () => {
    console.log("calendar-weather | Closing Calendar form");
    c.settingsOpen(false);
  });

  Hooks.on("renderWeatherForm", () => {
    // let offset = document.getElementById("calendar").offsetWidth + 225
    // document.getElementById("calendar-weather-container").style.left = offset + 'px'
    document.getElementById('calendar-weather-climate').value = cwdtData.dt.weather.climate;
    if (cwdtData.dt.weather.isC)
      document.getElementById("calendar-weather-temp").innerHTML = cwdtData.dt.getWeatherObj().cTemp;
  })

  Hooks.on("calendarWeatherUpdateUnits", (newUnits) => {
    cwdtData.dt.weather.isC = newUnits;
    c.updateSettings()
  })

  Hooks.on('calendarWeatherClimateSet', (newClimate) => {
    console.log("calendar-weather | Setting climate: " + newClimate)
    cwdtData.dt.weather.setClimate(newClimate);
    c.updateDisplay();
    c.updateSettings();
  });

  Hooks.on("renderCalendar", () => {
    if(!game.user.isGM){
      document.getElementById('calendar-time-container').classList.add('calendar-weather-ltd');
    }
    if (Gametime.isRunning()) {
      console.log('gameTime is Running!');
      document.getElementById('calendar-btn-advance_01').classList.add('disabled');
      document.getElementById('calendar-btn-advance_02').classList.add('disabled');
      document.getElementById('calendar-time-running').classList.add('isRunning');
      document.getElementById('clock-run-indicator').classList.add('isRunning');
    } else {
      console.log('gameTime is not Running!');
      document.getElementById('calendar-btn-advance_01').classList.remove('disabled');
      document.getElementById('calendar-btn-advance_02').classList.remove('disabled');
      document.getElementById('calendar-time-running').classList.remove('isRunning');
      document.getElementById('clock-run-indicator').classList.remove('isRunning');
    }
    let seasonIndicator = document.getElementById('season-indicator');
    switch (cwdtData.dt.weather.seasonColor) {
      case 'red':
        seasonIndicator.style.color = "#B12E2E"
        break;
      case 'orange':
        seasonIndicator.style.color = "#B1692E"
        break;
      case 'yellow':
        seasonIndicator.style.color = "#B99946"
        break;
      case 'green':
        seasonIndicator.style.color = "#258E25"
        break;
      case 'blue':
        seasonIndicator.style.color = "#5b80a5"
        break;
      case 'white':
        seasonIndicator.style.color = "#CCC"
        break;
      default:
        // icon.style.color = "#000"
        break
    }
    if ( game.data.paused && document.getElementById('calendar-time-container')) {
      document.getElementById('calendar-time-container').classList.add('clockPaused');
    }
  })

  Hooks.on("renderSceneConfig", (app, html, data) => {
    //fix cyclical issues
    if ( app.renderCalendarScene) return ; 
    app.renderCalendarScene = true;

    let loadedWeatherData = undefined;
    let loadedNightData = undefined;

    if(app.object.data.flags["calendar-weather"]){
      if (app.object.data.flags["calendar-weather"].showFX){
        loadedWeatherData = app.object.getFlag('calendar-weather', 'showFX');
      } else {
        if (app.object.compendium == null) {
          app.object.setFlag('calendar-weather', 'showFX', false);
        }
        loadedWeatherData = false;
      }
  
      if (app.object.data.flags["calendar-weather"].doNightCycle){
        loadedNightData = app.object.getFlag('calendar-weather', 'doNightCycle');
      } else {
        if (app.object.compendium == null) {
          app.object.setFlag('calendar-weather', 'doNightCycle', false);
        }
        loadedNightData = false;
      }  
    } else {
      if (app.object.compendium == null) {
        app.object.setFlag('calendar-weather', 'showFX', false);
      }
      loadedWeatherData = false;
      
      if (app.object.compendium == null) {
        app.object.setFlag('calendar-weather', 'doNightCycle', false);
      }
      loadedNightData = false;
    }
    
    const fxHtml = `
    <div class="form-group">
        <label>${game.i18n.localize('CWSETTING.WeatherLabel')}</label>
        <input id="calendar-weather-showFX" type="checkbox" name="calendarFXWeather" data-dtype="Boolean" ${loadedWeatherData ? 'checked' : ''}>
        <p class="notes">${game.i18n.localize('CWSETTING.WeatherLabelHelp')}</p>
    </div>
    <div class="form-group">
        <label>${game.i18n.localize('CWSETTING.NightCycleLabel')}</label>
        <input id="calendar-weather-doNightCycle" type="checkbox" name="calendarFXNight" data-dtype="Boolean" ${loadedNightData ? 'checked' : ''}>
        <p class="notes">${game.i18n.localize('CWSETTING.NightCycleLabelHelp')}</p>
    </div>
    `
    const fxFind = html.find("select[name ='weather']");
    const formGroup = fxFind.closest(".form-group");
    formGroup.after(fxHtml);
  });

  Hooks.on("canvasInit", async canvas => {
    cwdtData.dt.weather.showFX = canvas.scene.getFlag('calendar-weather', 'showFX');
    cwdtData.dt.weather.doNightCycle = canvas.scene.getFlag('calendar-weather', 'doNightCycle');

    if (Gametime.isMaster()) {
      cwdtData.dt.weather.loadFX();
    }
  });

  Hooks.on("closeSceneConfig", (app, html, data) => {
    app.renderCalendarScene = false;
    if (app.object.compendium == null) {
      app.object.setFlag('calendar-weather', 'showFX', html.find("input[name ='calendarFXWeather']").is(":checked"))
      app.object.setFlag('calendar-weather', 'doNightCycle', html.find("input[name ='calendarFXNight']").is(":checked"))
    }

    cwdtData.dt.weather.showFX = canvas.scene.getFlag('calendar-weather', 'showFX');

    cwdtData.dt.weather.doNightCycle = canvas.scene.getFlag('calendar-weather', 'doNightCycle');
  });

  Hooks.on("getSceneControlButtons", (controls) => {
    if(game.user.isGM){
      let notes = controls.find(control => control.name == 'notes')
      notes.tools.splice( notes.tools.length-1, 0, {
          name: "toggleCalendar",
          title: "CWMISC.toggleControl",
          icon: "far fa-calendar-alt",
          onClick: () => {
            CWCalendar.toggleCalendar(c);
          },
          button: true,
        });
    }
  })

  Hooks.on('ready', () => {
    c.loadSettings();
    // CONFIG.debug.hooks = true;

    Hooks.on("updateWorldTime", () => {
      let newDays = Gametime.DTNow().toDays().days;
      if (cwdtData.dt.lastDays !== newDays) {
        cwdtData.dt.genDateWordy();
        if (Gametime.isMaster() && cwdtData.dt.lastDays) {
          Hooks.callAll("CWCalendar.newDay", {
            date: Gametime.DTNow(),
          });
          cwdtData.dt.checkEvents();
          cwdtData.dt.checkMoons();
          cwdtData.dt.weather.generate();
          c.updateSettings();
        }
      }
      cwdtData.dt.lastDays = newDays;
  
      if (document.getElementById('calendar-time-container')) {
        c.updateDisplay();
        cwdtData.dt.weather.lightCycle();
      }
    })
    Hooks.on("about-time.clockRunningStatus", c.updateDisplay)
    Hooks.on("about-time.pseudoclockMaster", () => {
      cwdtData.dt.checkMoons(true);
    })
    WarningSystem.validateAboutTime();
    if (c.getPlayerDisp() || game.user.isGM) {
      renderTemplate(templatePath, cwdtData).then(html => {
        c.render(true);
      });
    }

    if(game.data.system.data.name == "wfrp4e"){
      console.log('\n\n\\n\n\n\n\ncalendar-weather | Using WFRP4E Styling\n\n\n\n\n\n\n\n')
      let link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet')
      link.type = 'text/css'
      link.href = '/modules/calendar-weather/css/wfrpcalendar.css'
  
      document.head.appendChild(link);
    }
  });

  Hooks.on("pauseGame", (pause) => {
    console.log('Game Paused: ' + pause);
    if (document.getElementById('calendar-time-container')) {
      if (pause) {
        document.getElementById('calendar-time-container').classList.add('clockPaused');
      } else {
        document.getElementById('calendar-time-container').classList.remove('clockPaused');
      }
    }
  });
});
