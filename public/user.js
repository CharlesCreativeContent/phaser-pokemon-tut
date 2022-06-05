
let user


if(localStorage.getItem("user")){
  user = loadUser();
}else{
  user = new User("",[], {
    team:[new Poke(99,15)],
    skills: [],
    skin: defaultSkins.sort(()=>Math.random()-0.5)[0],
    money: 1000,
    bag: [{name: "Pokéball",count:5},{name: "Potion",count:5}],
    badges: [],
    picture: "https://placekitten.com/200/200",
    computer: [],
    location: "overworld2",
    x: 750,
    y: 450,
    savePosition: {location:"overworld2",x:750,y:450},
  })
  save()
  window.location.href="./start"
}



// serves wild pokemon if none is given
let fakeOpponent = Trainer.encounters[user.location]
// fakeOpponent.ids = fakeOpponent.ids[0]
// fakeOpponent.ids = fakeOpponent.ids[3]
// fakeOpponent.ids = [801]


let opponent = localStorage.getItem("opponent") ? loadOpponent() : Trainer.wild(fakeOpponent)
// localStorage.clear()
