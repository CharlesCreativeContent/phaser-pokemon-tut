let temp = null
$(function () {
 $(".menu-link").click(function () {
  $(".menu-link").removeClass("is-active");
  $(this).addClass("is-active");
 });
});

$(function () {
 $(".main-header-link").click(function () {
  $(".main-header-link").removeClass("is-active");
  $(this).addClass("is-active");
 });
});

const toggleButton = document.querySelector('.dark-light');

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

let ranchField = document.getElementById("ranchField")
let items = document.getElementById("items");
let itemBag = document.getElementById("itemBag");
let team = document.getElementById("team");
let worldMapButton = document.getElementById("worldMapButton")
let worldMap = document.getElementById("worldMap");
let exitButtons = document.querySelectorAll(".exit");
let baggy = document.getElementById("baggy");
let ranch = document.getElementById("ranch");
let ranchButton = document.getElementById("ranchButton");
let wallet = document.getElementById("wallet");

exitButtons.forEach((el) => el.addEventListener("click", exit));

worldMapButton.addEventListener("click", flipClasses, { once: true });

ranchButton.addEventListener("click", flipClasses3, { once: true });

function flipClasses() {
  document
    .querySelectorAll(".stuff")
    .forEach((el) => el.classList.add("disappear"));
  worldMap.classList.remove("disappear")
  baggy.addEventListener("click", flipClasses2, { once: true });
  ranchButton.addEventListener("click", flipClasses3, { once: true });
}
function flipClasses2() {
  document
    .querySelectorAll(".stuff")
    .forEach((el) => el.classList.add("disappear"));
  document
    .querySelectorAll(".mainList")
    .forEach((el) =>  el.classList.remove("disappear"))
  worldMapButton.addEventListener("click", flipClasses, { once: true });
  ranchButton.addEventListener("click", flipClasses3, { once: true });
}
function flipClasses3() {
  document
    .querySelectorAll(".stuff")
    .forEach((el) => el.classList.add("disappear"));
  ranch.classList.remove("disappear")
  worldMapButton.addEventListener("click", flipClasses, { once: true });
  baggy.addEventListener("click", flipClasses2, { once: true });
}
function updateWallet(){
  wallet.innerHTML = user.money
}


function exit(){
 window.location = "/profile"
}

function buy(e){
 let money = +wallet.innerHTML
 let [name, price] = e.target.value.split(":")
 console.log("money: ",money)
 console.log("name: ",name)
 console.log("price: ",+price)
 if(price<=money){
   user.buyItem = {name,price:+price}
  money-=price
  updateWallet()
  //add Item to user
  updatePokeballs()
  save()
 }else{
  alert("You Don't Have Enough Money!")
 }
}

document.querySelectorAll(".buy").forEach(el=>el.addEventListener("click",buy))

let legendaryItems = ["Red Scarf", "Digivice", "Millennium Puzzle", "Fullmetal Watch", "Scrap of Paper","Straw Hat","Leaf Headband","Dragonball","Gourd of Sand","Frog Wallet","Cloud Cloak","Hunter's License", "Kirito's Sword","Divine Axe Rhitta", "Stone Mask", "Fruit of the Tree of Might","Hanafuda Earrings","White&Red Beads","Cracked Mirror","Whistle", "Paper Fan", "Lagann","Arm Bandages","Broken Scissors","Red Helmet","Surfboard","Shield","WebShooter","Claws","White Ring", "Gold Helmet", "Spear","Scarab", "Stone","Purple Shorts","Lasso","Trident","Joker Toxin","Venom","Fear Toxin","chain and hook","Chemical X","Snips & Snails & Tails","Sugar & Spice & Everything Nice", "Pacifier","Lab Coat"]

function updateItemCount (name){
  let count = user.getItemCount(name)
  let countElement = document.getElementById(name+"Count")
  countElement.innerHTML = count
  let status = countElement.previousElementSibling.previousElementSibling
  status.className = "status-circle green"
}
function updatePokeballs (){
  let elements = ["Pokéball","GreatBall","UltraBall"]
  elements = elements.filter(itemName=>user.hasItem(itemName))
  elements.forEach(element=>updateItemCount(element))
}
updatePokeballs()
updateWallet()


function fillDayCare(){
save()
ranchField.innerHTML =""

user.computer.forEach((mon,index)=>{

ranchField.innerHTML +=`
<div class="app-card">
  <span>
    ${mon.getUpperName()} - Lv.${mon.lvl}
  </span>
  <div class="app-card__subtext">
  <img src="${ mon.shiny ?  mon.image.sprite.front.shiny : mon.image.sprite.front.normal}"/>
  </div>
  <div class="app-card-buttons">
    <button class="switch content-button status-button buy" data-switch="${index}">Switch</button>
  </div>
</div>`

})
document.querySelectorAll(".switch").forEach(el=>el.addEventListener("click",startCompSwitch))
}

fillDayCare()

function startCompSwitch(e){
  let index = e.target.dataset["switch"]
temp = index
//open popup and fill
  console.log("index: ",index)
  openTeam()
}
function openTeam(){
$('#exampleModal').modal('show')
document.querySelector(".modal-body").innerHTML=""
user.team.forEach((mon,index)=>{
  document.querySelector(".modal-body").innerHTML+=`
  <div data-index="${index}" style="width:100%;">
    <span data-index="${index}">
      ${mon.getUpperName()} - Lv.${mon.lvl}
    </span>
    <div data-index="${index}" class="app-card__subtext">
    <img data-index="${index}" src="${ mon.shiny ?  mon.image.sprite.front.shiny : mon.image.sprite.front.normal}"/>
    </div>
  </div>`
})

document.querySelectorAll(".modal-body *").forEach(el=>el.addEventListener("click",e=>{
  if(temp!==null){
  console.log("target: ",e.target)
  let index = e.target.dataset["index"]
  console.log("index: ",index)
  console.log("temp: ",temp)
  user.switchComputerPokemon(index,temp)
  temp =null
  save()

  $('#exampleModal').modal('toggle')
  fillDayCare()
  }
},{once:true}))
}
