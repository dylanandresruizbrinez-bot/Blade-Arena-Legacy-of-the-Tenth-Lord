// =====================================
// BLADE ARENA
// LEGACY OF THE TENTH LORD
// =====================================

console.log("Blade Arena iniciado");

// =====================================
// ELEMENTOS HTML
// =====================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const loadingScreen = document.getElementById("loadingScreen");
const mainMenu = document.getElementById("mainMenu");
const roundScreen = document.getElementById("roundScreen");

const startBtn = document.getElementById("startBtn");
const fightBtn = document.getElementById("fightBtn");

const hud = document.getElementById("hud");

const playerHealth = document.getElementById("playerHealth");
const bossHealth = document.getElementById("bossHealth");

const roundTitle = document.getElementById("roundTitle");
const enemyName = document.getElementById("enemyName");
const enemyType = document.getElementById("enemyType");

// =====================================
// ESTADO
// =====================================

let gameRunning = false;
let currentRound = 1;

// =====================================
// SEÑORES DE LA ESPADA
// =====================================

const bosses = [

{
name:"Vulkan el Rompefilos",
type:"Fuerza",
ataque:40,
vida:250,
resistencia:20,
velocidad:3,
impulso:3,
alcance:50
},

{
name:"Kaelen el Verdugo",
type:"Fuerza",
ataque:50,
vida:220,
resistencia:15,
velocidad:4,
impulso:4,
alcance:60
},

{
name:"Gorgoroth el Devastador",
type:"Fuerza",
ataque:70,
vida:300,
resistencia:30,
velocidad:2,
impulso:2,
alcance:70
},

{
name:"Aethelgard el Inmortal",
type:"Vitalidad",
ataque:30,
vida:500,
resistencia:40,
velocidad:2,
impulso:2,
alcance:50
},

{
name:"Morrigan la Cosechadora",
type:"Vitalidad",
ataque:35,
vida:450,
resistencia:35,
velocidad:4,
impulso:4,
alcance:60
},

{
name:"Valeria la Sanguinaria",
type:"Vitalidad",
ataque:40,
vida:400,
resistencia:40,
velocidad:5,
impulso:4,
alcance:60
},

{
name:"Bastian el Bastión",
type:"Resistencia",
ataque:30,
vida:600,
resistencia:100,
velocidad:1,
impulso:1,
alcance:40
},

{
name:"Orion el Inquebrantable",
type:"Resistencia",
ataque:40,
vida:550,
resistencia:120,
velocidad:2,
impulso:2,
alcance:60
},

{
name:"Seraphina la Guardia del Alba",
type:"Resistencia",
ataque:35,
vida:500,
resistencia:140,
velocidad:3,
impulso:3,
alcance:80
},

{
name:"Zephyr el Filo del Viento",
type:"Velocidad",
ataque:40,
vida:250,
resistencia:10,
velocidad:10,
impulso:8,
alcance:60
},

{
name:"Lysandra la Centella",
type:"Velocidad",
ataque:35,
vida:280,
resistencia:15,
velocidad:12,
impulso:8,
alcance:55
},

{
name:"Kage el Sombra",
type:"Velocidad",
ataque:50,
vida:220,
resistencia:5,
velocidad:14,
impulso:10,
alcance:50
},

{
name:"Darius el Errante",
type:"Impulso",
ataque:45,
vida:300,
resistencia:20,
velocidad:8,
impulso:14,
alcance:60
},

{
name:"Skye la Danzarina Celestial",
type:"Impulso",
ataque:40,
vida:320,
resistencia:20,
velocidad:7,
impulso:16,
alcance:70
},

{
name:"Ronan el Proscrito",
type:"Impulso",
ataque:55,
vida:350,
resistencia:25,
velocidad:7,
impulso:18,
alcance:60
},

{
name:"Zenón el Astrónomo",
type:"Dominio",
ataque:40,
vida:350,
resistencia:30,
velocidad:4,
impulso:4,
alcance:180
},

{
name:"Freya la Tejedora",
type:"Dominio",
ataque:45,
vida:320,
resistencia:25,
velocidad:5,
impulso:4,
alcance:220
},

{
name:"Malakor el Vacío",
type:"Dominio",
ataque:60,
vida:400,
resistencia:40,
velocidad:5,
impulso:5,
alcance:250
},

{
name:"Campeón de las Seis Artes",
type:"Maestro",
ataque:80,
vida:700,
resistencia:80,
velocidad:8,
impulso:8,
alcance:120
},

{
name:"Aurelius",
type:"Primer Lord",
ataque:100,
vida:1000,
resistencia:100,
velocidad:10,
impulso:10,
alcance:150
}

];

// =====================================
// JUGADOR
// =====================================

const player = {

name:"Smash Lord X",

x:200,
y:300,

size:50,

ataque:35,
vida:300,
resistencia:35,
velocidad:7,
impulso:10,
alcance:80,

hp:300,

superReady:true
};

