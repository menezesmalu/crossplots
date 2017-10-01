var color = {
	circles: "#7B68EE",
	lines: "black",
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

function drawLine(x, y){
	ctx.beginPath();
		ctx.strokeStyle = color.lines;
		ctx.lineWidth = 1;
		ctx.moveTo(pointsX[pointsX.length -2], pointsY[pointsY.length-2]);
		ctx.lineTo(pointsX[pointsX.length-1], pointsY[pointsY.length-1]);
		ctx.stroke();
}

//canvas.addEventListener("mousedown", isDClick, false);

//canvas.addEventListener('dblclick', function{dclick = true}, false);

function getPoint(event){
	var x = event.x - rect.left;
	var y = event.y - rect.top;
	pointsX.push(x);
	pointsY.push(y);
	ctx.beginPath();
	var c = ctx.arc(x, y, circleRadius, 0, 2*Math.PI, false);
	ctx.fillStyle = color.circles;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = color.lines;
	ctx.stroke();
	circles.push(c);
	if(circles.length > 1){
		drawLine(x, y);
	}
}

function deletePoint(event){
	console.log("doubleclick funciona.");
	var x = event.x - rect.left;
	var y = event.y - rect.top;
	for(var i = 0; i < circles.length; i++){
		if(Math.sqrt((x - pointsX[i])*(x - pointsX[i])+ (y - pointsY[i])*(y - pointsY[i])) < circleRadius){
			//deleting the double clicked point
			pointsX.splice(i, 1);
			pointsY.splice(i, 1);
			circles.splice(i, 1);
			//conecting the points that where before and after the deleted one.
			ctx.beginPath();
			ctx.strokeStyle = color.lines;
			ctx.lineWidth = 1;
			ctx.moveTo(pointsX[i], pointsY[i]);
			ctx.lineTo(pointsX[i-1], pointsY[i-1]);
			ctx.stroke();
			console.log(circles);
		}
	}
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