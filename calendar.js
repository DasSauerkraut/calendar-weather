class Calendar extends Application {

  /**
   * Define default options for the Calendar application
   */
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
  activateListeners(html){
    const nextDay = '#calendar-btn-right';
    const prevDay = '#calendar-btn-left'
    html.find(nextDay).click(ev => {
      ev.preventDefault();
      console.log("right");
      templateData.day += 1;
      console.log(templateData.day);
    })
  }
}

$(document).ready(() => {
  const templatePath = "modules/calendar-weather/templates/calendar.html";
  
  
  templateData = {
    month: 0,
    day: 0,
    year: 0,
    date: "new",
  }
  let c = new Calendar();
  // Settings
  Hooks.on('init', ()=> {
    game.settings.register('calendar-weather', 'testSetting', {
      name: "Test",
      hint: "This is just a test, it does nothing",
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  });

  Hooks.on('ready', ()=> {
    renderTemplate(templatePath, templateData).then(html => {
      c.render(true);
    });
  });
});