// =====================================
// ENEMIGO
// =====================================

let enemy = null;

// =====================================
// CONTROLES
// =====================================

const keys = {};

document.addEventListener("keydown", e=>{

keys[e.key]=true;

if(e.key==="a"){
attack();
}

if(e.key==="d"){
dash();
}

if(e.key==="s"){
superAttack();
}

if(e.key==="f"){
spinAttack();
}

});

document.addEventListener("keyup", e=>{
keys[e.key]=false;
});

// =====================================
// FUNCIONES
// =====================================

function showScreen(screen){

document
.querySelectorAll(".screen")
.forEach(s=>s.classList.add("hidden"));

screen.classList.remove("hidden");

}

function startGame(){

showRoundScreen();

}

function showRoundScreen(){

const boss = bosses[currentRound-1];

roundTitle.textContent =
"RONDA " + currentRound;

enemyName.textContent =
boss.name;

enemyType.textContent =
boss.type;

showScreen(roundScreen);

}

function spawnEnemy(){

const boss = bosses[currentRound-1];

enemy = {

x:canvas.width-250,
y:canvas.height/2,

size:55,

ataque:boss.ataque,
vida:boss.vida,
hp:boss.vida,

resistencia:boss.resistencia,
velocidad:boss.velocidad,
impulso:boss.impulso,
alcance:boss.alcance,

name:boss.name

};

}

function beginFight(){

spawnEnemy();

roundScreen.classList.add("hidden");

hud.classList.remove("hidden");

gameRunning=true;

}

function attack(){

if(!enemy) return;

const dx = enemy.x-player.x;
const dy = enemy.y-player.y;

const distance =
Math.hypot(dx,dy);

if(distance < player.alcance){

const damage =
player.ataque *
(100/(100+enemy.resistencia));

enemy.hp -= damage;

}

}

function dash(){

player.x +=
player.impulso * 20;

if(enemy){

const d =
Math.hypot(
enemy.x-player.x,
enemy.y-player.y
);

if(d < 70){

enemy.hp -=
player.velocidad * 3;

}

}

}

function superAttack(){

if(!player.superReady) return;

player.superReady=false;

if(enemy){

const d =
Math.hypot(
enemy.x-player.x,
enemy.y-player.y
);

if(d < player.alcance+100){

enemy.hp -=
player.ataque*3;

}

}

setTimeout(()=>{

player.superReady=true;

},10000);

}

function spinAttack(){

if(!enemy) return;

const d =
Math.hypot(
enemy.x-player.x,
enemy.y-player.y
);

if(d < player.alcance*2){

enemy.hp -=
player.ataque*1.5;

}

}

function movePlayer(){

if(keys["ArrowUp"])
player.y-=player.velocidad;

if(keys["ArrowDown"])
player.y+=player.velocidad;

if(keys["ArrowLeft"])
player.x-=player.velocidad;

if(keys["ArrowRight"])
player.x+=player.velocidad;

}

function updateEnemy(){

if(!enemy) return;

const dx = player.x-enemy.x;
const dy = player.y-enemy.y;

const angle =
Math.atan2(dy,dx);

enemy.x +=
Math.cos(angle)*enemy.velocidad;

enemy.y +=
Math.sin(angle)*enemy.velocidad;

const distance =
Math.hypot(dx,dy);

if(distance < enemy.alcance){

const damage =
enemy.ataque *
(100/(100+player.resistencia));

player.hp -= damage*0.02;

}

}

function drawPlayer(){

ctx.fillStyle="cyan";

ctx.fillRect(
player.x-player.size/2,
player.y-player.size/2,
player.size,
player.size
);

}

function drawEnemy(){

if(!enemy) return;

ctx.fillStyle="crimson";

ctx.fillRect(
enemy.x-enemy.size/2,
enemy.y-enemy.size/2,
enemy.size,
enemy.size
);

}

function updateBars(){

playerHealth.style.width =
(player.hp/player.vida)*100 + "%";

if(enemy){

bossHealth.style.width =
(enemy.hp/enemy.vida)*100 + "%";

}

}

function checkRound(){

if(enemy && enemy.hp <= 0){

currentRound++;

if(currentRound > bosses.length){

alert("HAS VENCIDO A AURELIUS");

location.reload();

return;

}

showRoundScreen();

gameRunning=false;

}

if(player.hp <= 0){

alert("SMASH LORD X HA CAÍDO");

location.reload();

}

}

function gameLoop(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

if(gameRunning){

movePlayer();

updateEnemy();

updateBars();

checkRound();

}

drawPlayer();
drawEnemy();

requestAnimationFrame(gameLoop);

}

// =====================================
// BOTONES
// =====================================

startBtn.onclick = startGame;

fightBtn.onclick = beginFight;

// =====================================
// CARGA
// =====================================

setTimeout(()=>{

loadingScreen.classList.add("hidden");
mainMenu.classList.remove("hidden");

},2500);

// =====================================
// INICIO
// =====================================

gameLoop();
