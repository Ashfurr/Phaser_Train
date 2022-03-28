class scene extends Phaser.Scene {
  function

  preload() {
    /**
     * on load nos images objets + la tilemap et le fichier json
     */
    this.load.image('background', 'assets/images/background.png');
    this.load.image('door', 'assets/images/Door.png');
    this.load.image('key', 'assets/images/Key.png');
    this.load.image('spike', 'assets/images/spike.png');
    this.load.image('move', 'assets/images/mouvable.png');
    this.load.image('save', 'assets/images/Save.png');
    // At last image must be loaded with its JSON
    this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
    this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');

    this.load.image('grenouille','assets/images/vf2.png')
      this.load.image('sword','assets/images/sword.png')
  }


  create() {
      this.changementAI = false;
      let me=this;
      this.gauche = true;
      this.CD = true;
      this.tireD = false;
      /**
       * on initialise les valeurs de la sauvegarde
       * @type {number}
       */
      this.currentSaveX = 0;
      this.currentSaveY = 0;
      this.currentKey = 0;
      /**
       * creation de la map et du  layer plateforme
       * @type {Phaser.GameObjects.Image}
       */

      const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
      backgroundImage.setScale(2.5, 1.5);
      const map = this.make.tilemap({key: 'map'});
      const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');
      this.platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
      this.platforms.setCollisionByProperty({collides: true})


      /**
       * on créer les multiple groupe des layers objets
       * @type {Phaser.Physics.Arcade.Group}
       */
      /** groupe porte */
      this.doors = this.physics.add.group({
          allowGravity: false,
          immovable: true
      })
      map.getObjectLayer('Door').objects.forEach((doors) => {
          const DoorSprite = this.doors.create(doors.x, doors.y + 9 + doors.height, 'door').setOrigin(0).key = 1;
      });
     //cette porte nécessite 3 clefs

      /** groupe des clefs */
      this.key = this.physics.add.group({
          allowGravity: false,
          immovable: true
      })
      map.getObjectLayer('key').objects.forEach((key) => {
          const keySprite = this.key.create(key.x, key.y + 200 - key.height, 'key').setOrigin(0).key = 1;
      });


      this.lianne = this.physics.add.group({
          immovable: true,
          allowGravity: false,
      })

      map.getObjectLayer('Lianne').objects.forEach((lianne) => {
          this.lianneSprite = this.lianne.create(lianne.x, lianne.y + 200 - lianne.height, 'move').setOrigin(0);
      });

      this.player = new Player(this)

      this.cursors = this.input.keyboard.createCursorKeys();
      this.cameras.main.startFollow(this.player.player);

      this.sword = this.physics.add.sprite(200, 100, "sword").setScale(0.1,0.1);
      this.sword.body.setAllowGravity(false);
      this.sword.setDepth(1);
      this.sword.setVisible(false);
      this.sword.attack = 100
      this.sword.disableBody()

      this.ai = this.physics.add.sprite(1100, 300, 'grenouille').setOrigin(0, 0);
      this.ai.setDisplaySize(50,75);
      this.ai.body.setAllowGravity(true);
      this.ai.setVisible(true);
      this.stop = this.ai.x

      this.physics.add.collider(this.ai, this.platforms);


  }
    Jump()
    {
        if(this.stop === this.ai.x && this.dist >=  110 ){
            this.ai.set
            this.ai.setVelocityY(-100);
        }
    }
    IaGesttion(){
        this.gauche = false;

        this.dist = Phaser.Math.Distance.Between(this.player.player.x,this.player.player.y,this.ai.x,this.ai.y)
        if (this.dist <= 300 ){
            if (this.player.player.x <= this.ai.x){
                this.ai.setVelocityX(-200)
                this.gauche = true;
            }
            else if(this.player.player.x >= this.ai.x) {
                this.ai.setVelocityX(200)
            }
            this.stop = this.ai.x;
            this.time.addEvent({ delay: 50, callback: this.Jump, callbackScope: this });

            if (this.dist <=  100 ){
                this.attackAi()
            }
        }
    }

    attackAi(){
        this.ai.setVelocityX(0);

        if(this.CD === true) {
            this.sword.y = this.ai.y + 47;

            if (this.gauche === true) {
                this.sword.x = this.ai.x - 10;
                this.sword.flipX = true;
            } else {
                this.sword.x = this.ai.x + 60;
                this.sword.flipX = false;
            }

            //On rend l'épée visible
            this.sword.setVisible(true);
            //On active le body de l'épée
            this.sword.enableBody()
            //On ajoute un event avec un delay qui fera disparaitre l'épée dans 50 ms
            this.time.addEvent({delay: 50, callback: this.onEvent, callbackScope: this});

        }else{
            this.time.addEvent({delay: 1000, callback: this.cd, callbackScope: this});
        }
    }
    cd()
    {
        this.CD = true;
        console.log("neuneu")
    }

    onEvent()
    {
        this.sword.disableBody()
        this.sword.setVisible(false);
        this.CD = false;
        console.log("on se retire")
    }

  update() {
      this.IaGesttion()
      switch (true) {
          case this.cursors.right.isDown:
              this.player.moveRight()
              break;
          case (this.cursors.space.isDown || this.cursors.up.isDown) && this.player.player.body.onFloor():
              this.player.jump()
              break;
          case this.cursors.left.isDown:
              this.player.moveLeft();
              break;

          default:
              this.player.stop();

      }
      if (this.player.player.onlianne) {
          switch (true) {
              case this.cursors.up.isDown:
                  this.player.player.onlianne=false
                  this.player.player.setVelocityY(-100);
                  this.player.player.body.setAllowGravity(true);
                  break;
              case this.cursors.down.isDown:
                  this.player.player.onlianne=false
                  this.player.player.setVelocityY(100);
                  this.player.player.body.setAllowGravity(true);
                  break;
              default:
                  this.player.player.onlianne=false
                  this.player.player.setVelocityY(0);
                  this.player.player.body.setAllowGravity(false)
                  break;
          }

      }
  }
}