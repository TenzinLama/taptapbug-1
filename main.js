canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var level = 1;  
var bugColor = ["black", "red", "orange"];
var bugSpeed = [[150, 75, 60], [200, 100, 80]];
var bugScore = [5, 3, 1];
var bugColorProbability = [0.3, 0.3, 0.4];
var bugImage = [];   //need to be initialize
var foodImage;
var canvasWidth = 600;
var canvasHeight = 400;
var gameStatus; // 0 means ongoing, 1 means lose, 2 means win
var bugRadius = 20;   //need to adjust
var foodRadius = 20;   //need to adjust
var bugXCoordinateMin = bugRadius;   
var bugXCoordinateMax = canvasWidth - bugRadius;
var bugYCoordinateInitial = bugRadius;    
var foodXCoordinateMin = foodRadius;   
var foodXCoordinateMax = canvasWidth - foodRadius;   
var foodYCoordinateMin = Math.floor(canvasHeight * 0.2);   
var foodYCoordinateMax = canvasHeight - foodRadius;   
var foodInitNumber = 5;
var ACTIVE = 1;
var KILLED = 0;
var EXIST = 1;
var EATEN = 0;
var BLACK = 0;
var RED = 1;
var ORANGE = 2;
var bugs;
var foods;



//generate random integer between min and max inclusive (tested correct)
function randomIntergerBetweenRange(min, max){
	var r = Math.random(); //Return a random number between 0 (inclusive) and 1 (exclusive)
	return Math.floor(r * (max - min + 1)) + min;
}//finished

//generate random float number in the range [min, max)
function randomFloatBetweenRange(min, max){
	var r = Math.random(); //Return a random number between 0 (inclusive) and 1 (exclusive)
	return r * (max - min) + min;
}//finished

function makeWhiteToTransparent(imgData){
	for (var i=0;i<imgData.data.length;i+=4)
	{
	    if(imgData.data[i+0]==0 && imgData.data[i+1]==0 && imgData.data[i+2]==0){
	    	imgData.data[i+3] = 0;
		}
	}
}
// define the position class
function Position(x, y){
	this.x = x;
	this.y = y;

	this.clickWithinBugRange = function(mouseX, mouseY){
		return (mouseX - self.x)*(mouseX - self.x) + (mouseY - self.y)*(mouseY - self.y) <= 30 * 30;
	};
} //finished

// define the Bug class
function Bug(){
	var bugType = randomIntergerBetweenRange(0, 2);
	this.color = bugColor[bugType];
	this.speed = bugSpeed[level-1][bugType];
	this.score = bugScore[bugType];
	this.image = bugImage[bugType];
	this.status = ACTIVE;  
	var randomX = randomIntergerBetweenRange(bugXCoordinateMin, bugXCoordinateMax);
	this.position = new Position(randomX, bugYCoordinateInitial);
	
}//finished

// define the Food class
function Food(){
	this.image = foodImage;
	var randomX = randomIntergerBetweenRange(foodXCoordinateMin, foodXCoordinateMax);
	var randomY = randomIntergerBetweenRange(foodYCoordinateMin, foodYCoordinateMax);
	this.position = new Position(randomX, randomY);
	this.status = EXIST;
}//finished

//randomly generate n food object with random position
function generateFood(n){
	foods = [];
	for(i=0; i<n; i++){
		foods[i] = new Food();
	}
	// for(i=0; i<foods.length; i++){
	// 	ctx.putImageData(foodImage, Math.floor(foods[i].position.x - foodRadius/2), Math.floor(foods[i].position.y - foodRadius/2));
	// }
} //finished

//draw the game background
function drawGameEnvironment(){
	ctx.fillStyle = "#FFFFCC";
	ctx.fillRect(0,0,600,400);
}

// draw the image of three colors of bugs and save them to blackBugImage, redBugImage and orangeBugImage
function drawAndSaveBugImage(){
	//FOR TEST
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,20,20);
	bugImage[BLACK] = ctx.getImageData(0,0,20,20);

	ctx.fillStyle = "red";
	ctx.fillRect(0,0,20,20);
	bugImage[RED] = ctx.getImageData(0,0,20,20);

	ctx.fillStyle = "orange";
	ctx.fillRect(0,0,20,20);
	bugImage[ORANGE] = ctx.getImageData(0,0,20,20);
}

// import food image and save to variable foodImage 
function importFoodImage(){
	ctx.fillStyle = "blue";
	ctx.fillRect(0,0,20,20);
	foodImage = ctx.getImageData(0,0,20,20);
}




function drawAll(){
	drawGameEnvironment();
	for(var bug in bugs){
		 // alert(bug.color);
		if (bug.status == ACTIVE){
			alert("bug staus is ACTIVE");
			ctx.putImageData(bug.image, Math.floor(bug.position.x - bugRadius/2), Math.floor(bug.position.y - bugRadius/2));
		}
	}
	for(var food in foods){
		if (food.status == EXIST){
			ctx.putImageData(food.image, Math.floor(food.position.x - foodRadius/2), Math.floor(food.position.y - foodRadius/2));
		}
	}
}

//update timer
function updateTimer(){

}

//function called once pause button
function pause(){

}

//update score
function updateScore(){

}

//constantly check the game status and respond once the status changes
function isGameOver(){
	while(!gameStatus){

	}
}

function generateOneBug(){
	bugs.push(new Bug);
	// alert(bugs.length);
	var generateBugTimeout = setTimeout(generateOneBug, Math.floor(randomFloatBetweenRange(1,3)*1000));
}

// attach time events and click events
function startNewGame(level){
	bugs = [];
	generateFood(foodInitNumber);
	var drawAllInterval = setInterval(drawAll, 200);
	var generateBugTimeout = setTimeout(generateOneBug, Math.floor(randomFloatBetweenRange(1,3)*1000));
}
//main
window.onload = function(){  
	drawAndSaveBugImage();  
	importFoodImage();
	drawGameEnvironment();
	// b = new Bug();
	// ctx.putImageData(b.image, Math.floor(b.position.x - bugRadius/2), Math.floor(b.position.y - bugRadius/2));
	startNewGame(level);
	// isGameOver();
};




