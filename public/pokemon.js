
let userData = {};
let game;

/////STATIC VARIBALES///////
const BLOCK_SIZE = 50; //px//
let WALK_SPEED = 5; //px//
let MONSTER_FEAR = 0.99; //Probability of seeing pokemon

//////START THE MUSIC/////////
var worldMusic = new Audio("https://dl.dropboxusercontent.com/s/0s83me8ndbkj1oa/Pok%C3%A9mon_LoFi.mp3?dl=0")
worldMusic.loop = true
worldMusic.play()

const gameState = {
  counter: 0,
  active: true,
  background: null,
  blackness: {},
  body: document.querySelector("body"),
  result: [],
  currentDirection: null,
  map: [],
  mapHeight: window.innerHeight,
  mapWidth: window.innerWidth,
  fadeIn: camera=>camera.main.fadeIn(1300, 0, 0, 0),
  fadeOut: camera=>camera.main.fadeOut(1300, 0, 0, 0),
  move: [
    function () {
      gameState.player.anims.play("runDown", true);
      gameState.player.y += WALK_SPEED;
      user.walkDown = WALK_SPEED
    },
    function () {
      gameState.player.anims.play("runLeft", true);
      gameState.player.x -= WALK_SPEED;
      user.walkLeft = WALK_SPEED
    },
    function () {
      gameState.player.anims.play("runRight", true);
      gameState.player.x += WALK_SPEED;
      user.walkRight = WALK_SPEED
    },
    function () {
      gameState.player.anims.play("runUp", true);
      gameState.player.y -= WALK_SPEED;
      user.walkUp = WALK_SPEED
    }
  ],
  toggleCutscene: function(){
    gameState.cutscene ? gameState.cutscene = null : gameState.cutscene = true
  },
  stopPlayerMovement: function(){
    gameState.currentDirection = null
  },
  sceneIn: function(camera){
    gameState.fadeIn(camera)
    setTimeout(gameState.toggleCutscene,600)
  },
  sceneOut: function(camera){
    gameState.toggleCutscene()
    gameState.fadeOut(camera)
  },
};



adjustMap()




class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    for(let img in Images){
      let imgInfo = Images[img]
      if(imgInfo.type==="image") this.load.image(img, imgInfo.img);
      if(img===user.skin || imgInfo.type==="gif") this.load.spritesheet(img, imgInfo.img, {
          frameWidth: imgInfo.frameWidth,
          frameHeight: imgInfo.frameHeight
        });
    }
  }

  create() {
    checkForUserData()

    //clear moveBackground
    gameState.body.style.backgroundImage = "none"
    gameState.body.style.backgroundColor = "black"


  gameState.pointer = this.input.activePointer;


  loadBackgroundAnimations(this)


//make buttons appear

toggleDPad()
    //creates background for map

    gameState.background = moveBackground(this)
    // paintMap(this)
    //Turns on key inputs
    gameState.cursors = this.input.keyboard.createCursorKeys();

    developerMode(this)

    gameState.player = this.add.sprite(user.x, user.y, user.skin);

    gameState.player.setDepth(1)

    //if skin needs to be bigger, set scale
    if(Images[user.skin].scale) gameState.player.setScale(Images[user.skin].scale)

    gameState.cameras = this.cameras
    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);

    adjustCamera(this.cameras)

    loadUserRunAnimations(this)

          //clear Loading
          document.querySelector("#blink_me").remove()


    //pokeball Menu Appears
    menuAppear();

  }


  update() {
    //sets up mouse clicks and mobile touch
    gameState.stopPlayerMovement()

    gameState.pointer = this.input.activePointer;

    mouseClick()


      //Initializes movement for keyboard
      userAnimation();

      //stops user for cutscenes
      if(gameState.cutscene) gameState.stopPlayerMovement()

    if (gameState.move[gameState.currentDirection] && verifyNextStep(gameState.currentDirection) ) {

      gameState.move[gameState.currentDirection]();

      lookAround(this.cameras,this);

    }
  }
}

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    parent: "game",
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  inputTouch: true,
  transparent: true,
  pixelArt: true,
  roundPixels: false,
  audio: { noAudio: false },
  physics: {
    default: "arcade",
    arcade: {
      enableBody: true
    }
  },
  scene: [MainScene]
};

game = new Phaser.Game(config);



function loadBackgroundAnimations(game){

  for(let gif in Images){
    let img = Images[gif]
    if(img.type === "gif" ){

      game.anims.create({
        key: gif,
        frames: game.anims.generateFrameNumbers(gif, {
          start: 0,
          end: img.frames-1
        }),
        frameRate: 7,
        repeat: -1,
      });

    }
  }
}



