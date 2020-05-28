export class WarningSystem {
    constructor() {}
  
    static validateAboutTime() {
      if (game.data.version === "0.5.1") {
        var aboutTime = game.modules.find(module => module.id === 'about-time' && module.active);
      } else {
        var aboutTime = game.modules.get("about-time") && game.modules.get("about-time").active;
      }
      if (!aboutTime && game.user.isGM) {
        return WarningSystem.generateDialog();
      }
    }
  
    static generateDialog() {
      new Dialog({
        title: game.i18n.localize("CWMISC.AboutTimeMissing"),
        content: game.i18n.localize("CWMISC.AboutTimeMissingHelp"),
        buttons: {
          one: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("CWMISC.AboutTimeGitlab"),
            callback: () => window.open('https://gitlab.com/tposney/about-time/-/tree/master/src', '_blank', "fullscreen=no")
          },
          two: {
            icon: '<i class="fas fa-times"></i>',
            label:  game.i18n.localize("CWMISC.Disregard"),
            callback: () => {}
          }
        },
        default: "two",
        close: () => {}
      }).render(true);
    }
  }
  