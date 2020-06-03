class HudOverlay extends Phaser.Scene {
	constructor() {
		super('HudOverlay') //{ key: 'HudOverlay', active: true })
    }
    
	create() {
        this._score = 0;
        this._level = 0;
		this._time = 60;
		this.stateStatus = null;
		this._gamePaused = false;
        this._runOnce = false;
		this.afterinit()
		this.rain()
		
    }

    afterinit() {
        console.log("after init")
		//  Our Text object to display the Score
		//let info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#000000' });
		var fontScore = { font: '38px ' + EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
		var fontScoreWhite = { font: '38px ' + EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 5 };
		this.textScore = this.add.text(EPT.world.width - 30, 45, EPT.text['gameplay-score'] + this._score, fontScore);
		this.textScore.setOrigin(1, 0);
		this.textScore.y = -this.textScore.height - 20;
        this.tweens.add({ targets: this.textScore, y: 45, duration: 500, delay: 100, ease: 'Back' });

        this.textLevel = this.add.text(EPT.world.width - 150, EPT.world.height - 30, EPT.text['gameplay-level'] + this._level, fontScore);
		this.textLevel.setOrigin(0, 1);
		//this.textLevel.y = -this.textScore.height - 40;
        //this.tweens.add({ targets: this.textLevel, y: EPT.world.height - 40, duration: 500, delay: 100, ease: 'Back' });

        this.textTime = this.add.text(30, EPT.world.height - 30, EPT.text['gameplay-timeleft'] + this._time, fontScore);
		this.textTime.setOrigin(0, 1);
		//  Grab a reference to the Game Scene
		this.ourGame = this.scene.get('Game');
		this.initUI();
		this.currentTimer = this.time.addEvent({
			delay: 1000,
			callback: function () {
				this.textTime.setText(EPT.text['gameplay-timeleft'] + this.ourGame._time);
			},
			callbackScope: this,
			loop: true
		});
        //  Listen for events from it
        const local_this = this
		this.ourGame.events.on('addScore', function () {
            console.log("SCORE "+this._score)
            this._score = this.ourGame._score;
			this.textScore.setText(EPT.text['gameplay-score'] + this.ourGame._score);
        }, this);
        this.ourGame.events.on('gameover', function () {
            console.log("gameover hud")
            //this._score = this.ourGame._score;
            this.stateGameover()
            //this.destroy()
        }, this);
        this.ourGame.events.on('newlevel', function () {
            console.log("new level")
            this._level+=1;
            this.textLevel.setText(EPT.text['gameplay-level'] + this._level);
            this.manageNewLevel()
            //this.destroy()
        }, this);
	}
	stateRestart() {
        EPT.Sfx.play('click');
        this.events.emit('restart');
        //EPT.fadeOutScene2('Game', 'HudOverlay', this);
	}
	stateBack() {
		EPT.Sfx.play('click');
		EPT.fadeOutScene('MainMenu', this);
	}
	initUI() {
		var fontScore = { font: '38px ' + EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
		var fontScoreWhite = { font: '38px ' + EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 5 };
		this.tweens.add({ targets: this.buttonPause, y: 20, duration: 500, ease: 'Back' });
		var fontTitle = { font: '48px ' + EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 10 };
		this.buttonPause = new Button(20, 20, 'button-pause', this.managePause, this);
		this.buttonPause.setOrigin(0, 0);
		this.screenPausedGroup = this.add.group();
		this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
		this.screenPausedBg.setAlpha(0.95);
		this.screenPausedBg.setOrigin(0, 0);
		this.screenPausedText = this.add.text(EPT.world.centerX, 100, EPT.text['gameplay-paused'], fontTitle);
		this.screenPausedText.setOrigin(0.5, 0);
		this.screenPausedBack = new Button(100, EPT.world.height - 100, 'button-mainmenu', this.stateBack, this);
		this.screenPausedBack.setOrigin(0, 1);
		//console.log(this.screenPausedBack)
		this.screenPausedContinue = new Button(EPT.world.width - 100, EPT.world.height - 100, 'button-continue', this.managePause, this);
		this.screenPausedContinue.setOrigin(1, 1);
		this.screenPausedGroup.add(this.screenPausedBg);
		this.screenPausedGroup.add(this.screenPausedText);
		this.screenPausedGroup.add(this.screenPausedBack);
		this.screenPausedGroup.add(this.screenPausedContinue);
		this.screenPausedGroup.toggleVisible();
		this.screenGameoverGroup = this.add.group();
		this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
		this.screenGameoverBg.setAlpha(0.95);
		this.screenGameoverBg.setOrigin(0, 0);
		this.screenGameoverText = this.add.text(EPT.world.centerX, 100, EPT.text['gameplay-gameover'], fontTitle);
		this.screenGameoverText.setOrigin(0.5, 0);
		this.screenGameoverBack = new Button(100, EPT.world.height - 100, 'button-mainmenu', this.stateBack, this);
		this.screenGameoverBack.setOrigin(0, 1);
		this.screenGameoverRestart = new Button(EPT.world.width - 100, EPT.world.height - 100, 'button-restart', this.stateRestart, this);
		this.screenGameoverRestart.setOrigin(1, 1);
		this.screenGameoverScore = this.add.text(EPT.world.centerX, 300, EPT.text['gameplay-score'] + this._score, fontScoreWhite);
		this.screenGameoverScore.setOrigin(0.5, 0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
		this.screenGameoverGroup.toggleVisible();
    }
    manageNewLevel() {
        self.stateStatus = 'paused';
        self._runOnce = false;

        EPT.fadeOutIn(function (self) {
            //self.buttonPause.input.enabled = false;
            //self.buttonDummy.input.enabled = false;		
        }, this);     
    }
	managePause() {
        console.log("here 1");
        this.events.emit('pause');
		this._gamePaused = !this._gamePaused;
		this.currentTimer.paused = !this.currentTimer.paused;
		this.ourGame._gamePaused = this._gamePaused;
		EPT.Sfx.play('click');
		if (this._gamePaused) {
			EPT.fadeOutIn(function (self) {
				//self.buttonPause.input.enabled = false;
				//self.buttonDummy.input.enabled = false;
				self.stateStatus = 'paused';
				self._runOnce = false;
			}, this);
			console.log("here 2.1 " + this._gamePaused);
			this.screenPausedBack.x = -this.screenPausedBack.width - 20;
			console.log("here 2.2 " + this._gamePaused);
			this.tweens.add({ targets: this.screenPausedBack, x: 100, duration: 500, delay: 250, ease: 'Back' });
			this.screenPausedContinue.x = EPT.world.width + this.screenPausedContinue.width + 20;
			this.tweens.add({ targets: this.screenPausedContinue, x: EPT.world.width - 100, duration: 500, delay: 250, ease: 'Back' });
			this.screenPausedGroup.toggleVisible();
			this.ourGame.update();
			console.log("done. " + this._gamePaused);
		}
		else {
			console.log("here 3");
			EPT.fadeOutIn(function (self) {
				//self.buttonPause.input.enabled = true;
				//self.buttonDummy.input.enabled = true;
				self._stateStatus = 'playing';
				self._runOnce = false;
			}, this);
			this.screenPausedBack.x = 100;
			this.tweens.add({ targets: this.screenPausedBack, x: -this.screenPausedBack.width - 20, duration: 500, ease: 'Back' });
			this.screenPausedContinue.x = EPT.world.width - 100;
			this.tweens.add({ targets: this.screenPausedContinue, x: EPT.world.width + this.screenPausedContinue.width + 20, duration: 500, ease: 'Back' });
			this.screenPausedGroup.toggleVisible();
		}
	}
	stateGameover() {
		//this.currentTimer.paused =! this.currentTimer.paused;
		EPT.Storage.setHighscore('EPT-highscore', this._score);
		EPT.fadeOutIn(function (self) {
			self.screenGameoverGroup.toggleVisible();
			//self.buttonPause.input.enabled = false;
			//self.buttonDummy.input.enabled = false;
			self.screenGameoverScore.setText(EPT.text['gameplay-score'] + self._score);
			self.gameoverScoreTween();
		}, this);
		this.screenGameoverBack.x = -this.screenGameoverBack.width - 20;
		this.tweens.add({ targets: this.screenGameoverBack, x: 100, duration: 500, delay: 250, ease: 'Back' });
		this.screenGameoverRestart.x = EPT.world.width + this.screenGameoverRestart.width + 20;
		this.tweens.add({ targets: this.screenGameoverRestart, x: EPT.world.width - 100, duration: 500, delay: 250, ease: 'Back' });
	}
	gameoverScoreTween() {
		this.screenGameoverScore.setText(EPT.text['gameplay-score'] + '0');
		if (this._score) {
			this.pointsTween = this.tweens.addCounter({
				from: 0, to: this._score, duration: 2000, delay: 250,
				onUpdateScope: this, onCompleteScope: this,
				onUpdate: function () {
					this.screenGameoverScore.setText(EPT.text['gameplay-score'] + Math.floor(this.pointsTween.getValue()));
				},
				onComplete: function () {
					var emitter = this.add.particles('particle').createEmitter({
						x: this.screenGameoverScore.x + 30,
						y: this.screenGameoverScore.y,
						speed: { min: -600, max: 600 },
						angle: { min: 0, max: 360 },
						scale: { start: 0.5, end: 3 },
						blendMode: 'ADD',
						active: true,
						lifespan: 2000,
						gravityY: 1000,
						quantity: 250
					});
					emitter.explode();
				}
			});
		}
	}

	rain() {
		//var particles = this.add.particles('particle');

		var emitter = this.add.particles('rain').createEmitter({
			x: {min: 0, max: 800},
			y: -100,
			speed: { min: 0, max: 100 },
			angle: { min: 15, max: 40 },
			scale: { start: 0.1, end: 0.5 },
			blendMode: 'ADD',
			active: true,
			lifespan: 10000,
			gravityY: 50,
			quantity: 1
		});
		this.time.addEvent({
			delay: 10000,
			callback: function () {
				//console.log(emitter)
				emitter.visible=!emitter.visible
			},
			callbackScope: this,
			loop: true
		});

/*
		var emitter = particles.createEmitter({
			frame: 'blue',
			x: {min: 0, max: 800},
			y: 0 ,
			lifespan: {min: 100, max: 400},
			speedY: 1500,
			scaleY: {min: 1, max:4},
			scaleX: .01,
			quantity: {min: 5, max: 15},
			blendMode: 'LIGHTEN',
		});*/
	}
}