function adjustCamera(camera){
camera.main.setBounds(0, 0, gameState.mapWidth, gameState.mapHeight);
}



function adjustMap(){
gameState.map = Routes[user.location];
gameState.mapHeight = BLOCK_SIZE * gameState.map.length;
gameState.mapWidth = BLOCK_SIZE * gameState.map[0].length;
}




function moveBackground(wholeGame){
  let location = user.location
  let imgInfo = Images[location]
  let image = imgInfo.img
  let scale = imgInfo.scale
  let type = imgInfo.type
  if(location === "Center") updateCenterMap()
  if(type==="gif"){
    let frameWidth = imgInfo.frameWidth
    let frameHeight = imgInfo.frameHeight
    let back = wholeGame.add.sprite(0, 0, location).setOrigin(0).setScale(scale)
    if(window.innerWidth>=frameWidth) {
      let other = wholeGame.add.sprite(frameWidth*scale, 0, location).setOrigin(0).setScale(scale).setFlipX(true)
      other.anims.play(location, true);
    }
    if(window.innerHeight>=frameHeight) {
      let other = wholeGame.add.sprite(0, frameHeight*scale, location).setOrigin(0).setScale(scale).setFlipY(true)
      other.anims.play(location, true);
    }
    if(window.innerHeight>=frameHeight && window.innerWidth>=frameWidth) {
      let other = wholeGame.add.sprite(frameWidth*scale, frameHeight*scale, location).setOrigin(0).setScale(scale).setFlipY(true).setFlipX(true)
      other.anims.play(location, true);
    }
    back.anims.play(location, true);
  return back
  }else{
  return wholeGame.add.image(0, 0, location).setOrigin(0).setScale(scale);
  }
}


//given coordinates
//returns block element in map
//or 0 if nothing found
function getBlock(x, y) {
  if (x < 0 || y < 0 || x >= gameState.mapWidth || y >= gameState.mapHeight) return 0;
  let xBlock = Math.round(x / BLOCK_SIZE);
  let yBlock = Math.round(y / BLOCK_SIZE);
  return gameState.map[yBlock][xBlock];
}


let getX = () => gameState.player.x;
let getY = () => gameState.player.y;
let getPlayerLocation = () => [getX(), getY()];
let getCurrentBlock = () => getBlock(getX(), getY());

let getCurrentIndex = () => [Math.round(getX() / BLOCK_SIZE), Math.round(getY() / BLOCK_SIZE)]

function verifyNextStep(direction) {
  if (direction === null) return 0;
  let [nextStepX, nextStepY] = getPlayerLocation();
  if (direction === 3) {
    nextStepY -= WALK_SPEED;
  } else if (direction === 2) {
    nextStepX += WALK_SPEED;
  } else if (direction === 1) {
    nextStepX -= WALK_SPEED;
  } else {
    nextStepY += WALK_SPEED;
  }
  return getBlock(nextStepX, nextStepY);
}

//function that triggers a monster attack
function checkForMonsters(camera) {
  let dice = Math.random();
  let encounter = Trainer.encounters[user.location]
  let userMaxLvl = Math.max(...user.team.map(pok=>pok.lvl))
  if (dice > MONSTER_FEAR) {
  gameState.sceneOut(camera)


//BattleStart Music
var battleMusic = new Audio("https://dl.dropboxusercontent.com/s/2nmns4lm4z5x51d/POKEMON-BATTLESTART.mp3?dl=0")
battleMusic.loop = true
battleMusic.play()


    let opponentStrength = Math.random()*100
    let opponentRarity = 3
    opponentRarity = opponentStrength > 95 && userMaxLvl > 50 ? 3 :
                         opponentStrength > 80 && userMaxLvl > 40 ? 2 :
                         opponentStrength > 60 && userMaxLvl > 30 ? 1 : 0
    encounter.max += opponentRarity*15
    encounter.min += opponentRarity*15
    save()
    if(user.difficulty!=="hard") encounter.max = userMaxLvl
    saveOpponent(Trainer.wild(encounter,opponentRarity))
    setTimeout(()=>{window.location.href = "./wild"},2000)
  }
}




