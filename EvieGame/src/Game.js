class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture) {
	  super(scene, x, y, texture)
	  scene.add.existing(this)
	  scene.physics.add.existing(this)

	  this.setBounce(0.1);
	  //this.setCollideWorldBounds(true);
	  this.setScale(0.5); //.refreshBody()
  
	  //this.setCollideWorldBounds(true)
	}
  }

class Animal extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture) {
	  //texture = 'zebra'
	  super(scene, x, y, texture)
	  this.animal_name =texture
	  scene.add.existing(this)
	  scene.physics.add.existing(this)
	  this.follow = false
	  //this.setCollideWorldBounds(true)
	  this.anims.play(texture)

	  //this.setDisplaySize(305, 210);
	  this.scale = 0.8
	  this.setScale(this.scale);
	  this.setBounce(0.1);
	  this.max_speed = 120
	  this.golden=false
	}

	behave_individual(p1) {
		this.body.height=140*this.scale
		this.body.width=60*this.scale
		
		var vel = this.max_speed
			
		if (this.animal_name=='bird') {
			this.body.y=300;
			vel = this.max_speed*1.3
		}
	  
		if (Math.random()>0.98) {
			var go_left = true
			var dist = p1.x-this.x
			if (this.x<600) {
				go_left = false;
			} else if (this.x>this.world_length-600){
				go_left = true;
			} else if (!this.follow) {
				//  if its not following then do this
					if (dist<0)
						go_left = false;
					if (Math.abs(dist)<300) {
						//vel = 130
					} else {
						vel = 40
					}
					if (Math.random()>0.7)
						go_left = !go_left
			} else {
				// if it is following do this
				if (dist>0) {
					go_left = false
					vel = 30
				}
				
			}
			
			if (go_left) {
				this.setVelocityX(-vel)
				this.body.offset.x = 0
				this.flipX=false
			} else {
				this.setVelocityX(vel)
				this.body.offset.x = 140
				this.flipX=true
			}	
			
		}
  	}
  }

class Animals {
	constructor() {
		//this.scene = scene
		//this.animal_group=animals
		this.animal_group = null;
		this.golden = 3;
	}

	make(myscene,count) {

		var ag = this.animal_group
		var itr = 0;

		if (ag!==null) {
			ag.children.iterate(function (child) {
				if (itr<self.golden) {
					child.tint = 0xFFD700;
					child.golden = true
				} else
					child.tint = 0xffffff;
				itr+=1
				child.x = Phaser.Math.Between(600, myscene.world_length-600)
				//child.refreshBody()
				//ag.remove(child)
			},self)
			return this.animal_group
		} else {
			ag = myscene.add.group()
			//	{classType: Phaser.GameObjects.Sprite,
			//	defaultKey: null});
		}

		for(var i = 0; i < count; i++){
			var ani = new Animal(myscene, Phaser.Math.Between(600, myscene.world_length-600), 480,
										Phaser.Math.RND.pick(['zebra','buffalo','camel','bird','cow'])
			)
			ag.add(ani);
		}

		ag.children.iterate(function (child) {
			if (itr<this.golden) {
				child.tint = 0xFFD700;
				child.golden = true
			}
			itr+=1
		},this)

		//myscene.physics.add.collider(ag,this.platforms);
		
		this.animal_group = ag
		
		return this.animal_group
	}


	behave(p1) {
		this.animal_group.children.iterate(function (child) {
			//  Give each star a slightly different bounce
			child.behave_individual(p1)
		});
	}

	reset() {

	}

}

  class Lasso extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture) {
	  super(scene, x, y, texture)
	  scene.add.existing(this)
	  scene.physics.add.existing(this)

	  this.setBounce(0.5);
	  //this.setCollideWorldBounds(true);
	  //this.setScale(2).refreshBody()
  
	  //this.setCollideWorldBounds(true)
	}
  }

class Game extends Phaser.Scene {
	
