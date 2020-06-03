const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

var createMenu = function (scene, x, y, items, onClick) {
    var menu = scene.rexUI.add.menu({
        x: x,
        y: y,

        items: items,
        createButtonCallback: function (item, i) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
                text: scene.add.text(0, 0, item.name, {
                    fontSize: '20px'
                }),
                icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10
                }
            })
        },

        easeIn: {
            duration: 500,
            orientation: 'y'
        },

        easeOut: {
            duration: 100,
            orientation: 'y'
        },

        // expandEvent: 'button.over'
    });

    menu
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        })
        .on('button.click', function (button) {
            onClick(button);
        })

    return menu;
}



class Story extends Phaser.Scene {
    constructor() {
        super('Story');
	}
	preload() { 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });      
	}
	
    create() {
		

		this.add.sprite(0, 0, 'background').setOrigin(0,0);

		this.player_choose1 = this.add.sprite(280, 480, 'cowgirl').setScale(0.7)
		this.player_choose2 = this.add.sprite(570, 480, 'cowboy').setScale(0.7)

		var fontStory = { font: '38px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 7, align: 'center' };
		var textStory = this.add.text(EPT.world.centerX, 100, EPT.text['screen-story-howto'], fontStory);
		textStory.setOrigin(0.5,0);

		var buttonContinue = new Button(EPT.world.width-20, EPT.world.height-20, 'button-continue', this.clickContinue, this);
		buttonContinue.setOrigin(1,1).setScale(0.5)

		buttonContinue.x = EPT.world.width+buttonContinue.width-200;
		this.tweens.add({targets: buttonContinue, x: EPT.world.width-200, duration: 500, ease: 'Back'});

		var buttonContinue2 = new Button(EPT.world.width-20, EPT.world.height-20, 'button-continue', this.clickContinue, this);
		buttonContinue2.setOrigin(1,1).setScale(0.5);

		buttonContinue2.x = 100;
		this.tweens.add({targets: buttonContinue2, x: EPT.world.width-500, duration: 500, ease: 'Back'});


		this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		this.keyEnter.on('down', function(key, event) { this.clickContinue(); }, this);

		this.cameras.main.fadeIn(250, 0, 0, 0);

		var items = [
            {
                name: 'AA',
                children: [
                    {
                        name: 'AA-0',
                        children: [
                            { name: 'AA-00' },
                            { name: 'AA-01' },
                            { name: 'AA-02' },
                        ]
                    },
                    {
                        name: 'AA-1',
                        children: [
                            { name: 'AA-10' },
                            { name: 'AA-11' },
                            { name: 'AA-12' },
                        ]
                    },
                    {
                        name: 'AA-2',
                        children: [
                            { name: 'AA-20' },
                            { name: 'AA-21' },
                            { name: 'AA-22' },
                        ]
                    },
                ]
            },
            {
                name: 'BB',
                children: [
                    { name: 'BB-0' },
                    { name: 'BB-1' },
                    { name: 'BB-2' },
                ]
            },
            {
                name: 'CC',
                children: [
                    { name: 'CC-0' },
                    { name: 'CC-1' },
                    { name: 'CC-2' },
                ]
            },
        ];

        var scene = this,
            menu = undefined;
        this.print = this.add.text(0, 0, '');
        this.input.on('pointerdown', function (pointer) {
            if (menu === undefined) {
                menu = createMenu(scene, pointer.x, pointer.y, items, function (button) {
                    scene.print.text += 'Click ' + button.text + '\n';
                });
            } else if (!menu.isInTouching(pointer)) {
                menu.collapse();
                menu = undefined;
                scene.print.text = '';
            }
        }, this);
	}
	clickContinue() {
		EPT.Sfx.play('click');
		EPT.fadeOutScene2('Game', 'HudOverlay', this);
	}
};