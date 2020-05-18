export const registerSettings = function(calendar) {
  game.settings.register('calendar-weather', 'dateTime', {
    name: "Date/Time Data",
    scope: 'world',
    config: false,
    // default: {},
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
    name: game.i18n.localize("CalDispNonGm"),
    hint: game.i18n.localize("CalDispNonGmHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'weatherDisplay', {
    name: game.i18n.localize("Weather2Chat"),
    hint: game.i18n.localize("Weather2ChatHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'moonDisplay', {
    name: game.i18n.localize("Moon2Chat"),
    hint: game.i18n.localize("Moon2ChatHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'is24', {
    name: game.i18n.localize("Display24H"),
    hint: game.i18n.localize("Display24HHelp"),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  // game.settings.register('calendar-weather', 'noGlobal', {
  //   name: game.i18n.localize("NoGlobal"),
  //   hint: game.i18n.localize("NoGlobalHelp"),
  //   scope: 'world',
  //   config: true,
  //   default: true,
  //   type: Boolean,
  // });
}
