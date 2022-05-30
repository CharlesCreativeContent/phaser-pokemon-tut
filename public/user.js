let user =  localStorage.getItem("user") ? loadUser() : new User(getPlayerName(),[], {
  team:[new Poke(99,15)],
  skills: [],
  skin: defaultSkins.sort(()=>Math.random()-0.5)[0],
  money: 1000,
  bag: [{name: "pokeball",count:5},{name: "potion",count:5}],
  badges: [],
  picture: "https://placekitten.com/200/200",
  computer: [],
  location: "overworld2",
  x: 750,
  y: 450,
  savePosition: {location:"overworld2",x:750,y:450},
})
//sets the skin of the player
if(Skins.includes(user.name.toLowerCase())){
  user.skin = user.name.toLowerCase()
}

let fakeOpponent = Trainer.encounters[user.location]
// fakeOpponent.ids = fakeOpponent.ids[0]
// fakeOpponent.ids = fakeOpponent.ids[3]
// fakeOpponent.ids = [801]


let opponent = localStorage.getItem("opponent") ? loadOpponent() : Trainer.wild(fakeOpponent)
// localStorage.clear()
