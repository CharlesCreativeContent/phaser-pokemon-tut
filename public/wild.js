let UI = {
  imgTries:0,
  expPool: [],
  pokemonRendered:false,
  playerPokemon: user.mainPoke,
  enemyPokemon: opponent.mainPoke,
  moves: document.querySelector("#moves"),
  move1: document.querySelector("#move1"),
  move2: document.querySelector("#move2"),
  move3: document.querySelector("#move3"),
  move4: document.querySelector("#move4"),
  allMoves: [
    document.querySelector("#move1"),
    document.querySelector("#move2"),
    document.querySelector("#move3"),
    document.querySelector("#move4")],
  menu: document.querySelector("#options"),
  playerImg: document.querySelector("#playerImg"),
  enemyImg: document.querySelector("#enemyImg"),
  playerName: document.querySelector("#playerName"),
  enemyName: document.querySelector("#enemyName"),
  modalTitle: document.querySelector("#modal-title"),
  modalHeader: document.querySelector("#modal-header"),
  modalBody: document.querySelector("#modal-body"),
  itemBagTitle: document.querySelector("#itemBag-title"),
  itemBagHeader: document.querySelector("#itemBag-header"),
  itemBagBody: document.querySelector("#itemBag-body"),
  switchTeamBody: document.querySelector(".teamSwitch"),
  messageBoard: document.querySelector("#messageBoard"),
  messageBody: document.querySelector("#messageBody"),
  body: document.querySelector("body"),
  showMessageBoard: function(){
    toggleElementDisplay(UI.messageBoard)
  },
  updateMessageBody: function(message){
    UI.messageBody.innerHTML = message
  },
  hp: document.querySelector("#HP"),
  opponentHP: document.querySelector("#opponentHP"),
  renderBothPokemon: function(){

  renderPokemon( UI.playerImg )
  renderPokemon( UI.enemyImg , false )

  setTimeout(()=>{
    UI.imgTries++
    console.log(document.querySelector("#enemyImg"))
    if( document.images[1].naturalWidth === 0 ){
    renderPokemon( UI.playerImg )
    }
    if( document.images[0].naturalWidth === 0 ){
    renderPokemon( UI.enemyImg , false )
    }

    setTimeout(()=>{
      UI.imgTries++
      if( document.images[1].naturalWidth === 0 ){
      renderPokemon( UI.playerImg )
      }
      if( document.images[0].naturalWidth === 0 ){
      renderPokemon( UI.enemyImg , false )
      }

      setTimeout(()=>{
        UI.imgTries++
        if( document.images[1].naturalWidth === 0 ){
        renderPokemon( UI.playerImg )
        }
        if( document.images[0].naturalWidth === 0 ){
        renderPokemon( UI.enemyImg , false )
        }

        setTimeout(()=>{
          UI.imgTries++
          if( document.images[1].naturalWidth === 0 ){
          renderPokemon( UI.playerImg )
          }
          if( document.images[0].naturalWidth === 0 ){
          renderPokemon( UI.enemyImg , false )
          }
          UI.imgTries=0
        },200)
      },200)
    },200)
  },200)

  },
  endBattleSequence:function(){
    UI.showMessageBoard()
    toggleElementDisplay(UI.menu)
  },
  useMove: function(e){
  let name = e.target.innerHTML
    if(name!=""){
      UI.playerPokemon.chooseMove(name)
      UI.startBattle()
  }
  },
  setupAttackFunctions:function(){
    UI.allMoves.forEach(element=>{
      element.addEventListener("click",UI.useMove)
    })
  },

  updateNames: function(){
  UI.playerName.innerHTML = `${ UI.playerPokemon.name } <span>Lv ${ UI.playerPokemon.lvl }</span>`
  UI.playerName.className = "card-header "+UI.playerPokemon.types[0]
  UI.enemyName.innerHTML = `${ UI.enemyPokemon.name } <span>Lv ${ UI.enemyPokemon.lvl }</span>`
  UI.enemyName.className = "card-header "+UI.enemyPokemon.types[0]
  },

  updatePlayerHP: function(num){
  UI.blink()
  UI.playerPokemon.damage(num)
  let percentage = UI.playerPokemon.getLifePercentage()


  if(percentage<50) UI.hp.className="progress-bar bg-warning"
  if(percentage<25) UI.hp.className="progress-bar bg-danger"

  UI.hp.innerHTML = `${UI.playerPokemon.hp}`
  UI.hp.style.width = `${percentage}%`
  },

  updateEnemyHP: function(num){
  UI.blinkOpp()
    UI.enemyPokemon.damage(num)
    let percentage = UI.enemyPokemon.getLifePercentage()

    if(percentage<50) UI.opponentHP.className="progress-bar bg-warning"
    if(percentage<25) UI.opponentHP.className="progress-bar bg-danger"

  UI.opponentHP.style.width = `${percentage}%`
  },
  refreshPokemon: function(){
    UI.playerPokemon= user.mainPoke;
    UI.enemyPokemon= opponent.mainPoke;
  },

  blink: function(){
let blinking = setInterval(()=>{
  UI.playerImg.classList.toggle("blink")
},800)


    UI.hp.classList.toggle("progress-bar-animated")
    UI.hp.classList.toggle("progress-bar-striped")
    setTimeout(()=>{
      clearInterval(blinking)
        UI.hp.classList.toggle("progress-bar-animated")
        UI.hp.classList.toggle("progress-bar-striped")
        UI.playerImg.classList.remove("blink")
    },4000)
  },
  blinkOpp: function(){
let blinking = setInterval(()=>{
  UI.enemyImg.classList.toggle("blink")
},800)

    UI.opponentHP.classList.toggle("progress-bar-animated")
    UI.opponentHP.classList.toggle("progress-bar-striped")
    setTimeout(()=>{
    UI.opponentHP.classList.toggle("progress-bar-animated")
    UI.opponentHP.classList.toggle("progress-bar-striped")

      clearInterval(blinking)

        UI.enemyImg.classList.remove("blink")
    },4000)
  },

  delayClick:function(action){
    setTimeout(()=>{
    UI.body.addEventListener("click",action,{once:true})
    },1000)
  },
  battleSequence: function(step){
    let {message,action} = step
    //play sound
    UI.updateMessageBody(message)
    UI.delayClick(action)
    save()
},
battleLoop: function(poke1,poke2,endFunction=false){

UI.battleSequence( {message:poke1.intro(),action:()=>{
  let hit = Poke.accuracyTest(poke1,poke2)
  let nextMessage=""
  if(hit){
    nextMessage=Poke.attackMessage(poke1,poke2)
    let damage =Poke.attack(poke1,poke2)
    poke2.player ? UI.updatePlayerHP(damage) : UI.updateEnemyHP(damage)
    poke2.isDead() ? UI.battleSequence({message:poke2.outro(),action:(poke2.player?UI.playerFaint:UI.opponentFaint)}) : UI.battleSequence( {message:nextMessage,action:()=>{
      endFunction?UI.endBattleSequence():UI.battleLoop(poke2,poke1,true)
    }})
  }else{
    UI.battleSequence( {message:"It missed!",action:()=>{
      endFunction?UI.endBattleSequence():UI.battleLoop(poke2,poke1,true)
    }})
  }
}

})
},

startBattle: function(){
UI.playerPokemon["player"] = true
UI.enemyPokemon["player"] = false
let moveName = UI.playerPokemon.currentMove
let moveInfo = Moves[moveName]
UI.enemyPokemon.chooseMove()
let enemyMoveName = UI.enemyPokemon.currentMove
let enemyMoveInfo = Moves[enemyMoveName]
console.log(moveName+": ",moveInfo)
console.log(enemyMoveName+": ",enemyMoveInfo)
  toggleElementDisplay(UI.moves)
  UI.showMessageBoard()

    let fast= Poke.speedTest(UI.playerPokemon,UI.enemyPokemon)

    let slow= Poke.slowTest(UI.playerPokemon,UI.enemyPokemon)

    UI.battleLoop(fast,slow)

},
opponentFaint:function(){

  let opp = opponent.pokemonDefeated()
  let exp = opponent.isNPC() ? UI.playerPokemon.gainExperience(opp,1.15,true) : UI.playerPokemon.gainExperience(opp)
  UI.playerPokemon.increaseExperience(exp)

  if(UI.playerPokemon.canLvlUp()) UI.playerPokemon.lvlUp()
  if(UI.playerPokemon.canLearnMove()) alert("learnable")

  if(opponent.isDefeated()){
    UI.battleSequence({message:opponent.outro(opp.getName()),action:()=>{

      UI.closeBattle()
    }})

  }else{
    console.log("Trainer battleing")
  }
},

playerFaint:function(){
  user.pokemonDefeated()
  if(user.isDefeated()){
    user.teleport = user.savePosition
    user.fullHeal()
    save()
    window.location.href = "./profile"
  }else{
    switchTeam()
    UI.body.addEventListener("click",openSwitchTeam)
    save()
  }
},
closeBattle:()=>{
  save()
  localStorage.removeItem("opponent")
  window.location.href = "./profile"
},
setupPlayerPokemon:()=>{
  UI.refreshPokemon()
  UI.renderBothPokemon()
  updateMoves(user)

  UI.updateNames()
  UI.hp.innerHTML = UI.playerPokemon.hp
  let percentage = UI.playerPokemon.getLifePercentage()
  UI.hp.style.width = `${percentage}%`
  UI.hp.className="progress-bar bg-success"

  if(percentage<50) UI.hp.className="progress-bar bg-warning"
  if(percentage<25) UI.hp.className="progress-bar bg-danger"

}

};


