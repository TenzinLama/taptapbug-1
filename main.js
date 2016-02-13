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
var bugImageElement = [
	document.getElementById("blackBugImage"),
	document.getElementById("redBugImage"),
	document.getElementById("orangeBugImage")
];
var foodImage;
var canvasWidth = 600;
var canvasHeight = 400;
var bugRadius = 30;   //do not change it
var foodRadius = 30;  
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
var TOTALTIME = 60;   //change to 60 later
var highScore = 0;

// localStorage.setItem("highScore", 0);

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
function ctxRotateDegree(degree){
	// alert("enter");
	ctx.rotate(degree * Math.PI / 180);
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
	this.image = bugImageElement[bugType];
	this.status = ACTIVE;  
	var randomX = randomIntergerBetweenRange(bugXCoordinateMin, bugXCoordinateMax);
	this.position = new Position(randomX, bugYCoordinateInitial);
	this.angle = 0;  //degree of angle representing orientation
	this.axisPostion = new Position(0, 0); //???

	this.draw = function(){
		this.axisPostion.x = this.position.x + bugRadius / 2 * Math.sin(this.angle * Math.PI / 180) - bugRadius / 2 * Math.cos(this.angle * Math.PI / 180);
		this.axisPostion.y = this.position.y - bugRadius / 2 * Math.sin(this.angle * Math.PI / 180) - bugRadius / 2 * Math.cos(this.angle * Math.PI / 180);
		ctx.translate(this.axisPostion.x, this.axisPostion.y);
		ctxRotateDegree(this.angle);
		ctx.drawImage(this.image, 0, 0);
		ctxRotateDegree(-this.angle);
		ctx.translate(-this.axisPostion.x, -this.axisPostion.y);
	}	

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
	this.changePosition = function(makeWay){
		if(makeWay == 0){
			this.position.x += this.speedX * intervalTime / 1000;
			this.position.y += this.speedY * intervalTime / 1000;
		}
		else if(makeWay == 1){
			console.log("right");
			var makeWaySpeedX = - this.speedY;
			var makeWaySpeedY = this.speedX;
			this.position.x += makeWaySpeedX * intervalTime / 1000;
			this.position.y += makeWaySpeedY * intervalTime / 1000;
			this.getFoodTarget();
			this.getXYSpeed();
			this.getAngle();
		}
		else{
			console.log("left");
			var makeWaySpeedX = this.speedY;
			var makeWaySpeedY = -this.speedX;
			this.position.x += makeWaySpeedX * intervalTime / 1000;
			this.position.y += makeWaySpeedY * intervalTime / 1000;
			this.getFoodTarget();
			this.getXYSpeed();
			this.getAngle();
		}
	}
	this.isNearFoodTarget = function(){
		var foodTargetPosition = foods[this.foodTargetIndex].position;
		return this.position.getDistance(foodTargetPosition.x, foodTargetPosition.y) < bugEatFoodDistance;
	}
	this.getAngle = function(){
		var x = this.position.x;
		var y = this.position.y;
		var foodX = foods[this.foodTargetIndex].position.x;
		var foodY = foods[this.foodTargetIndex].position.y;
		if (foodY == y) {
			if(foodX < x){
				this.angle = 90;
				return;
			}
			else{
				this.angle = -90;
				return;
			}
		}
		var degree = Math.atan((x - foodX) / (foodY - y)) / Math.PI * 180;
		this.angle = degree;
		if(foodY < y){
			this.angle += 180;
		}
	}
	this.getFoodTarget();
	this.getXYSpeed();
	this.getAngle();
}

// define the Food class
function Food(){
	this.image = foodImage;
	var randomX = randomIntergerBetweenRange(foodXCoordinateMin, foodXCoordinateMax);
	var randomY = randomIntergerBetweenRange(foodYCoordinateMin, foodYCoordinateMax);
	this.position = new Position(randomX, randomY);
	this.status = EXIST;
}

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
}

//draw the game background
function drawGameEnvironment(){
	ctx.fillStyle = "#FFFFCC";
	ctx.fillRect(0,0,600,400);
}

//draw the image of three colors of bugs and save them to blackBugImage, redBugImage and orangeBugImage
function drawAndSaveBugImage(){
	canvas.width = 30;
	canvas.height = 30;
	// var bugx = 20;
	// var bugy = 50;

	var bugx = 15;
	var bugy = 11;

	var rectx = 40;
	var recty = 50;

	var leftOffSetx = 20;
	var leftOffSety = 20;

	makeBug(bugx,bugy + 10,"black");
	bugImageElement[BLACK].src = canvas.toDataURL();
	// bugImage[BLACK] = ctx.getImageData(bugx - leftOffSetx,bugy - leftOffSety,rectx,recty);
	// bugImage[BLACK] = canvas.toDataURL();
	makeBug(bugx,bugy + 10,"red");
	bugImageElement[RED].src = canvas.toDataURL();
	// bugImage[RED] = ctx.getImageData(bugx - leftOffSetx,bugy-leftOffSety,rectx, recty);
	// bugImage[RED] = canvas.toDataURL();
	

	makeBug(bugx,bugy + 10,"orange");
	bugImageElement[ORANGE].src = canvas.toDataURL();

	canvas.width = 600;
	canvas.height = 400;

	ctx.translate(100,100);
	ctxRotateDegree(30);
	ctx.drawImage(bugImageElement[RED],0, 0);
	ctxRotateDegree(-30);
	ctx.translate(-100,-100);
}

// import food image and save to variable foodImage 
function importFoodImage(){
	foodImage = document.getElementById("foodImage");
	// alert("h");
	ctx.drawImage(foodImage,50,50);
	// ctx.fillStyle = "blue";
	// ctx.fillRect(0,0,20,20);
	//foodImage = ctx.getImageData(50,50,20,20);
}

