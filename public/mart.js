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


let worldMap = document.getElementById("worldMap")
let videoBackground = document.querySelector("video")
let worldMapButton = document.getElementById("worldMapButton")
let exitButtons = document.querySelectorAll(".exit")
let baggy = document.getElementById("baggy")
let wallet = document.getElementById("wallet")
wallet.innerHTML = user.money
exitButtons.forEach(el=>el.addEventListener("click",exit))

worldMapButton.addEventListener("click",flipClasses,{once: true})

videoBackground.width = window.innerWidth
videoBackground.height = window.innerHeight

function flipClasses(){
document.querySelectorAll(".stuff").forEach(el=>el.classList.toggle("disappear"))
 baggy.addEventListener("click",flipClasses2,{once: true})
}
function flipClasses2(){
document.querySelectorAll(".stuff").forEach(el=>el.classList.toggle("disappear"))
 worldMapButton.addEventListener("click",flipClasses,{once: true})
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
  wallet.innerHTML = user.money
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
