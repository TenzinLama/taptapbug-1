
function makeBug(x,y,color){
      var centerHeadx = x;
      var centerHeady = y;
 
      //whiskers
      context.beginPath();
      context.moveTo(centerHeadx, centerHeady);
      context.lineTo(centerHeadx - 10, centerHeady + 15);
      context.stroke();
       

      context.beginPath();
      context.moveTo(centerHeadx, centerHeady);
      context.lineTo(centerHeadx + 10, centerHeady + 15);
      context.stroke();

      //head
      context.beginPath();
      context.arc(centerHeadx, centerHeady, 10, 0, 2 * Math.PI, false);
      context.lineWidth = 1;
      context.fillStyle = color;
      context.fill();
      context.strokeStyle = '#550000';
      context.stroke();
      
      //eyes
      context.beginPath();
      context.arc(centerHeadx - 3, centerHeady + 7, 2, 0, 2*Math.PI);
      context.lineWidth = 1;
      context.fillStyle = 'white';
      context.fill();
      context.stroke();

      context.beginPath();
      context.arc(centerHeadx + 3, centerHeady + 7, 2, 0, 2*Math.PI);
      context.lineWidth = 1;
      context.fillStyle = 'white';
      context.fill();
      context.stroke();


      //legs
      context.beginPath();
      context.moveTo(centerHeadx, centerHeady-16);
      context.fillStyle = color;
      context.fill();
      context.lineTo(centerHeadx + 30, centerHeady - 30);
      context.stroke();
                   
      context.beginPath();
      context.moveTo(centerHeadx, centerHeady-16);
      context.fillStyle = color;
      context.fill();
      context.lineTo(centerHeadx + 30, centerHeady);
      context.stroke();

      context.beginPath();
      context.moveTo(centerHeadx, centerHeady-16);
      context.fillStyle = color;
      context.fill();
      context.lineTo(centerHeadx + 30, centerHeady - 14);
      context.stroke();

      //legs-leftside
      context.beginPath();
      context.moveTo(centerHeadx, centerHeady-16);
      context.fillStyle = color;
      context.fill();
      context.lineTo(centerHeadx - 30, centerHeady - 30);
      context.stroke();
                   
      context.beginPath();
      context.moveTo(centerHeadx, centerHeady-16);
      context.fillStyle = color;
      context.fill();
      context.lineTo(centerHeadx - 30, centerHeady);
      context.stroke();

      context.beginPath();
      context.moveTo(centerHeadx, centerHeady-16);
      context.fillStyle = color;
      context.fill();
      context.lineTo(centerHeadx - 30, centerHeady - 14);
      context.stroke();



      //body

      drawEllipse(centerHeadx, centerHeady - 20, 35, 43, color);   
}    
      

          
function drawEllipse(centerX, centerY, width, height, color) {
      
  context.beginPath();
  
  context.moveTo(centerX, centerY - height/2); // A1
  
  context.bezierCurveTo(
    centerX + width/2, centerY - height/2, // C1
    centerX + width/2, centerY + height/2, // C2
    centerX, centerY + height/2); // A2

  context.bezierCurveTo(
    centerX - width/2, centerY + height/2, // C3
    centerX - width/2, centerY - height/2, // C4
    centerX, centerY - height/2); // A1
 
  context.fillStyle = color;
  context.strokeStyle = '#550000';
  context.lineWidth = 1;
  context.fill();
  context.closePath();  
  context.stroke();
}