    constructor() {
		super('Game');
	}
	preload() {

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('cowgirl_horse', { start: 0, end: 1 }),
			frameRate: 8,
			repeat: -1
		});

		this.animal_names = ['zebra','buffalo','camel','bird','cow']

		for(var i = 0; i < 5; i++){
			this.anims.create({
				key: this.animal_names[i],
				frames: this.anims.generateFrameNumbers('animals', { start: i*2, end: i*2+1 }),
				frameRate: 8,
				repeat: -1
			});
		}

		this.objects = ['cactus1','cactus2','cactus3','rock1','rock2','house']

		for(var i = 0; i < 6; i++){
			this.anims.create({
				key: this.objects[i],
				frames: this.anims.generateFrameNumbers('objects', { start: i, end: i }),
				frameRate: 0
			});
		}
	}

	init(startData) {
		if (startData.newGame) {
		  // set up new game data structures
		} else {
		  // load save
		}
		this.level = 0
	
		// kick off the UI overlay
		//this.scene.launch('HudOverlay').bringToTop()
		//this.scene.remove('HudOverlay')
		//this.scene.add('HudOverlay', HudOverlay, true, { x: 400, y: 300 });
		//this.scene.start('HudOverlay'); //bringToTop()
		//this.scene.get('HudOverlay').afterinit();
		//this.scene.get('HudOverlay').scene.bringToTop()
	}

	create_static_obj(key, count, y_pos) {
		var line = new Phaser.Geom.Line(200, y_pos,  this.world_length, y_pos)
		
		var s_obj = this.physics.add.staticGroup({key: key,classType: Phaser.GameObjects.Sprite,frameQuantity: count});
		s_obj.playAnimation(key);
		Phaser.Actions.RandomLine(s_obj.getChildren(),line);
		s_obj.getChildren().forEach(item => {
			//item.body.offset.x=100;
			item.body.height = 50;
			//item.body.offset.y = 500;
			//item.setOffset(0,200);
			item.y-=Math.random()*20
			item.setScale(1.0);
			//item.refresh()
		});
		//s_obj.body.offset.y = 100;
		s_obj.refresh();
		return s_obj;
	}
	
    create() {
		this.world_length=800*10
		this.level =0;
		console.log(this.level)
		this.cameras.main.setBounds(0, 0, this.world_length,  EPT.world.height);
        this.add.tileSprite(0, 0, 800*10, EPT.world.height,'background').setOrigin(0,0);
        this.stateStatus = null;
        this._score = 0;
        this._time = 60;
		this._gamePaused = false;
		this._runOnce = false;
		this.lasso_thrown = false;
		this.lasso_animal = null;
		this.left_home = false;

		this.currentTimer = this.time.addEvent({
			delay: 1000,
			callback: function () {
				this._time--;
				if (this._time==0) {
					console.log(this.stateStatus)
					this.events.emit('gameover');
					this._runOnce = false;
					this.stateStatus = 'gameover';
					console.log(this.stateStatus)
				}
			},
			callbackScope: this,
			loop: true
		});

		this.cursors = this.input.keyboard.createCursorKeys();

		var base=630

		// Background Ground

		this.create_static_obj('cactus2',40,360);
		this.create_static_obj('cactus1',20,420);
		
		
		
		// Player

		  
		this.player1 = new Player(this, 80, 480, 'cowgirl_horse')
		this.player1.setVelocityX(180);
		this.player1.flipX=true

		this.cameras.main.startFollow(this.player1, true, 0.5, 0.5 )
	  
		
		this.lasso = new Lasso(this, 400, 100, 'lasso')
		this.lasso.setScale(0.5);
		//this.lasso.body.height=30
	  	//this.lasso.body.width=30
	

		this.player1.anims.play('left')

		this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xFFFFFF } });

    	this.line = new Phaser.Geom.Line(200, 300, 600, 300);

		this.platforms = this.physics.add.staticGroup();
		var ground=this.platforms.create(100, 550, 'ground').setScale(800,0.1).refreshBody();
		ground.alpha=0;

		// Animals

		this.animal_group = new Animals()
		this.animals = this.animal_group.make(this,20)

		// Fore Ground

		var house = this.create_static_obj('house',2,430);
		var itr = 0
		house.getChildren().forEach(thisobj => {
			if (itr==1)
				thisobj.x=this.world_length-200; 
			 else
				thisobj.x=100;
			thisobj.y=430;
			thisobj.body.height = 300;
			thisobj.body.width = 300;
			//thisobj.setOffset(0,200);
			thisobj.setScale(1.8);
			itr+=1
			
		});
		house.refresh()



		this.create_static_obj('cactus3',20,490);		
		this.create_static_obj('rock1',20,520);
		var rocks = this.create_static_obj('rock2',20,540);
		
		
		this.physics.add.collider(this.animals,this.platforms);
		this.physics.add.overlap(this.lasso, this.animals, this.catchAnimal, null, this);
		this.physics.add.collider(this.player1, this.platforms);
		this.physics.add.overlap(this.player1, house, this.backHome, null, this);
		//this.physics.add.collider(this.player1, rocks);
		this.physics.add.overlap(this.lasso, this.platforms, this.lassoDone, null, this);

		this.input.keyboard.on('keydown', this.handleKey, this);

		this.input.on('pointerdown', this.handleTouch, this)
        this.cameras.main.fadeIn(250);
		this.stateStatus = 'playing';

		console.log(this.games_count)


		this.hud = this.scene.get('HudOverlay');
        //  Listen for events from the hud
		this.hud.events.on('restart', function () {
			this.stateRestart()
		}, this);
		this.hud.events.on('pause', function () {
				this._gamePaused = !this._gamePaused;
				this.currentTimer.paused = !this.currentTimer.paused;
				if (this._gamePaused) {
					self.stateStatus = 'paused';
					self._runOnce = false;
				}
		}, this);

		this.cameras.main.zoomTo(4, 3000);
		this.currentTimer = this.time.addEvent({
			delay: 3000,
			callback: function () {
				this.cameras.main.zoomTo(1.5, 3000);
			},
			callbackScope: this,
			loop: false
		});

		
	}


	backHome(player,house) {
		if (this.left_home) {
			this.animals = this.animal_group.make(this,20)
			this.animals.max_speed=120+this.level*10;
			this.left_home = false
			this.events.emit('newlevel');
			this.level +=1;
			this.player1.setVelocityX(180);
			this.player1.flipX=true
			this.player1.x=60
			this.lasso_animal = null;
			this.lasso_thrown = false;
		}
		if (this._time<55) {
			this.left_home = true
		} 
		this._time=60

	}

	catchAnimal(lasso,animal) {
		if (this.lasso_thrown && lasso.body.velocity.y>0) {
			//animal.disableBody(true, true);
			if (!animal.follow) {
				animal.follow = true
				this.lasso_thrown=false
				animal.tint = 0xff00ff;
				this.lasso_animal = animal;
				this.addPoints(animal)
				this.cameras.main.zoomTo(1.5, 2000);
			}
		}
	}
	lassoDone(lasso,platform) {
		this.lasso_thrown = false
		this.cameras.main.zoomTo(1.5, 2000);
	}

	update() {

		switch(this.stateStatus) {
			case 'paused': {
				if(!this._runOnce) {
					this.statePaused();
					this._runOnce = true;
					this.player1.setVelocityX(0);
					return;
				}
				break;
			}
			case 'gameover': {
				//if(!this._runOnce) {
					//this.events.emit('gameover');
					//this.stateGameover();
					this._runOnce = true;
					this.player1.setVelocityX(0);
					return;
				//}
				break;
			}
			case 'playing': {
				this.statePlaying();
			}
			default: {
			}
		}
		const p1=this.player1;

		this.animal_group.behave(p1);

		//Phaser.Geom.Line.Rotate(this.line, 0.02);
		this.line.x1 = this.player1.x
		this.line.y1 = this.player1.y

		this.line.x2 = this.lasso.x
		this.line.y2 = this.lasso.y

		if (!this.lasso_thrown) {
			if (this.lasso_animal===null) 
				this.tweens.add({targets: this.lasso, 
					y: this.player1.y, x:this.player1.x, 
					duration: 100, ease: 'Linear'});
			else {
				this.lasso.x = this.lasso_animal.x
				this.lasso.y = this.lasso_animal.y
			}
			
		}
		
		this.graphics.clear();
		this.graphics.strokeLineShape(this.line);

		//if (Math.random()>0.8) {
		//	this.animal.setVelocityX(10*(0.5-Math.random()))
		//}

	}
	handleTouch(pointer, currentlyOver) {
		console.log(pointer.y)
			
		if (pointer.isDown) {
			var touchX = pointer.x;
			var touchY = pointer.y;
			if (touchY<400) {
				this.handleKey('ArrowUp')
			}
			if (touchX<300) {
				this.handleKey('ArrowLeft')
			} else if (touchX>EPT.world.width - 300) {
				this.handleKey('ArrowRight')
			} else {
				this.handleKey('Space')
			}
		}
	}
	
    handleKey(e) {
		var code = e 
		if (Object.prototype.toString.call(e) !== '[object String]')
			code = e.code
        switch(code) {
            case 'KeyP': {
                this.managePause();
                break;
            }
            case 'KeyB': {
                this.stateBack();
                break;
            }
            case 'KeyT': {
                this.stateRestart();
                break;
			}
			case 'ArrowLeft': {
				this.player1.setVelocityX(-180);
				this.player1.flipX=false
				break
			}
			case 'ArrowRight': {
				this.player1.setVelocityX(180);
				//this.player1.anims.play('right')
				this.player1.flipX=true
				break
			}

			case 'ArrowDown': {
				this.player1.setVelocityY(400);
				break
			}
			
			case 'Space':
				{
					if (!this.lasso_thrown) {
						this.lasso_thrown=true;
						this.lasso_animal=null;
						this.lasso.x = this.player1.x
						this.lasso.y = this.player1.y

						var v1=this.player1.body.velocity
						console.log(v1)
						//this.lasso.body.setVelocity({x:320,y:-150});
						this.lasso.setVelocityX(v1.x*1.5)
						this.lasso.setVelocityY(-350)
						this.cameras.main.zoomTo(1, 500);
					}
					break;
				}
			case 'ArrowUp':
				{
					if (this.player1.body.touching.down) {
						this.player1.setVelocityY(-250);
					}
					break;
				}

            default: {
				this.player1.setVelocityX(0);
				console.log(e.code);
			}
        }
	}
	
	statePlaying() {
        if(this._time <= 0) {
            this._runOnce = false;
            this.stateStatus = 'gameover';
        }
	}
	statePaused() {
        this.screenPausedGroup.toggleVisible();
	}
	
    addPoints(animal) {
		var bonus=10
		if (animal.golden===true)
			bonus = 20
		this._score += bonus;
		//this.textScore.setText(EPT.text['gameplay-score']+this._score);
		
		this.events.emit('addScore');
        
        var randX = Phaser.Math.Between(animal.x-30,animal.x+30);
        var randY = Phaser.Math.Between(animal.y-30, animal.y+30);
		var pointsAdded = this.add.text(randX, randY, '+'+bonus, { font: '48px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 10 });
		pointsAdded.setOrigin(0.5, 0.5);
        this.tweens.add({targets: pointsAdded, alpha: 0, y: randY-50, duration: 1000, ease: 'Linear'});

        this.cameras.main.shake(100, 0.01, true);
    }
	stateRestart() {
		EPT.Sfx.play('click');
		EPT.fadeOutScene2('Game', 'HudOverlay', this);
	}
	stateBack() {
		EPT.Sfx.play('click');
		EPT.fadeOutScene('MainMenu', this);
	}
};