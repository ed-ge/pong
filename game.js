let Scenes = {
  startScene: "StartScene",
  allScenes: [
    {
      name: "StartScene",
      objects: [
        {
          def: "Circle",
          componentValues: ["CircleComponent,radius, 1", "CircleComponent,fill,black"],
          components: ["BallBehavior"]
        },
        {
          def: "RectangleLeft, -10, 0, .01, .2, Rectangle",
        },
        {
          def: "RectangleRight, 10, 0, .01, .2, Rectangle",
        },
        {
          def: "RectangleTop, 0, -10, .2, .01, Rectangle",
        },
        {
          def: "Paddle, 0, 10, .05, .01, Rectangle",
          componentValues: ["RectangleComponent,fill,orange"],
          components: ["MovementBehavior"]
        },
        {
          def: "Camera, 0, 0, 10, 10, Camera",
        },
      ]
    }
  ]
}

let GameObjects = {

}

let GameBehaviors = {
  MovementBehavior: class MovementBehavior extends Base.Behavior {
    start() {
      this.speed = .5;
    }
    update() {
      if (Base.Input.keys['ArrowLeft']) {
        this.gameObject.x -= +this.speed
      }
      if (Base.Input.keys['ArrowRight']) {
        this.gameObject.x += +this.speed
      }
      let extents = 10 - 2.5;
      if (this.gameObject.x < -extents) {
        this.gameObject.x = -extents;
      }
      if (this.gameObject.x > extents) {
        this.gameObject.x = extents
      }

    }
  },
  BallBehavior: class BallBehavior extends Base.Behavior {
    start() {
      this.speed = .4;
      this.angle = -1;
      this.sceneChangeCountDown = 5;
    }
    update() {
      this.paddle = Base.SceneManager.currentScene.findByName("Paddle");
      let x = Math.cos(this.angle);
      let y = Math.sin(this.angle);
      this.gameObject.x += x * this.speed;
      this.gameObject.y += y * this.speed;

      if (this.paddle) {
        let extents = 10 - 1;
        if (this.gameObject.x > extents) {
          this.angle = Math.atan2(y, -x);
          this.gameObject.x = extents - .01;
        }
        if (this.gameObject.x < -extents) {
          this.angle = Math.atan2(y, -x);
          this.gameObject.x = -extents + .01
        }
        if (this.gameObject.y < -extents) {
          this.angle = Math.atan2(-y, x);
          this.gameObject.y = -extents + .01
        }

        if (this.gameObject.y > extents) {
          if (Math.abs(this.paddle.x - this.gameObject.x) < 2.5) {
            this.angle = Math.atan2(-y, x);
            this.speed *= 1.1;
          }
          else {
            Base.SceneManager.destroy(this.paddle);
          }
        }

      }
      else {
        this.sceneChangeCountDown -= .1;
        if (this.sceneChangeCountDown <= 0) {
          Base.SceneManager.currentScene = 0;
        }
      }
    }
  }
}



Base.main(GameObjects, GameBehaviors, Scenes);