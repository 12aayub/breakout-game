import Phaser from 'phaser-ce'
import game from './main'

const mainState = {
  //like react constructor
  preload () {
    //background color for the game window
    game.stage.backgroundColor = '#3598db'
    //adds ARCADE physics for movement and collisions
    game.physics.startSystem(Phaser.Physics.ARCADE)
    //adds physics engine to all game objects
    game.world.enableBody = true
    //load image objects to game
    game.load.image('paddle', 'assets/paddle.png')
    game.load.image('brick', 'assets/box.png')
    game.load.image('ball', 'assets/ball.png')
    game.load.audio('coin', 'assets/coin.wav')
  },
  //initializes game objects, like a react render
  create () {
    //adds functionality to move paddle horizontally
    this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    //adds paddle sprite at 200x 400y
    this.paddle = game.add.sprite(200, 400, 'paddle')
    //sets property so that paddle doesn't move when ball hits it
    this.paddle.body.immovable = true
    this.paddle.body.collideWorldBounds = true
    this.sound = game.add.audio('coin')

    this.bricks = game.add.group()
    //creating all our bricks into a group to set properties together
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        const x = (i * 60) + 55
        const y = (j * 35) + 55
        const brick = game.add.sprite(x, y, 'brick')
        brick.body.immovable = true
        this.bricks.add(brick)
      }
    }
    this.ball = game.add.sprite(200, 300, 'ball')
    //sets initial velocity
    this.ball.body.velocity.x = 250
    this.ball.body.velocity.y = 250

    this.ball.body.bounce.setTo(1)
    //ball won't go out of game window
    this.ball.body.collideWorldBounds = true
  },
  //updating any game objects
  update () {
    if (this.left.isDown) {
      this.paddle.body.velocity.x = -500
    }
    else if (this.right.isDown) {
      this.paddle.body.velocity.x = 500
    }
    else {
      this.paddle.body.velocity.x = 0
    }
    //sets properties to have objects bounce off each other
    game.physics.arcade.collide(this.paddle, this.ball)
    //last 3 properties are setting callbacks for both functions
    game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this)
    //if ball's y-coordinate than paddle's, start game
    if (this.ball.y > this.paddle.y) {
      game.state.start('main')
    }
  },
      hit(ball, brick) {
        brick.kill()
        this.sound.play()
        if (this.bricks.length === 24) {
          this.win()
        }
      },
    win() {
      this.ball.body.velocity.x = 0
      this.ball.body.velocity.y = 0
      game.add.text(200, 300, 'YOU WIN!')
    }
}

export default mainState
