export const registerSettings = function(calendar) {
  game.settings.register('calendar-weather', 'dateTime', {
    name: "Date/Time Data",
    scope: 'world',
    config: false,
    type: Object,
    onChange: calendar.loadSettings.bind(calendar)
  });
  game.settings.register('calendar-weather', 'calendarPos', {
    name: "Calendar Position",
    scope: 'world',
    config: false,
    type: Object,
  });
  game.settings.register('calendar-weather', 'calendarDisplay', {
    name: game.i18n.localize("CWSETTING.CalDispNonGm"),
    hint: game.i18n.localize("CWSETTING.CalDispNonGmHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'weatherDisplay', {
    name: game.i18n.localize("CWSETTING.Weather2Chat"),
    hint: game.i18n.localize("CWSETTING.Weather2ChatHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'moonDisplay', {
    name: game.i18n.localize("CWMOON.2Chat"),
    hint: game.i18n.localize("CWMOON.2ChatHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'is24', {
    name: game.i18n.localize("CWSETTING.Display24H"),
    hint: game.i18n.localize("CWSETTING.Display24HHelp"),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'noGlobal', {
    name: game.i18n.localize("CWSETTING.NoGlobal"),
    hint: game.i18n.localize("CWSETTING.NoGlobalHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  // game.settings.register('calendar-weather', 'colorblindIcon', {
  //   name: game.i18n.localize("CWSETTING.Colorblind"),
  //   hint: game.i18n.localize("CWSETTING.ColorblindHelp"),
  //   scope: 'world',
  //   config: true,
  //   default: true,
  //   type: Boolean,
  // })
}
