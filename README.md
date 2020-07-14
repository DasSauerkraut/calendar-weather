# calendar-weather
A customizable module that accurately tracks and displays dates and time.
## Links:
* Manifest: https://raw.githubusercontent.com/DasSauerkraut/calendar-weather/master/module.json
* Direct Link: https://github.com/DasSauerkraut/calendar-weather/raw/master/package/calendar-weather-v2.5.2.zip

This module **REQUIRES** [about-time](https://gitlab.com/tposney/about-time) v0.1.18 or greater installed and loaded to function correctly.
If you want to have weather effects, you must have [FXMaster](https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster) by U~Man installed and loaded.
## Features:
* Customizable and draggable calendar that handles arbitrarily long weeks, months, and years.
* Intercalary day handling.
* Moon Phase tracking for an arbitrary amount of moons. Moons can also have eclipses which have fun effects tied to them via FXMaster.
* Real time time tracking at customizable speeds through about-time.
* Event tracking: Calendar/Weather can handle reoccuring yearly events, like holidays as well as one time events that occur once before being deleted. One time events can also be triggered at a specific time, rather than the event triggering at midnight. You can drag and drop journal entries into the text field for events. Furthermore, events can fire macros when they're triggered. The @@JournalEntry[] syntax will send the contents of the journal entry to chat, rather than just the link.
* Weather System: Clicking the sun/cloud icon will pull up a small widget that allows you to change between Farenheit/Celcius, regenerate the days weather, and set the climate your party is currently in. Weather is generated every day at midnight. Each time weather is generated, a message will be displayed to chat, you can turn this off in the settings.
* Day/Night Cycle: If the 'Calendar/Weather - Night Cycle and Weather Effects' setting is enabled, it will begin to grow dark at the specified dusk time for the season, and grow bright at the season's dawn time.
* FXMaster Weather Integration: If you have U~man's FXmaster module installed, each time weather is generated, a corresponding effect will be applied to the current scene. This is enabled on a scene by scene basis by the 'Calendar/Weather - Night Cycle and Weather Effects' setting located in the scene config form.
### Demo:
[![Demo Video](https://img.youtube.com/vi/EZDmYGKMkFI/0.jpg)](https://youtu.be/EZDmYGKMkFI)

### Controls:
![control menu](https://i.imgur.com/1aCVPXG.png)
![weather menu](https://i.imgur.com/ZSRuAub.png)
