

var i = 0;
var color = `hsl(${i},100%,50%)`;



defaultSkins.sort((a,b)=>0.5-Math.random()).forEach((skin) => {
  let carousel = document.getElementById("carousel");
  carousel.innerHTML += `
          <div data-outfit="${skin}" class="carousel-item">
            <img class="d-block  w-100" style="height:45vh;" src="https://raw.githubusercontent.com/CharlesCreativeContent/phaser-tut/main/public/images/Sprites/front/${skin}.png">
          </div>
`;
});

setInterval(()=>{
  i = i + 5

  color = `hsl(${i},100%,50%)`;

  document.querySelector(".rainbow").style.border = `1px solid ${color}`
},100)


document.querySelector("button").addEventListener("click",e=>{
  let outfit = document.querySelector(".active").dataset["outfit"]
  let name = document.querySelector("input").value
  console.log("input: ",name)
  console.log("active: ",outfit)
  user.name = name
  user.skin = outfit
  save()
  window.location.href="./profile"
})
