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
    cwdtData.dt.genDateWordy();
    c.updateDisplay();
    c.updateSettings();
    c.settingsOpen(false);
  });

  Hooks.on('closeCalendarForm', () => {
    console.log("calendar-settings | Closing Calendar form");
    c.settingsOpen(false);
  });

  Hooks.on("renderWeatherForm", () => {
    let offset = document.getElementById("calendar").offsetWidth + 225
    document.getElementById("calendar-weather-container").style.left = offset + 'px'
    document.getElementById('calendar-weather-climate').value = cwdtData.dt.weather.climate;
    if (cwdtData.dt.weather.isC)
      document.getElementById("calendar-weather-temp").innerHTML = cwdtData.dt.getWeatherObj().cTemp;
  })

  Hooks.on("calendarWeatherUpdateUnits", (newUnits) => {
    cwdtData.dt.weather.isC = newUnits;
    c.updateSettings()
  })

  Hooks.on("calendarWeatherRegenerate", () => {
    cwdtData.dt.weather.generate();
    c.updateDisplay();
    c.updateSettings();
  })

  Hooks.on('calendarWeatherClimateSet', (newClimate) => {
    console.log("calendar-weather | Setting climate: " + newClimate)
    cwdtData.dt.weather.setClimate(newClimate);
    c.updateDisplay();
    c.updateSettings();
  });

  Hooks.on("renderCalendar", () => {
    if (Gametime.isRunning()) {
      document.getElementById('calendar-btn-sec').disabled = true;
      document.getElementById('calendar-btn-halfMin').disabled = true;
      document.getElementById('calendar-btn-sec').style.cursor = 'not-allowed';
      document.getElementById('calendar-btn-halfMin').style.cursor = 'not-allowed';
      document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 0.5)";
      document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 0.5)";
      document.getElementById('calender-time-running').style.color = "rgba(0, 255, 0, 1)";
    } else {
      document.getElementById('calendar-btn-sec').disabled = false;
      document.getElementById('calendar-btn-halfMin').disabled = false;
      document.getElementById('calendar-btn-sec').style.cursor = 'pointer';
      document.getElementById('calendar-btn-halfMin').style.cursor = 'pointer';
      document.getElementById('calendar-btn-sec').style.color = "rgba(0, 0, 0, 1)";
      document.getElementById('calendar-btn-halfMin').style.color = "rgba(0, 0, 0, 1)";
      document.getElementById('calender-time-running').style.color = "rgba(255, 0, 0, 1)";
    }
    let icon = document.getElementById('calendar-weather');
    switch (cwdtData.dt.weather.seasonColor) {
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
    let loadedData = undefined;
    if (!app.object.data.flags["calendar-weather"]){
      app.object.setFlag('calendar-weather', 'showFX', false);
      loadedData = false;
      console.log("Setting New Flag")
    } else {
      loadedData = app.object.getFlag('calendar-weather', 'showFX');
    }

    console.log("Flag Value: " + loadedData);
    
    const fxHtml = `
    <div class="form-group">
        <label>{{localize 'NightCycleLabel'}}</label>
        <input id="calendar-weather-showFX" type="checkbox" name="calendarFX" data-dtype="Boolean" ${loadedData ? 'checked' : ''}>
        <p class="notes">{{localize 'NightCycleLabelHelp'}}</p>
    </div>
    `
    const fxFind = html.find("select[name ='weather']");
    const formGroup = fxFind.closest(".form-group");
    formGroup.after(fxHtml);
  });

  Hooks.on("canvasInit", async canvas => {
    cwdtData.dt.weather.showFX = canvas.scene.getFlag('calendar-weather', 'showFX');
    if (Gametime.isMaster()) {
      cwdtData.dt.weather.loadFX();
    }
  });

  Hooks.on("closeSceneConfig", (app, html, data) => {
    app.object.setFlag('calendar-weather', 'showFX', html.find("input[name ='calendarFX']").is(":checked"))
    cwdtData.dt.weather.showFX = canvas.scene.getFlag('calendar-weather', 'showFX');
    console.log("ShowFX: "+ cwdtData.dt.weather.showFX)
  });

  Hooks.on('ready', () => {
    c.loadSettings();
    Hooks.on("pseudoclockSet", () => {
      let newDays = Gametime.DTNow().toDays().days;
      if (cwdtData.dt.lastDays !== newDays) {
        cwdtData.dt.genDateWordy();
        if (Gametime.isMaster() && cwdtData.dt.lastDays) {
          cwdtData.dt.checkEvents();
          cwdtData.dt.weather.generate();
        }
      }
      cwdtData.dt.lastDays = newDays;
  
      if (document.getElementById('calendar-time-container')) {
        c.updateDisplay();
        cwdtData.dt.weather.lightCycle();
      }
    })
    Hooks.on("about-time.clockRunningStatus", c.updateDisplay)
    // CONFIG.debug.hooks = true;
    WarningSystem.validateAboutTime();
    if (c.getPlayerDisp() || game.user.isGM) {
      renderTemplate(templatePath, cwdtData).then(html => {
        c.render(true);
      });
    }
  });
});
