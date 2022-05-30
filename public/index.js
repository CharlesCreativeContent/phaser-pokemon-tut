var rainbow;
var i = 0;
var color = `hsl(${i},100%,50%)`;
var title;

let input = document.getElementById("input-box");
//Buttons
let loginButton = document.querySelector(".login");
let signUpButton = document.querySelector(".signup");
let mainButton = document.querySelector("h3");
let settingsButton = document.querySelector(".settings");
let creditsButton = document.querySelector(".credits");
//Forms
let loginForm = document.querySelector("#login-form");
let signUpForm = document.querySelector("#signup-form");
let settingsForm = document.querySelector("#settings-form");
let creditsForm = document.querySelector("#credits-form");
let secondWindow =
document.getElementById("second-window")



class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {

  // add clickMe test
  title = this.add
    .text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "CryptoMon",
      {
    font: "50px Roboto Condensed",
    fill: "#fff"
  });
  title.setStroke("#000000", 8);
  title.setShadow(2, 2, "#00ff00", 2, true, true).setDepth(3).setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {

      if (input && input.style.display === "none") {
        input.style.display = "block";

        mainButton.addEventListener("click", showMain);
        loginButton.addEventListener("click", showLogin);
        creditsButton.addEventListener("click", showCredits);
        settingsButton.addEventListener("click", showSettings);
        signUpButton.addEventListener("click", showSignUp);
      }
    });

    // scale the box
    const scaleBox = (scale) => {
      let box = document.getElementById("input-box");
      if (box) {
        title.setScale( window.innerWidth < 800 ? 2.5 :window.innerWidth < 1100 ? scale : 1)
        box.style.transform = `scale(${scale})`;
        box.style.transformOrigin = "top left";
        box.style.top = `${
          this.game.canvas.offsetTop +
          this.scale.displaySize.height / 2 -
          (250 / 2) * scale
        }px`;
        box.style.left = `${
          this.game.canvas.offsetLeft +
          this.scale.displaySize.width / 2 -
          (300 / 2) * scale
        }px`;
      }
    };

    // initial scale
    let scale = window.innerWidth < 1281 ?
    this.game.scale.displaySize.width / this.game.scale.gameSize.width :
    2 * (this.game.scale.displaySize.width / this.game.scale.gameSize.width)
    scaleBox(scale);

    // on resize listener
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      let scale = displaySize.width / gameSize.width
      scaleBox(window.innerWidth < 1281 ? 2 * scale : scale);
    });
  }

  update(){

    color = `hsl(${i},100%,50%)`;
    title.setShadow(2, 2, color, 2, true, true)

    document.querySelectorAll(".rainbow, button:hover").forEach(button=>{
      button.style.border = `1px solid ${color}`
      button.style.color = color
    })

    document.querySelectorAll("h3:hover, label:hover").forEach(button=>{
      button.style.color = color
    })


    i+=2
        if (i === 360) {
          i = 0;
        }
  }
}

var config = {
  type: Phaser.AUTO,
    mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    transparent: true,
  scale: {
    parent: "phaser-example",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.AUTO,
  width: 1000,
  height: 500
  },
  scene: [MainScene]
};

var game = new Phaser.Game(config);

function showLogin() {
  loginForm.style.display = "block";
  secondWindow.style.display = "none";
}

function showSignUp() {
  signUpForm.style.display = "block";
  secondWindow.style.display = "none";
}

function showCredits() {
  creditsForm.style.display = "block";
  secondWindow.style.display = "none";
}

function showSettings() {
  settingsForm.style.display = "block";
  secondWindow.style.display = "none";
}

function showMain() {
  secondWindow.style.display = "block";
  loginForm.style.display = "none";
  settingsForm.style.display = "none";
  creditsForm.style.display = "none";
  signUpForm.style.display = "none";
}
