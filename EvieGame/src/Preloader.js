class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    preload() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        var logoEnclave = this.add.sprite(EPT.world.centerX, EPT.world.centerY-100, 'logo-enclave');
        logoEnclave.setOrigin(0.5, 0.5);
		var loadingBg = this.add.sprite(EPT.world.centerX, EPT.world.centerY+100, 'loading-background');
		loadingBg.setOrigin(0.5, 0.5);

		var progress = this.add.graphics();
		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffde00, 1);
			progress.fillRect(loadingBg.x-(loadingBg.width*0.5)+20, loadingBg.y-(loadingBg.height*0.5)+10, 540 * value, 25);
		});

		var resources = {
			'image': [
				['title', 'img/title.png'],
				['clickme', 'img/clickme.png'],
				['overlay', 'img/overlay.png'],
				['button-beer', 'img/button-beer.png'],
				['banner-beer', 'img/banner-beer.png'],
				['particle', 'img/particle.png']
			],
			'spritesheet': [
				['animals','img/animals4a.png', {frameWidth:206,frameHeight:140}],
				['objects','img/objects.png', {frameWidth:200,frameHeight:200}],
				['horse','img/horse_spritesheet.png', {frameWidth:70,frameHeight:70}],
				['camels','img/camels.png', {frameWidth:48,frameHeight:48}],
				['emus','img/emus.png', {frameWidth:70,frameHeight:70}],
				['cowgirl','img/cowgirl.png', {frameWidth:200,frameHeight:400}],
				['cowboy','img/cowboy.png', {frameWidth:200,frameHeight:400}],
				['cowgirl_horse','img/evie_horses.png', {frameWidth:350,frameHeight:230}],
				['lasso','img/lasso_sprite.png', {frameWidth:100,frameHeight:100}],
				['button-start', 'img/button-start.png', {frameWidth:180,frameHeight:180}],
				['button-continue', 'img/button-continue.png', {frameWidth:180,frameHeight:180}],
				['button-mainmenu', 'img/button-mainmenu.png', {frameWidth:180,frameHeight:180}],
				['button-restart', 'img/button-tryagain.png', {frameWidth:180,frameHeight:180}],
				['button-achievements', 'img/button-achievements.png', {frameWidth:110,frameHeight:110}],
				['button-settings', 'img/button-settings.png', {frameWidth:80,frameHeight:80}],
				['button-home', 'img/button-home.png', {frameWidth:80,frameHeight:80}],
				['button-pause', 'img/button-pause.png', {frameWidth:80,frameHeight:80}],
				['button-credits', 'img/button-credits.png', {frameWidth:80,frameHeight:80}],
				['button-sound-on', 'img/button-sound-on.png', {frameWidth:80,frameHeight:80}],
				['button-sound-off', 'img/button-sound-off.png', {frameWidth:80,frameHeight:80}],
				['button-music-on', 'img/button-music-on.png', {frameWidth:80,frameHeight:80}],
				['button-music-off', 'img/button-music-off.png', {frameWidth:80,frameHeight:80}],
				['button-back', 'img/button-back.png', {frameWidth:70,frameHeight:70}]
			],
			'audio': [
				['sound-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
				['music-theme', ['sfx/POL-tunnels-short.m4a','sfx/POL-tunnels-short.mp3','sfx/POL-tunnels-short.ogg']]
			]
		};
		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		};
    }
    create() {
		EPT.Sfx.manage('music', 'init', this);
		EPT.Sfx.manage('sound', 'init', this);
		EPT.fadeOutScene('MainMenu', this);
	}
}