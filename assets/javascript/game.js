
$(document).ready(function () {

var StarWars = {
    player: {
        name: "", 
        image: "",
        healthPoints: 0,
        attackPoints: 0,
        counterAttackPoints: 0,
        id: "",
    },
    players: [],
    yourCharacter: {},
    defenderCharacter: {},
    counter: 0,

    init: function() {
        this.createPlayers();
        setTimeout(()=>{this.positionPlayer(this.players[0]);}, 500);
        setTimeout(()=>{this.positionPlayer(this.players[1]);}, 1000);
        setTimeout(()=>{this.positionPlayer(this.players[2]);}, 1500);
        setTimeout(()=>{this.positionPlayer(this.players[3]);}, 2000);
        setTimeout(()=>{this.makePlayersClickable();}, 2200); 
    },
    createPlayers: function(){
        player1 = Object.create(this.player);
        player1.name = "ObiWan";
        player1.image = "assets/images/ch-1.jpg";
        player1.healthPoints = this.generateHP();
        player1.attackPoints = this.generateAP();
        player1.counterAttackPoints = this.generateCP();
        player1.id = 1;

        player2 = Object.create(this.player);
        player2.name = "Luke";
        player2.image = "assets/images/ch-2.jpg";
        player2.healthPoints = this.generateHP();
        player2.attackPoints = this.generateAP();
        player2.counterAttackPoints = this.generateCP();
        player2.id = 2;

        player3 = Object.create(this.player);
        player3.name = "DarthSidious";
        player3.image = "assets/images/ch-3.jpg";
        player3.healthPoints = this.generateHP();
        player3.attackPoints = this.generateAP();
        player3.counterAttackPoints = this.generateCP();
        player3.id = 3;

        player4 = Object.create(this.player);
        player4.name = "DarthMaul";
        player4.image = "assets/images/ch-4.jpg";
        player4.healthPoints = this.generateHP();
        player4.attackPoints = this.generateAP();
        player4.counterAttackPoints = this.generateCP();
        player4.id = 4;

        this.players.push(player1, player2, player3, player4);

    },
    positionPlayer: function(player) {
        var html = "<div id='"+ player.id +"' class='container-choose'>" +
                        "<div id='"+ player.name +"'>"+ player.name +"</div>" + 
                        "<div id='hp"+ player.id +"'>"+ player.healthPoints +"</div>" +
                        "<div><img src='"+ player.image + "'></div>" +
                        "</div>";
        $("#players").append(html);
    },
    generateHP:function() {
        return Math.floor((Math.random() * 150) + 50);
    },
    generateAP:function() {
        return Math.floor((Math.random() * 40) + 5);
    },
    generateCP:function() {
        return Math.floor((Math.random() * 40) + 5);
    },

    //attack: function() {},
    //counterAttack: function() {},
    //updateStats: function() {},
    //reset: function() {},
    makePlayersClickable: function() {
        for(var i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            let domPlayer = document.getElementById(player.id);
            domPlayer.onclick = () => {                
                this.choosePlayer(player);
            }
        }
    },
    choosePlayer: function(playerObject) {
        this.yourCharacter = playerObject;
        let domYourCharacter = document.getElementById('your-character');
        let div = document.getElementById(playerObject.id);
        let cloneDiv = div.cloneNode(true);
        $(domYourCharacter).html(cloneDiv);
        $(div).remove();
        $(cloneDiv).addClass("container-character");
        $(cloneDiv).removeClass("container-choose");
        
        this.players = this.players.filter((item) => item.id != playerObject.id);    
        //this.players.splice(playerKey, 1);
        this.shiftRemainingToEnemies();
        this.makeEnemiesClickable();
        $("#fight-section").animate({
            opacity: 1, speed: 400
        })
    },
    shiftRemainingToEnemies: function() {
        var playersObject = document.getElementById("players");
        document.getElementById("enemies").innerHTML = playersObject.innerHTML;
        playersObject.innerHTML = "";
    },

    makeEnemiesClickable: function() {
        for(var i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            let domPlayer = document.getElementById(player.id);
            domPlayer.onclick = () => {                
                this.chooseEnemy(player);
            }
            $(domPlayer).toggleClass("container-enemy");
            //$(domPlayer).removeClass("container-enemy");
        }
    },

    chooseEnemy: function(playerObject) {
        this.defenderCharacter = playerObject;
        let domFightCharacter = document.getElementById('container-defender');
        let div = document.getElementById(playerObject.id);
        let cloneDiv = div.cloneNode(true);
        $(div).animate({
            opacity: 0, speed: 400
        },function() {
            this.remove();
            $(domFightCharacter).html(cloneDiv);
        });
        div = document.getElementById(playerObject.id);
        $(div).toggleClass("container-defender");
        this.fightButton();

    },
        
    fightButton: function() {
        let btn = document.getElementById("btn-fight");
        btn.onclick = () => {
            this.fight();
        }
    },

    fight: function() {
        let diceRoll1 = Math.ceil(this.diceRoll() + (this.counter * 25));
        console.log(diceRoll1);
        let diceRoll2 = this.diceRoll();
        this.defenderCharacter.healthPoints -= diceRoll1;
        this.yourCharacter.healthPoints -= diceRoll2;

        this.updateStats(diceRoll1, diceRoll2);
        if (this.defenderCharacter.healthPoints <= 0) {
            var div = document.getElementById(this.defenderCharacter.id);
             $(div).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200, function(){
                this.remove();
            });
             this.players = this.players.filter((item) => item.id !=  this.defenderCharacter.id);
             if(this.players.length == 0){
                this.gameOver('Winner, winner chicken dinner');
             }
        }
        if (this.yourCharacter.healthPoints <= 0) {
            var div = document.getElementById(this.yourCharacter.id);
            //$(div).remove();
            $(div).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200, function(){
                this.remove();
            }); 
            this.players = this.players.filter((item) => item.id != this.defenderCharacter.id);          
            this.gameOver('You lose, sorry');
        }
        this.counter++;
    },
    gameOver: function(msg){
        setTimeout( ()=> {
            document.getElementById('game').innerHTML = msg;
        },1500);
    },

    diceRoll: function(){
        let num = Math.floor((Math.random() * 20) + 5);
        return num;
    },
    updateStats: function(diceRoll1, diceRoll2){
        document.getElementById("hp"+this.yourCharacter.id).innerHTML = this.yourCharacter.healthPoints;
        document.getElementById("hp"+this.defenderCharacter.id).innerHTML = this.defenderCharacter.healthPoints;
        let div = document.getElementById('fight-result');
        div.innerHTML = `<div>Your character attacked for ${diceRoll1} points</div>
                         <div>Enemy attacked for ${diceRoll2} points</div>`;
    },
}
    

var myStarWars = Object.create(StarWars); 
myStarWars.init();


});











// $(document).ready(function() {
// var myCharacter;
// var enemy;
// var fightSection;
// var defender;
// var yourCharacter;



/*$("#image1").on("click", function () {
    $("#image1").appendTo("#your-character");
    $("#image2").appendTo("#enemies").css("background-color","red");
    $("#image3").appendTo("#enemies").css("background-color","red");
    $("#image4").appendTo("#enemies").css("background-color","red");

});

//Function for selecting an enemy
$("#image2").on("click", function() {
    $("#image2").appendTo("#defender").css("background-color","green");;
});

//Function for random scores
var score2 = Math.floor(Math.random() * 100);
$(score2).html("#ch-2-score");
console.log(score2);
});*/