function renderPokemon(tag,player=true,playerFront=false){

let direction = player && ! playerFront ? "back" : "front"
let pokemon = player ? UI.playerPokemon : UI.enemyPokemon
let shiny = pokemon.shiny ? "shiny" : "normal"

let valid=[`<source type="image/gif" srcset="${pokemon.image.hd[direction][shiny]}">`,
`<source type="image/gif" srcset="${pokemon.image.high[direction][shiny]}">`,
  `<source type="image/gif" srcset="${pokemon.image.mid[direction][shiny]}">`,
  `<source type="image/gif" srcset="${pokemon.image.low[direction][shiny]}">`,
  `<img type="image/gif" src="${pokemon.image.sprite[direction][shiny]}">`]

  tag.innerHTML = valid.slice(UI.imgTries).join("")
}


window.addEventListener("load", ()=>{
  UI.renderBothPokemon()
  updateMoves(user)

  UI.updateNames()
  UI.hp.innerHTML = UI.playerPokemon.hp
  UI.hp.style.color = `black`


  UI.setupAttackFunctions()

  //sets pokemon images
  UI.playerImg.style.display = "block"
  UI.enemyImg.style.display = "block"

  let percentage = UI.playerPokemon.getLifePercentage()

  if(percentage<50) UI.hp.className="progress-bar bg-warning"
  if(percentage<25) UI.hp.className="progress-bar bg-danger"

  UI.hp.innerHTML = `${UI.playerPokemon.hp}`
  UI.hp.style.width = `${percentage}%`

});


