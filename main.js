canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
scoreText = document.getElementById("score");
timerText = document.getElementById("timer");
pauseButton = document.getElementById("pause");

var startTime;
var currentTime;
var level = 1;  
var bugColor = ["black", "red", "orange"];
var bugSpeed = [[150, 75, 60], [200, 100, 80]];
var bugScore = [5, 3, 1];
var bugColorProbability = [0.3, 0.3, 0.4];
var bugImage = [];   //need to be initialized
var foodImage;
var canvasWidth = 600;
var canvasHeight = 400;
var bugRadius = 20;   //need to adjust
var foodRadius = 20;   //need to adjust
var bugXCoordinateMin = bugRadius;   
var bugXCoordinateMax = canvasWidth - bugRadius;
var bugYCoordinateInitial = bugRadius;    
var foodXCoordinateMin = foodRadius;   
var foodXCoordinateMax = canvasWidth - foodRadius;   
var foodYCoordinateMin = Math.floor(canvasHeight * 0.2);   
var foodYCoordinateMax = canvasHeight - foodRadius;   
var foodNumber;
var FOODINITNUMBER = 5;
var ACTIVE = 1;
var KILLED = 0;
var EXIST = 1;
var EATEN = 0;
var BLACK = 0;
var RED = 1;
var ORANGE = 2;
var bugs;
var foods;
var intervalTime = 20;  //200ms
var bugEatFoodDistance = 20;
var score = 0;
var TOTALTIME = 15;
var highScore = 0;

localStorage.setItem("highScore", 0);


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
		return (mouseX - this.x)*(mouseX - this.x) + (mouseY - this.y)*(mouseY - this.y) <= 30 * 30;
	};
	this.getDistance = function(destX, destY){
		return Math.sqrt((this.x-destX)*(this.x-destX) + (this.y-destY)*(this.y-destY));
	};
} //finished tested correct

