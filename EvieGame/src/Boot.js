class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        this.load.image('background', 'img/background.png');
        this.load.image('background-night', 'img/background-night.png');
        this.load.image('logo-enclave', 'img/logo-enclave.png');
        this.load.image('loading-background', 'img/loading-background.png');
        const newLocal = 'WesternGrit-Regular';
        //WebFont.load({ custom: { families: ['Saddlebag-Black'], urls: ['fonts/Saddlebag.css'] } }); //'fonts/Saddlebag.css
        WebFont.load({ 
            active: () => this.loaded = true,
            custom: { families: [newLocal], urls: ['fonts/WesternGrit.css'] } 
        }); //'fonts/Saddlebag.css
        /*WebFont.load({
            google: {
              families: ['Noto Sans JP'] // Pacifico
            }
          });*/
    }
    create() {
        EPT.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        EPT.Lang.updateLanguage('en');
        EPT.text = EPT.Lang.text[EPT.Lang.current];
        this.scene.start('Preloader');
    }
}