function fight() {
  //* toggle *//
  toggleElementDisplay(UI.menu);
  toggleElementDisplay(UI.moves);

}

function bag() {
  UI.itemBagHeader.className = "modal-header bagColor"
  UI.itemBagTitle.innerHTML = "Items"
  UI.itemBagBody.innerHTML = ""
  console.log(user.bag);

  user.bag.forEach(item=>{

    UI.itemBagBody.innerHTML += `
  <li data-item="${item.name}" class="list-group-item list-group-item-action list-group-item-dark">
  <strong  data-item="${item.name}" >${item.name}</strong>
  <img  data-item="${item.name}"  style="height:100%;" src="https://raw.githubusercontent.com/CharlesCreativeContent/phaser-tut/main/public/images/Items/${item.name}.png"/>
    <small  data-item="${item.name}" >x</small>
    <strong  data-item="${item.name}" >${item.count}</strong>
    </li>
    `
  })

  document.querySelectorAll(".list-group-item").forEach((itemButton) => itemButton.addEventListener("click",e=>{

      openItemBag()
      toggleElementDisplay(UI.menu)
      UI.showMessageBoard()

    let itemName = e.target.dataset.item
    user.useItem = itemName

    let UseLibrary = {

      "pokeball": ()=>{
        if(Poke.isCaught(UI.enemyPokemon)){
          user.catchPokemon = UI.enemyPokemon
            UI.battleSequence({message:`You Caught ${UI.enemyPokemon.getUpperName()}!`,action:()=>{
          window.location.href = "./profile"
            }})
        }else{
          UI.battleSequence({message:"Pokémon broke free!",action:()=>{
            UI.enemyPokemon.player= false
            UI.playerPokemon.player= true
            UI.enemyPokemon.chooseMove()
            UI.battleLoop(UI.enemyPokemon,UI.playerPokemon,true)
            }
        })
      }
    },

    "potion": ()=>{

      UI.updatePlayerHP(-UI.playerPokemon.heal(20))
        UI.battleSequence({message:"You healed your pokemon",action:()=>{
          UI.enemyPokemon.player= false
          UI.playerPokemon.player= true
          UI.enemyPokemon.chooseMove()
          UI.battleLoop(UI.enemyPokemon,UI.playerPokemon,true)
          }

    })

  }
}

    UseLibrary[itemName]()

  }));

openItemBag()
}
function run() {
  UI.itemBagHeader.className = "modal-header runColor"
  UI.modalTitle.innerHTML = "RUN"
    toggleElementDisplay(UI.menu)
    UI.showMessageBoard()
  if(Poke.isCaught(UI.enemyPokemon)){
    UI.battleSequence({message:"You got away!",action:()=>{
  window.location.href = "./profile"
    }})
}else{
  UI.battleSequence({message:"Pokémon stopped you from running!",action:()=>{
    UI.enemyPokemon.player= false
    UI.playerPokemon.player= true
    UI.enemyPokemon.chooseMove()
    UI.battleLoop(UI.enemyPokemon,UI.playerPokemon,true)
    }

  })
}
}
function switchPokemon(e){
  openMenu()
  toggleElementDisplay(UI.menu);


  UI.playerPokemon["player"] = true
  UI.enemyPokemon["player"] = false
  UI.showMessageBoard()

let choice = +e.target.className[0]
user.switchPokemon(choice)
UI.setupPlayerPokemon()
UI.battleSequence({message:user.intro(),action:()=>{
UI.enemyPokemon.chooseMove()
UI.battleLoop(UI.enemyPokemon,UI.playerPokemon,true)
}
})}
function switchTeam(){
  openSwitchTeam()
UI.switchTeamBody.innerHTML = ""
let len = user.team.length
  user.team.slice(0,len-1).forEach((pok,i)=>{
    let {name , lvl, image, shiny } = pok
    let direction = "front"
    UI.switchTeamBody.innerHTML += `
    <section class="${i}s">
    <h3 class="${i}s">${name} - Lvl ${lvl}</h3>
    <img class="${i}s" src="${image[direction]}"/>
    </section>
    `
  })
  UI.switchTeamBody.addEventListener("click",e=>{
    openSwitchTeam()
    UI.body.removeEventListener("click",openSwitchTeam)
    console.log(e.target)
    let choice = +e.target.className[0]
    user.switchPokemon(choice)
    UI.battleSequence({message:user.intro(),action:()=>{
    UI.setupPlayerPokemon()
    UI.endBattleSequence()
    }})
  },{once:true})
}
function monsters() {
  UI.modalHeader.className = "modal-header monstersColor"
  UI.modalTitle.innerHTML = "Team"
  UI.modalBody.innerHTML = ""
  let team = user.team.filter(pok=>pok.hp > 0)

  if(team.length > 1){
  team.slice(1).forEach((pok,i)=>{
    let {name , lvl, image, shiny, hp } = pok
    let direction = "front"
    UI.modalBody.innerHTML += `
    <h3 class="${user.team.indexOf(pok)}s">${name} - Lvl ${lvl}</h3>
    <img class="${user.team.indexOf(pok)}s" src="${image[direction]}"/>
    `

    document.querySelectorAll("#modal-body *").forEach(el=>el.addEventListener("click",switchPokemon))
  })
}else{
let { shiny, image } = UI.playerPokemon
shiny = shiny ? "shiny" : "normal"
let direction = "front"
  UI.modalBody.innerHTML += `
<h3>No Pokemon Left!</h3>
<img src="${image[direction]}"/>
`
}

  openMenu()
}


function toggleElementDisplay(element) {
  element.classList.toggle("disappear");
}

function openMenu(){
  $("#popUp").modal("toggle");
}

function openItemBag(){
  $("#itemBag").modal("toggle");
}

function openSwitchTeam(){
  $("#teamSwitch").modal("toggle");
}

function updateMoves(user){

    for(let i = 0 ; i < 4 ; i++){
     let id = `#move${i+1}`
     let moveButton = document.querySelector(id)
     moveButton.className = "empty"
     moveButton.innerHTML = ""
    if(i < UI.playerPokemon.moves.length){
     let name = UI.playerPokemon.moves[i]
      let type = Moves[name].type
      moveButton.className = type
      moveButton.innerHTML = name
    }
  }
}