function loadUserRunAnimations(game){
  game.anims.create({
    key: "runDown",
    frames: game.anims.generateFrameNumbers(user.skin, {
      start: 0,
      end: 3
    }),
    frameRate: 7,
    repeat: -1
  });

  game.anims.create({
    key: "runLeft",
    frames: game.anims.generateFrameNumbers(user.skin, {
      start: 4,
      end: 7
    }),
    frameRate: 7,
    repeat: -1
  });

  game.anims.create({
    key: "runRight",
    frames: game.anims.generateFrameNumbers(user.skin, {
      start: 8,
      end: 11
    }),
    frameRate: 7,
    repeat: -1
  });

  game.anims.create({
    key: "runUp",
    frames: game.anims.generateFrameNumbers(user.skin, {
      start: 12,
      end: 15
    }),
    frameRate: 7,
    repeat: -1
  });
}



//Grabs User Data from server to play Game
async function getUserData(stat) {
  //fetch user data from server
  var response;
  if (stat) {
    response = await fetch("/userData/" + stat);
    userData[stat] = await response.json().stat;
  } else {
    response = await fetch("/userData");
    userData = await response.json();
  }
}



function teleport(x,y){
  gameState.player.x = x
  gameState.player.y = y
  user.teleport = {location: user.location, x, y}
  save()
}

//Grabs User Map from server to play Game
async function getMap() {
  //fetch map from server
  var response = await fetch("/userMap");
  map = await response.json();
}



//runs controls for user animation
function userAnimation() {
  if (gameState.player) {
    if (gameState.cursors.down.isDown ) {
      gameState.currentDirection = 0;
    } else if (gameState.cursors.left.isDown ) {
      gameState.currentDirection = 1;
    } else if (gameState.cursors.right.isDown) {
      gameState.currentDirection = 2;
    } else if (gameState.cursors.up.isDown) {
      gameState.currentDirection = 3;
    } else if ( gameState.currentDirection === null || (gameState.cursors.right.isUp &&
      gameState.cursors.left.isUp &&
      gameState.cursors.down.isUp &&
      gameState.cursors.up.isUp && gameState.pointer.isUp)
    ) {
      gameState.player.setFrame(4 * (gameState.currentDirection === null? 0 : gameState.currentDirection));
      gameState.currentDirection = null;
    }
  }
}

