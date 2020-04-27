export class WeatherForm extends Application {
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

    setPos() {
      return new Promise(resolve => {
        function check() {
          let elmnt = document.getElementById("calendar-weather-container")
          if (elmnt) {
            let offset = document.getElementById("calendar-time-container")
            let pos = {
              left: offset.style.left.slice(0, -2),
              top: offset.style.top.slice(0, -2)
            }
            elmnt.style.left = (parseInt(pos.left) + offset.offsetWidth) + 'px';
            elmnt.style.top = (parseInt(pos.top) + 2) + 'px';
            resolve();
          } else {
            setTimeout(check, 30);
          }
        }
        check();
      })
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
        this.setPos();
      }
    }
  }