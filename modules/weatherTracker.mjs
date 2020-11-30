import { cwdtData } from "../init.mjs";
export class WeatherTracker {
    humidity = 0;
    temp = 0;
    lastTemp = 70;
    season = "";
    seasonColor = "";
    seasonTemp = 0;
    seasonHumidity = 0;
    seasonRolltable = "";
    climate = "temperate";
    climateTemp = 0;
    climateHumidity = 0;
    precipitation = "";
    dawn = 5;
    dusk = 19;
    isVolcanic = false;
    outputToChat = true;
    showFX = false;
    doNightCycle = false;
    weatherFX = [];
    isC = false;
    cTemp = 21.11
    tempRange = {
      max: 100,
      min: 0
    };
  
    load(newData) {
      this.outputToChat = game.settings.get('calendar-weather', 'weatherDisplay');
      if (!newData) return this;
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
      this.weatherFX = newData.weatherFX;
      this.dawn = newData.dawn;
      this.dusk = newData.dusk;
      this.tempRange = newData.tempRange;
      return this;
    }
  
    rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  
    extremeWeather() {
      let roll = this.rand(1, 5);
      let event = "";
      if (this.isVolcanic) {
        return game.i18n.localize("VolcanoE");
      }
      switch (roll) {
        case 1:
          event = game.i18n.localize("Tornado");
          break;
        case 2:
          event = game.i18n.localize("Hurricane");
          break;
        case 3:
          event = game.i18n.localize("Drought");
          this.humidity = -5;
          break;
        case 4:
          event = game.i18n.localize("Baseball");
          break;
        case 5:
          if (this.temp <= 32) {
            event = game.i18n.localize("Blizzard");
          } else {
            event = game.i18n.localize("Monsoon");
          }
          break;
      }
      return game.i18n.localize("Xtrem") + event;
    }
  
    setClimate(climate) {
      this.isVolcanic = false;
      switch (climate) {
        case "temperate":
          this.climateHumidity = 0;
          this.climateTemp = 0;
          this.climate = "temperate";
          this.tempRange = {
            max: 100,
            min: -5
          }
          this.generate(true)
          break;
        case "tempMountain":
          this.climateHumidity = 0;
          this.climateTemp = -10;
          this.climate = "tempMountain";
          this.tempRange = {
            max: 75,
            min: -40
          }
          this.generate(true)
          break;
        case "desert":
          this.climateHumidity = -4;
          this.climateTemp = 20;
          this.climate = "desert";
          this.tempRange = {
            max: 134,
            min: 50
          }
          this.generate(true)
          break;
        case "tundra":
          this.climateHumidity = 0;
          this.climateTemp = -20;
          this.climate = "tundra";
          this.tempRange = {
            max: 30,
            min: -60
          }
          this.generate(true)
          break;
        case "tropical":
          this.climateHumidity = 1;
          this.climateTemp = 20;
          this.climate = "tropical";
          this.tempRange = {
            max: 100,
            min: 60
          }
          this.generate(true)
          break;
        case "taiga":
          this.climateHumidity = -1;
          this.climateTemp = -20;
          this.climate = "taiga";
          this.tempRange = {
            max: 70,
            min: -65
          }
          this.generate(true)
          break;
        case "volcanic":
          this.climateHumidity = 0;
          this.climateTemp = 40;
          this.climate = "volcanic";
          this.isVolcanic = true;
          this.tempRange = {
            max: 170,
            min: 70
          }
          this.generate(true)
          break;
        case "polar":
          this.climateHumidity = 0;
          this.climateTemp = -50;
          this.climate = "polar";
          this.tempRange = {
            max: 10,
            min: -170
          }
          this.generate(true)
          break;
      }
    }
  