//runs controls for user animation
function mouseClick() {
  if (gameState.pointer.isDown && window.innerWidth <= 1280) {
      let touchX = gameState.pointer.x;
      let touchY = gameState.pointer.y;
      let windowWidth = window.innerWidth
      let windowHeight = window.innerHeight
      let buttonWidth = windowWidth*(0.6)
      let buttonHeight = windowHeight * (0.3)
      let windowWidthCenter = windowWidth/2
      let windowHeightCenter = windowHeight-(buttonHeight/2)

      if( touchX > windowWidth*(0.2) && touchX < windowWidth*(0.8) && touchY > windowHeight - buttonHeight ){

      let middleLimits = [
          touchX > windowWidth*(0.4),
          touchX < windowWidth*(0.6),
          touchY > windowHeight - (buttonHeight*(2/3)),
          touchY < windowHeight - (buttonHeight*(1/3))
      ]

      if ( middleLimits.some(_=>_===false) ) {

          let leftCheck = touchX < (windowWidth*0.4) && touchY < windowHeight - (buttonHeight*(1/3)) && touchY > windowHeight - (buttonHeight*(2/3))
          let rightCheck = touchX > (windowWidth*0.6) && touchY < windowHeight - (buttonHeight*(1/3)) && touchY > windowHeight - (buttonHeight*(2/3))
          let upCheck = touchY < windowHeight - (buttonHeight*(2/3)) && touchX > windowWidth*(0.4) && touchX < windowWidth*(0.6)
          let downCheck = touchY > windowHeight - (buttonHeight*(1/3)) && touchX > windowWidth*(0.4) && touchX < windowWidth*(0.6)

          if(leftCheck) gameState.currentDirection = 1
          if(rightCheck) gameState.currentDirection = 2
          if(upCheck) gameState.currentDirection = 3
          if(downCheck) gameState.currentDirection = 0
      }
    }
  }
}





    function standardBLOCK_SIZE(image,opacity=0.5) {
      image.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
      image.setAlpha(opacity);
    }
    let addImageToMap = (x, y, imageName, game) =>
      game.add.image(x * BLOCK_SIZE, y * BLOCK_SIZE, imageName);
    function addStandardOpaqueImage(x, y, imageName, game){
      let currentImage = addImageToMap(x, y, imageName,game)
      standardBLOCK_SIZE(currentImage)
      return currentImage
    }



    //creates walking map for user
    function paintMap(game){
    gameState.map.forEach((row, y) => {
      row.forEach((num, x) => {
        if (num === 1) addStandardOpaqueImage(x, y, "green",game);
        if (num == 2) addStandardOpaqueImage(x, y, "red",game);
        if (num == 3) addStandardOpaqueImage(x, y, "blue",game);
      });
    });
    }


          function lookAround(camera,state) {
            let curretBlock = getCurrentBlock();
            if (curretBlock === 2) checkForMonsters(camera);
            if (curretBlock === "Center") openCenter(camera,state);
            if (curretBlock === "Shop") openShop(camera,state);
            if (curretBlock === "Mart") openMart(camera,state);
            if (typeof curretBlock === "object") {
            gameState.sceneOut(camera)
            gameState.counter++
            setTimeout(()=>{
            openDoor(camera,state);
            if(gameState.counter===3) {
              window.location.href = "./profile"
            }else{
              gameState.sceneIn(camera)
              paintMap(state)
            }

          } ,1500)
            }
          }

          //UI function to toggle mobile buttons

          function toggleDPad(){
        //make buttons appear
        if(window.innerWidth < 1280){
          document.querySelectorAll("button").forEach(element=>{element.style.display="block"})
        }else{
          document.querySelectorAll("button").forEach(element=>{element.style.display="none"})
        }
    }

          ///GAMESTATE FUNCTIONS


          function changeMap(local,camera,state){
            let { location, x, y } = local
            gameState.background.destroy()
            teleport(x,y)
            adjustMap()
            gameState.background = moveBackground(state)
            adjustCamera(camera)
          }

          function openDoor(camera,state,auto=false) {
            let local = {}
            if(auto){
              local.location = prompt("Destination?")
              local.x = +prompt("x-value of location")
              local.y = +prompt("y-value of location")
            }else{
              local = getBlock(getX(), getY())
            }
          user.teleport = local
          changeMap(local,camera,state)
          }


          function developerMode(game){

            game.input.keyboard.on('keydown-W', function(){
              localStorage.clear()
            })
            game.input.keyboard.on('keydown-T', function(){
              openDoor(game.camera,game,true)
            })
            game.input.keyboard.on('keydown-Z', function(){
              gameState.toggleCutscene()
            })
            game.input.keyboard.on('keydown-P', function(){
          gameState.player.x += 100
            })
            game.input.keyboard.on('keydown-L', function(){
          gameState.player.y += 100
            })

            game.input.keyboard.on('keydown-O', function(){
              gameState.result.forEach(position=>{
                Routes[user.location][+position[1]][position[0]] = 0
              })
              console.log(Routes[user.location])
            })

            game.input.keyboard.on('keydown-S', function(){
          let locationInfo = getCurrentIndex().map(_=>_*50)
              console.log({
                location:user.location,
                x:locationInfo[0],
                y:locationInfo[1],
              })
            })

          gameState.cursors.space.on("up", ()=>{
          let [x,y] = getCurrentIndex()
          if(! gameState.blackness[x]){
          gameState.blackness[x] = new Set()
          }
          gameState.blackness[x].add(y)
          },{once: true})

          gameState.cursors.shift.on("up", ()=>{
          let all = []
          for(let key in gameState.blackness){
          for(let num of [...gameState.blackness[key]]){
          all.push([key,num])
          }
        }
        gameState.result = all
      },{once: true})
    }


window.addEventListener("resize",function(){
  toggleDPad()
})

function openCenter(camera,state){

gameState.body.style.backgroundColor = "black"
gameState.sceneOut(gameState.cameras)
user.newStartPosition()
let local = {location:"Center",x:650,y:900}
user.teleport = local
changeMap(local,gameState.cameras,state)
gameState.sceneIn(gameState.cameras)
}

function updateCenterMap(){
  let route = Routes["Center"]
  let height = route.length-1
  Routes["Center"][height][13] = user.savePosition
}

function openShop(){
gameState.sceneOut(gameState.cameras)
setTimeout(()=>{
teleport(650,900)
save()
window.location.href = "./mart"
},1500)

}

function openBag(){
gameState.sceneOut(gameState.cameras)
window.location.href = "./bag"
}

function openMart(){
gameState.sceneOut(gameState.cameras)
setTimeout(()=>{
teleport(getX(),getY()+50)
user.newSavePosition()
save()
window.location.href = "./mart"
},1500)
}
function menuAppear() {
  let pokeball = document.getElementById("pokeball")
  pokeball.classList.toggle("disappear");
  pokeball.addEventListener("click",openBag)

}

function checkForUserData(){
  if(! localStorage.getItem("user")){
    window.location.href = "/start"
  }
}