function gameLose(){
	// gameContinue = false;
	clearInterval(generateBugTimeout);
	clearInterval(drawAllInterval);
	stopMouseClickEvent();
	updateHighScore();
	// if(score > highScore){
	// 	highScore = score;
	// }
	// localStorage.setItem("highScoreForLevel" + level.toString(), highScore);
	disablePauseButton();
	alert("Game Over");
}
function updateHighScore(){
	var key = "highScoreForLevel" + level.toString();
	var highScore = localStorage.getItem(key);
	if(score > highScore){
		localStorage.setItem(key, score.toString());
	}
}
function drawAll(){
	var currentTime = new Date().getTime();
	var timeLeft = Math.ceil(TOTALTIME - (currentTime - startTime) / 1000 );
	if (timeLeft <= 0){
		updateHighScore();
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
			disablePauseButton();
			alert("congrats you win");
		}
	}
	timerText.innerHTML = timeLeft.toString();
	drawGameEnvironment();
	for(var bugIndex in bugs){
		var makeWay = 0;
		for(var bugIndex2 in bugs){
			if(bugs[bugIndex] != bugs[bugIndex2] && bugs[bugIndex].status == ACTIVE && bugs[bugIndex2].status == ACTIVE){
				var distance = bugs[bugIndex].position.getDistance(bugs[bugIndex2].position.x, bugs[bugIndex2].position.y);
				if(distance <= 40){
					if(bugs[bugIndex].speed <= bugs[bugIndex2].speed){
						var makeWaySpeedX = -bugs[bugIndex].speedY;  //try turn right
						var makeWaySpeedY = bugs[bugIndex].speedX;
						var virtualPosition = new Position(bugs[bugIndex].position.x + makeWaySpeedX / 50, bugs[bugIndex].position.y + makeWaySpeedY / 50) 
						var virtualDistance = virtualPosition.getDistance(bugs[bugIndex2].position.x, bugs[bugIndex2].position.y);
						if(virtualDistance > distance){  //good guess
							makeWay = 1;
						}
						else{
							makeWay = 2;
						}
						break;
					}
				}
			}
		}
		

		if (bugs[bugIndex].status == ACTIVE){
			bugs[bugIndex].changePosition(makeWay);
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
					bugs[bugIndex2].getAngle();
				}				
			}
			bugs[bugIndex].draw();
		}
	}
	for(var foodIndex in foods){
		if (foods[foodIndex].status == EXIST){
			ctx.drawImage(foodImage, Math.floor(foods[foodIndex].position.x - foodRadius/2), Math.floor(foods[foodIndex].position.y - foodRadius/2));
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
	score = 0;
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
	// level = parseInt(localStorage.getItem("level"));
	level = 1;  
	drawAndSaveBugImage();  
	importFoodImage();
	drawGameEnvironment();
	startNewGame();
};

function makeBug(x,y,color){
      var centerHeadx = x;
      var centerHeady = y;
      scale = .50;

      //background
 	  ctx.fillStyle = "#FFFFCC";
 	  ctx.fillRect(0,0,600,400);

      //whiskers
      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady);
      ctx.lineTo(centerHeadx - 10*scale, centerHeady + 15*scale);
      ctx.stroke();
       

      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady);
      ctx.lineTo(centerHeadx + 10*scale, centerHeady + 15*scale);
      ctx.stroke();

      //head
      ctx.beginPath();
      ctx.arc(centerHeadx, centerHeady, 10*scale, 0*scale, 2 * Math.PI, false);
      ctx.lineWidth = 1;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#550000';
      ctx.stroke();
      
      //eyes
      ctx.beginPath();
      ctx.arc(centerHeadx - 3*scale, centerHeady + 7*scale, 2*scale, 0*scale, 2*Math.PI);
      ctx.lineWidth = 1;
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerHeadx + 3*scale, centerHeady + 7*scale, 2*scale, 0, 2*Math.PI);
      ctx.lineWidth = 1;
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.stroke();


      //legs
      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady-16*scale);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineTo(centerHeadx + 30*scale, centerHeady - 30*scale);
      ctx.stroke();
                   
      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady-16*scale);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineTo(centerHeadx + 30*scale, centerHeady);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady-16*scale);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineTo(centerHeadx + 30*scale, centerHeady - 14*scale);
      ctx.stroke();

      //legs-leftside
      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady-16*scale);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineTo(centerHeadx - 30*scale, centerHeady - 30*scale);
      ctx.stroke();
                   
      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady-16*scale);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineTo(centerHeadx - 30*scale, centerHeady);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerHeadx, centerHeady-16*scale);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineTo(centerHeadx - 30*scale, centerHeady - 14*scale);
      ctx.stroke();



      //body

      drawEllipse(centerHeadx, centerHeady - 20*scale, 35*scale, 43*scale, color);   
}    
               
function drawEllipse(centerX, centerY, width, height, color) {
      
  ctx.beginPath();
  
  ctx.moveTo(centerX, centerY - height/2); // A1
  
  ctx.bezierCurveTo(
    centerX + width/2, centerY - height/2, // C1
    centerX + width/2, centerY + height/2, // C2
    centerX, centerY + height/2); // A2

  ctx.bezierCurveTo(
    centerX - width/2, centerY + height/2, // C3
    centerX - width/2, centerY - height/2, // C4
    centerX, centerY - height/2); // A1
 
  ctx.fillStyle = color;
  ctx.strokeStyle = '#550000';
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.closePath();  
  ctx.stroke();
}