    genPrecip(roll) {
      let fxAvailable = false;
      let weather = "";
      let effects = [];

      if(this.seasonRolltable !== undefined &&this.seasonRolltable !== ""){
          if (this.seasonRolltable && this.seasonRolltable.startsWith("@")) {
            let macroMatch = this.seasonRolltable.match(/\@RollTable\[(.*)\].*/);
            if (macroMatch && macroMatch.length === 2) {
              // match by id
              let entity = game.tables.get(macroMatch[1])
              // if no match search by name
              if (!entity) entity = game.tables.entities.find(m => m.name === macroMatch[1]);
              let tableRoll = entity.roll()
              return `Roll: ${tableRoll.roll._result} <br> ${tableRoll.results[0].text}`
            }
        }
        return "Error: RollTable not found!";
      }

      if (game.modules.get("fxmaster")?.active) {
        if(this.showFX || canvas.scene?.getFlag('calendar-weather', 'showFX')){
          fxAvailable = true;
          this.showFX = true;
        }
      }
      if (roll < 0) {
        roll = this.rand(1, 20) == 20 ? 6 : 1;
      }
      if (roll <= 3) {
        if (this.isVolcanic) {
          weather = game.i18n.localize("AshenW");
        } else {
          weather = game.i18n.localize("ClearW");
        }
      } else if (roll <= 6) {
        this.humidity += 1;
        if (this.isVolcanic) {
          effects.push({
              type: 'clouds',
              options: {
                density: "13",
                speed: "29",
                scale: "34",
                tint: "#4a4a4a",
                direction: "50",
                apply_tint: true
              }
          })
          weather = game.i18n.localize("DarkW");
        } else {
          effects.push({
              type: 'clouds',
              options: {
                density: "13",
                speed: "29",
                scale: "34",
                tint: "#bcbcbc",
                direction: "50",
                apply_tint: true
              }
          })
          weather = game.i18n.localize("ScatteredW");
        }
      } else if (roll == 7) {
        if (this.isVolcanic) {
          weather = game.i18n.localize("SunAshW");
        } else {
          if (this.temp < 25) {
            effects.push({
                type: 'clouds',
                options: {
                  density: "41",
                  speed: "29",
                  scale: "34",
                  tint: "#bcbcbc",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'snow',
                options: {
                  density: "30",
                  speed: "31",
                  scale: "17",
                  tint: "#000000",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("OvercastW");
          } else if (this.temp < 32) {
            effects.push({
                type: 'clouds',
                options: {
                  density: "41",
                  speed: "29",
                  scale: "34",
                  tint: "#bcbcbc",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'rain',
                options: {
                  density: "19",
                  speed: "50",
                  scale: "31",
                  direction: "50",
                }
            })
            effects.push({
                type: 'snow',
                options: {
                  density: "30",
                  speed: "31",
                  scale: "17",
                  direction: "50",
                }
            })
            weather = game.i18n.localize("OvercastLightW");
          } else {
            effects.push({
                type: 'clouds',
                options: {
                  density: "40",
                  speed: "29",
                  scale: "20",
                  tint: "#bcbcbc",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'rain',
                options: {
                  density: "40",
                  speed: "50",
                  scale: "30",
                  tint: "#acd2cd",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("OvercastDrizzleW");
          }
        }
      } else if (roll == 8) {
        this.humidity -= 1;
        if (this.climate == "desert") {
          this.humidity -= 1;
        }
        if (this.isVolcanic) {
          effects.push({
              type: 'snow',
              options: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#000000",
                direction: "50",
                apply_tint: true
              }
          })
          effects.push({
              type: 'embers',
              options: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#ff1c1c",
                direction: "50",
                apply_tint: true
              }
          })
          weather = game.i18n.localize("AshfallW");
        } else {
          if (this.temp < 25) {
            effects.push({
                type: 'snow',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("LightSnowW");
          } else if (this.temp < 32) {
            effects.push({
                type: 'snow',
                options: {
                  density: "25",
                  speed: "50",
                  scale: "25",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'rain',
                options: {
                  density: "25",
                  speed: "50",
                  scale: "50",
                  tint: "#acd2cd",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("LightRainW");
          } else {
            effects.push({
                type: 'rain',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  tint: "#acd2cd",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("ModerateRainW");
          }
        }
  
      } else if (roll == 9) {
        this.humidity -= 2;
        if (this.climate == "desert") {
          this.humidity -= 2;
        }
        if (this.isVolcanic) {
          effects.push({
              type: 'rain',
              options: {
                density: "72",
                speed: "50",
                scale: "67",
                tint: "#ff8040",
                direction: "50",
                apply_tint: true
              }
          })
          effects.push({
              type: 'embers',
              options: {
                density: "50",
                speed: "50",
                scale: "50",
                tint: "#ff1c1c",
                direction: "50",
                apply_tint: true
              }
          })
          weather = game.i18n.localize("FireyRainW");
        } else {
          if (this.temp < 25) {
            effects.push({
                type: 'snow',
                options: {
                  density: "72",
                }
            })
            weather = game.i18n.localize("LargeSnowW");
          } else if (this.temp < 32) {
            effects.push({
                type: 'snow',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'rain',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  tint: "#acd2cd",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("LargeFreezingRainW");
          } else {
            effects.push({
                type: 'rain',
                options: {
                  density: "72",
                  speed: "50",
                  scale: "67",
                  tint: "#acd2cd",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("HeavyRainW");
          }
        }
  
      } else if (roll >= 10) {
        this.humidity -= 2;
        if (this.climate == "desert") {
          this.humidity = 0;
        }
        if (this.rand(1, 20) == 20) {
          weather = this.extremeWeather();
        } else {
          if (this.isVolcanic) {
            effects.push({
                type: 'rain',
                options: {
                  density: "100",
                  speed: "75",
                  scale: "100",
                  tint: "#ff8040",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'embers',
                options: {
                  density: "100",
                  speed: "50",
                  scale: "100",
                  tint: "#ff1c1c",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'snow',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  tint: "#ffffff",
                  direction: "50",
                  apply_tint: true
                }
            })
            effects.push({
                type: 'clouds',
                options: {
                  density: "50",
                  speed: "8",
                  scale: "50",
                  tint: "#d2e8ce",
                  direction: "50",
                  apply_tint: true
                }
            })
            weather = game.i18n.localize("EarthquakeW");
          } else {
            if (this.temp < 25) {
              effects.push({
                  type: 'snow',
                  options: {
                    density: "100",
                    speed: "75",
                    scale: "100",
                    tint: "#ffffff",
                    direction: "50",
                    apply_tint: true
                  }
              })
              effects.push({
                type: 'clouds',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  direction: "50",
                }
              })
              weather = game.i18n.localize("BlizzardW");
            } else if (this.temp < 32) {
              effects.push({
                  type: 'snow',
                  options: {
                    density: "50",
                    speed: "50",
                    scale: "50",
                    tint: "#ffffff",
                    direction: "50",
                    apply_tint: true
                  }
              })
              effects.push({
                  type: 'rain',
                  options: {
                    density: "83",
                    speed: "17",
                    scale: "100",
                    tint: "#ffffff",
                    direction: "50",
                    apply_tint: true
                  }
              })
              effects.push({
                type: 'clouds',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  direction: "50",
                }
              })
              weather = game.i18n.localize("IcestormW");
            } else {
              effects.push({
                  type: 'rain',
                  options: {
                    density: "100",
                    speed: "75",
                    scale: "100",
                    tint: "#acd2cd",
                    direction: "50",
                    apply_tint: true
                  }
              })
              effects.push({
                  type: 'rain',
                  options: {
                    density: "100",
                    speed: "75",
                    scale: "100",
                    tint: "#acd2cd",
                    direction: "50",
                    apply_tint: true
                  }
              })
              effects.push({
                type: 'clouds',
                options: {
                  density: "50",
                  speed: "50",
                  scale: "50",
                  direction: "50",
                }
              })
              weather = game.i18n.localize("TorrentialRainW");
            }
          }
  
        }
      }
      this.weatherFX = effects
      if (fxAvailable) {
        Hooks.call("updateWeather", effects);
      }
      return weather;
    }
  
    output() {
      let tempOut = "";
      if (game.settings.get('calendar-weather', 'useCelcius')) {
        tempOut = this.cTemp + " °C";
      } else {
        tempOut = this.temp + " °F"
      }
      let messageLvl = ChatMessage.getWhisperRecipients("GM")
      let chatOut = "<b>" + tempOut + "</b> - " + this.precipitation;
      ChatMessage.create({
        speaker: {
          alias: game.i18n.localize("TodayW"),
        },
        whisper: messageLvl,
        content: chatOut,
      });
    }
  
    generate(force = false) {
      let roll = this.rand(1, 6)
      roll = roll + this.humidity + this.climateHumidity + Math.floor(this.seasonHumidity)
      let season = this.seasonTemp;
      let climate = this.climateTemp;
      if(this.tempRange == undefined){
        this.tempRange = {
          max: 90,
          min: -20
        }
      }
      if (this.climate == "tropical") {
        season = this.seasonTemp * 0.5;
      }
  
      if (force) {
        this.temp = this.rand(this.lastTemp - 5, this.lastTemp + 5) + season + climate + (this.rand(1,20) === 20 ? 20 : 0);
      } else if (this.rand(1, 3) === 3) {
        this.temp = this.rand(40, 70) + season + climate;
      } else {
         this.temp = this.rand(this.lastTemp - 5, this.lastTemp + 5) + Math.floor(climate / 20 + season / 20);
      }
      
      if(this.temp > this.tempRange.max){
        this.temp = this.rand(this.temp+5, this.temp+10)
      } else if (this.temp < this.tempRange.min) {
        this.temp = this.rand(this.temp-10, this.temp-5)
      }

      this.lastTemp = this.temp;
      this.cTemp = ((this.temp - 32) * 5 / 9).toFixed(1);

      //Morrslieb weather events
      let morrTrigger = (this.rand(1, 400) == 1 || cwdtData.dt.months[Gametime.DTNow().months].name == "Hexenstag" || cwdtData.dt.months[Gametime.DTNow().months].name == "Geheimnistag")
      if (morrTrigger && game.data.system.data.name == "wfrp4e" && Gametime.isMaster()) {
        this.precipitation = game.i18n.localize("MorrsliebFull");
      } else {
        this.precipitation = this.genPrecip(roll);
      }
      if (this.outputToChat) {
        this.output();
      }
    }
  
    loadFX() {
      if (game.modules.get("fxmaster")?.active && Gametime.isMaster() && this.showFX && this.weatherFX)
        Hooks.call("updateWeather", this.weatherFX);
    }
  
    setSeason(season) {
      this.season = season.name;
      if (season.temp == "-") {
        this.seasonTemp = -10
      } else if (season.temp == "+") {
        this.seasonTemp = 10
      } else {
        this.seasonTemp = 0
      }
      if (season.humidity == "-") {
        this.seasonHumidity = -1
      } else if (season.humidity == "+") {
        this.seasonHumidity = 1
      } else {
        this.seasonHumidity = 0
      }
      this.seasonRolltable = season.rolltable
      this.dawn = season.dawn
      this.dusk = season.dusk
      let icon = document.getElementById('season-indicator');
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
          // icon.style.color = "#000"
          break
      }
      this.seasonColor = season.color;
    }
  
    lightCycle() {
      let dt = Gametime.DTNow();
      let newDarkness = 0;
      if (this.doNightCycle && Gametime.isMaster()) {
        if (this.precipitation == game.i18n.localize("MorrsliebFull") && game.data.system.data.name == "wfrp4e" && Gametime.isMaster()) {
          if (!canvas.scene.getFlag("wfrp4e", "morrslieb")) {
            console.log("calendar-weather | Activating Morrslieb")
            WFRP_Utility.toggleMorrslieb()
          }
        } else if (this.precipitation != game.i18n.localize("MorrsliebFull") && game.data.system.data.name == "wfrp4e" && Gametime.isMaster()) {
          if (canvas.scene.getFlag("wfrp4e", "morrslieb")) {
            console.log("calendar-weather | Deactivating Morrslieb")
            WFRP_Utility.toggleMorrslieb()
          }
        }
        let fullMoonMod = 0
        let bloodMoon = false;
        cwdtData.dt.moons.forEach((moon, index) => {
          if(moon.cyclePercent > 90)
            fullMoonMod = 0.15
          if(document.getElementById(`calender-moon-symbol-${index}`).src.includes('totalLEclipse.png'))
            bloodMoon = true;
        });
        let dawn = this.dawn;
        let dusk = this.dusk;
        if (this.climate == "polar") {
          if (this.seasonTemp > 0) {
            dawn = 1
            dusk = 23
          } else if (this.seasonTemp < 0) {
            dawn = 11
            dusk = 13
          }
        }
        if (dt.hours == dawn) {
          // console.log("calendar-weather | Starting dawn cycle.")
          newDarkness = (1 - fullMoonMod) - (dt.minutes * 60 + dt.seconds) * 0.0002778;
          canvas.scene.update({
            darkness: newDarkness
          })
        }

        let eclipse = false;
        cwdtData.dt.moons.forEach((moon, index) => {
          if(document.getElementById(`calender-moon-symbol-${index}`).src.includes('Eclipse'))
            eclipse = true;
        })

        if (dt.hours >= dawn + 1 && dt.hours < dusk && canvas.scene.data.darkness > 0 && !eclipse) {
          console.log("calendar-weather | It is now day.")

          if(game.settings.get('calendar-weather', 'noGlobal') && !canvas.scene.data.globalLight && canvas.scene.data.flags.cwGlobalIllumination){
            canvas.scene.update({
              globalLight: true
            })
          }

          if(game.modules.get("fxmaster")?.active && Gametime.isMaster() && this.showFX && canvas.scene.getFlag('fxmaster', 'filters') && canvas.scene.getFlag('fxmaster', 'filters').bloodMoon){
            Hooks.call("switchFilter", {
              name: "bloodMoon",
              type: "color",
              options: {},
            })
          }
          canvas.scene.update({
            darkness: 0
          }, {
            animateDarkness: true
          })
          canvas.scene.setFlag("core", "darknessColor", CONFIG.Canvas.darknessColor)
          if (dt.hours == 7) {
            canvas.draw();
          }
        }
        if (dt.hours == dusk) {
          newDarkness = (dt.minutes * 60 + dt.seconds) * 0.0002778;
          
          if(game.modules.get("fxmaster")?.active && Gametime.isMaster() && this.showFX && bloodMoon){
            Hooks.call("switchFilter", {
              name: "bloodMoon",
              type: "color",
              options: { red: 1, green: 0, blue: 0.2 },
            })            
          }

          canvas.scene.update({
            darkness: (newDarkness - fullMoonMod)
          })
        }
        if ((dt.hours >= dusk + 1 || dt.hours < dawn) && canvas.scene.data.darkness < 1 - fullMoonMod) {
          console.log("calendar-weather | It is now night.")

          if(game.settings.get('calendar-weather', 'noGlobal') && canvas.scene.data.globalLight){
            canvas.scene.update({
              'flags.cwGlobalIllumination': true,
              globalLight: false
            })
          }

          canvas.scene.update({
            darkness: (1 - fullMoonMod)
          }, {
            animateDarkness: true
          })
          if (dt.hours == 0) {
            canvas.draw();
          }
        }
      }
    }
  }
  
