var color = {
	circles: "#7B68EE",
	lines: "black",
	invisible: "#D3D3D3",
}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();
var pointsX = [];
var	pointsY = [];
var points = [];
var circleRadius = 4;
var circles = [];
var clickCount = 0;

function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function drawLine(x, y, xp, yp, colorpick){
	ctx.beginPath();
	ctx.strokeStyle = colorpick;
	ctx.lineWidth = 1;
	ctx.moveTo(xp, yp);
	ctx.lineTo(x, y);
	ctx.stroke();
}

function drawPoint(x, y){
	ctx.beginPath();
	var c = ctx.arc(x, y, circleRadius, 0, 2*Math.PI, false);
	ctx.fillStyle = color.circles;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = color.lines;
	ctx.stroke();
	return c;
}

canvas.addEventListener('mousedown', function(event) {
    clickCount++;
    if (clickCount == 1) {
        singleClickTimer = setTimeout(function() {
        	console.log("single");
            clickCount = 0;
            getPoint(event);
        }, 400);
    } else if (clickCount == 2) {
    	console.log("double");
        clearTimeout(singleClickTimer);
        clickCount = 0;
        deletePoint(event);
    }
}, false);

function getPoint(event){
	//define the point
	var x = event.x - rect.left;
	var y = event.y - rect.top;
	pointsX.push(x);
	pointsY.push(y);
	//design the point
	var c = drawPoint(x, y);
	circles.push(c);

	if(circles.length > 1){
		drawLine(x, y, pointsX[pointsX.length-2], pointsY[pointsY.length-2], color.lines);
	}
}

function deletePoint(event){
	var x = event.x - rect.left;
	var y = event.y - rect.top;
	for(var i = 0; i < circles.length; i++){
		if(Math.sqrt((x - pointsX[i])*(x - pointsX[i])+ (y - pointsY[i])*(y - pointsY[i])) < circleRadius){
			console.log("delete");
			//deleting the double clicked point
			pointsX.splice(i, 1);
			pointsY.splice(i, 1);
			circles.splice(i, 1);
			console.log(circles.length);
			resetScreen();
		}
	}
}

function resetScreen(){
	ctx.beginPath();
	ctx.strokeStyle = color.invisible;
	ctx.fillStyle = color.invisible;
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.stroke();
	ctx.fill();
	console.log(circles.length);
	for(var i = 0; i < circles.length; i++){
		console.log("aa");		
		var c = drawPoint(pointsX[i], pointsY[i]);
		if(i > 0) drawLine(pointsX[i], pointsY[i], pointsX[i-1], pointsY[i-1], color.lines);
	}
}