// define the Bug class
function Bug(){
	var randomFloat = randomFloatBetweenRange(0, 1);
	if (randomFloat < bugColorProbability[0]){
		var bugType = 0;
	}
	else if (randomFloat < bugColorProbability[1]+bugColorProbability[0]){
		var bugType = 1;
	}
	else{
		var bugType = 2;
	}
	// var bugType = randomIntergerBetweenRange(0, 2);
	this.color = bugColor[bugType];
	this.speed = bugSpeed[level-1][bugType];
	this.score = bugScore[bugType];
	this.image = bugImage[bugType];
	this.status = ACTIVE;  
	var randomX = randomIntergerBetweenRange(bugXCoordinateMin, bugXCoordinateMax);
	this.position = new Position(randomX, bugYCoordinateInitial);

	this.getFoodTarget = function(){
		var nearestFoodDistance = Math.sqrt(canvasHeight * canvasHeight + canvasWidth * canvasWidth);
		var nearestFoodIndex = 0;
		for(var foodIndex in foods){
			var distance = this.position.getDistance(foods[foodIndex].position.x, foods[foodIndex].position.y)
			if(distance < nearestFoodDistance && foods[foodIndex].status == EXIST){
				nearestFoodDistance = distance;
				nearestFoodIndex = foodIndex;
			}
		}
		this.foodTargetIndex = nearestFoodIndex;
		// alert(this.foodTargetIndex);
	}
	this.getXYSpeed = function(){
		var destX = foods[this.foodTargetIndex].position.x;
		var destY = foods[this.foodTargetIndex].position.y;
		var x = this.position.x;
		var y = this.position.y;
		if(x == destX){
			this.speedX = 0;
			if(destY > y){
				this.speedY = this.speed;
				return;
			}
			else{
				this.speedY = -this.speed;
				return;
			}
		}
		if(y == destY){
			this.speedY = 0;
			if(destX > x){
				this.speedX = this.speed;
				return;
			}
			else{
				this.speedX = -this.speed;
				return;
			}
		}
		var tan = (destY - y) / (destX - x);
		var theta = Math.abs(Math.atan(tan));
		var speedXabs = this.speed * Math.cos(theta);  
		var speedYabs = this.speed * Math.sin(theta);

		if(destX > x && destY > y){
			this.speedX = speedXabs;
			this.speedY = speedYabs;
			return;
		}
		if(destX > x && destY < y){
			this.speedX = speedXabs;
			this.speedY = -speedYabs;
			return;
		}
		if(destX < x && destY > y){
			this.speedX = -speedXabs;
			this.speedY = speedYabs;
			return;
		}
		if(destX < x && destY < y){
			this.speedX = -speedXabs;
			this.speedY = -speedYabs;
			return;
		}
	}
	this.changePosition = function(){
		this.position.x += this.speedX * intervalTime / 1000;
		this.position.y += this.speedY * intervalTime / 1000;
	}
	this.isNearFoodTarget = function(){
		var foodTargetPosition = foods[this.foodTargetIndex].position;
		return this.position.getDistance(foodTargetPosition.x, foodTargetPosition.y) < bugEatFoodDistance;
	}
	this.getFoodTarget();
	this.getXYSpeed();
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
	foodNumber = n;
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

function gameLose(){
	// gameContinue = false;
	clearInterval(generateBugTimeout);
	clearInterval(drawAllInterval);
	stopMouseClickEvent();
	if(score > highScore){
		highScore = score;
	}
	localStorage.setItem("highScore", highScore);
	disablePauseButton();
	alert("Game Over");
}

function drawAll(){
	var currentTime = new Date().getTime();
	var timeLeft = Math.ceil(TOTALTIME - (currentTime - startTime) / 1000 );
	if (timeLeft <= 0){
		if(level == 1){
			level = 2;
			clearInterval(generateBugTimeout);
			clearInterval(drawAllInterval);
			stopMouseClickEvent();
			startNewGame();
		}
		else{
			clearInterval(generateBugTimeout);
			clearInterval(drawAllInterval);
			stopMouseClickEvent();
			if(score > highScore){
				highScore = score;
			}
			localStorage.setItem("highScore", highScore);
			disablePauseButton();
			alert("congrats you win");
		}
	}
	timerText.innerHTML = timeLeft.toString();
	drawGameEnvironment();
	for(var bugIndex in bugs){
		if (bugs[bugIndex].status == ACTIVE){
			bugs[bugIndex].changePosition();
			if (bugs[bugIndex].isNearFoodTarget()){  // food eaten
				foods[bugs[bugIndex].foodTargetIndex].status = EATEN;
				foodNumber -= 1;
				if (foodNumber == 0){
					gameLose();
				}
				//update bugs' food target
				for(var bugIndex2 in bugs){
					bugs[bugIndex2].getFoodTarget();
					bugs[bugIndex2].getXYSpeed();
				}				
			}
			ctx.putImageData(bugs[bugIndex].image, Math.floor(bugs[bugIndex].position.x - bugRadius/2), Math.floor(bugs[bugIndex].position.y - bugRadius/2));
		}
	}
	for(var foodIndex in foods){
		if (foods[foodIndex].status == EXIST){
			ctx.putImageData(foods[foodIndex].image, Math.floor(foods[foodIndex].position.x - foodRadius/2), Math.floor(foods[foodIndex].position.y - foodRadius/2));
		}
	}
}

function enablePauseButton(){
	pauseButton.disabled = false;
	if(pauseButton.innerHTML == "pause"){
		pauseButton.removeEventListener("click");
		pauseButton.onclick = function(){
			pauseTime = new Date().getTime();
			pauseButton.innerHTML = "resume";
			clearInterval(drawAllInterval);
			clearInterval(generateBugTimeout);
			stopMouseClickEvent();
			enablePauseButton();
		}
	}
	else{
		pauseButton.removeEventListener("click");
		pauseButton.onclick = function(){
			var resumeTime = new Date().getTime();
			startTime += (resumeTime - pauseTime);
			pauseButton.innerHTML = "pause";
			drawAllInterval = setInterval(drawAll, intervalTime);
			generateBugTimeout = setTimeout(generateOneBug, Math.floor(randomFloatBetweenRange(1,3)*1000));
			startMouseClickEvent();
			enablePauseButton();
		}
	}
	
}
function disablePauseButton(){
	pauseButton.innerHTML = "pause";
	pauseButton.disabled = true;
}

function startMouseClickEvent(){
	canvas.onclick = function(e){
		var mouseX = e.pageX - canvas.offsetLeft;
		var mouseY = e.pageY - canvas.offsetTop;
		for (bugIndex in bugs) {
			if(bugs[bugIndex].status == ACTIVE && bugs[bugIndex].position.getDistance(mouseX, mouseY) < bugRadius){
				bugs[bugIndex].status = KILLED;
				score += bugs[bugIndex].score;
				scoreText.innerHTML = score.toString();
				return;
			}
		}
	}
}
function stopMouseClickEvent(){
	canvas.onclick = function(){
	}
}

function generateOneBug(){
	bugs.push(new Bug);
	generateBugTimeout = setTimeout(generateOneBug, Math.floor(randomFloatBetweenRange(1,3)*1000));
}

function startNewGame(){
	startTime = new Date().getTime();
	pauseButton.innerHTML = "pause";
	enablePauseButton();
	bugs = [];
	enablePauseButton();
	generateFood(FOODINITNUMBER);
	drawAllInterval = setInterval(drawAll, intervalTime);
	generateBugTimeout = setTimeout(generateOneBug, Math.floor(randomFloatBetweenRange(1,3)*1000));
	startMouseClickEvent();
}
//main
window.onload = function(){
	level = 1;  
	// gameContinue = true;
	drawAndSaveBugImage();  
	importFoodImage();
	drawGameEnvironment();
	startNewGame();
};




