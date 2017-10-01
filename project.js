var color = {
	circles: "#7B68EE",
	lines: "black",
	invisible: "#D3D3D3",
	button: "buttonface",
	button2: "red",
	text:"black",
	text2: "white",
}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();
var pointsX = [];
var	pointsY = [];
var points = [];
var circleRadius = 5;
var circles = [];
var clickCount = 0;
var clicked;
var btnpoints = true;
var btnlines = true;
var move = -1;
var circle = {
	x: 0,
	y: 0,
	radius: circleRadius,
}

function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function isInCircle(event){
	var x = event.x - rect.left;
	var y = event.y - rect.top;
	for(var i = 0; i < circles.length; i++){
		if(Math.sqrt((x - pointsX[i])*(x - pointsX[i])+ (y - pointsY[i])*(y - pointsY[i])) < circleRadius){
			return i;
		}
	}
	return -1;
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
	ctx.lineWidth = 1;
	ctx.strokeStyle = color.lines;
	ctx.fillStyle = color.circles;
	var c = ctx.arc(x, y, circleRadius, 0, 2*Math.PI, false);
	ctx.stroke();
	ctx.fill();
	return c;
}

canvas.addEventListener('mousedown', function(event) {
	console.log(event);
    clickCount++;
    if (clickCount == 1) {
    	clicked = true;
        singleClickTimer = setTimeout(function() {
            clickCount = 0;
            if(move == -1) 
            	getPoint(event);
        }, 400);
    } else if (clickCount == 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
        deletePoint(event);
    }
}, false);

canvas.addEventListener('mousedown', function(event) {
	console.log("mousedown");
	move = isInCircle(event) 
});

canvas.addEventListener('mousemove', function(event) {
    if (move != -1) {
    	pointsX[move] = event.offsetX;
		pointsY[move] = event.offsetY;
        resetScreen();
    }
});

canvas.addEventListener('mouseup', function(event) {
	//resetScreen();
    move = -1;
});

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
	var i = isInCircle(event);
	if(i != -1){
		//deleting the double clicked point
		pointsX.splice(i, 1);
		pointsY.splice(i, 1);
		circles.splice(i, 1);
		console.log(circles.length);
		resetScreen();
	}
}

function btnPoints(){
	//nao mostrar pontos
	var btn = document.getElementById('pontos');
	if(btnpoints){
		btn.style.backgroundColor = color.button2;
		btn.style.color = color.text2;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 1; i < circles.length; i++){
			if(btnlines){
				drawLine(pointsX[i], pointsY[i], pointsX[i-1], pointsY[i-1], color.lines);
			}
		}
		btnpoints = !btnpoints;
	} else { // mostrar pontos
		btn.style.backgroundColor = color.button;
		btn.style.color = color.text;
		for(var i = 0; i < circles.length; i++)
				var c = drawPoint(pointsX[i], pointsY[i]);
		btnpoints = !btnpoints;
	}
}

function btnLines(){
	var btn = document.getElementById('poligonal');
	if(btnlines){
		btn.style.backgroundColor = color.button2;
		btn.style.color = color.text2;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < circles.length; i++){
			if(btnpoints)
				var c = drawPoint(pointsX[i], pointsY[i]);
		}
		btnlines = !btnlines;
	} else { // mostrar pontos
		btn.style.backgroundColor = color.button;
		btn.style.color = color.text;
		for(var i = 1; i < circles.length; i++)
			drawLine(pointsX[i], pointsY[i], pointsX[i-1], pointsY[i-1], color.lines);
		btnlines = !btnlines;
	}
}

function resetScreen(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < circles.length; i++){
		var c = drawPoint(pointsX[i], pointsY[i]);
		if(i > 0) drawLine(pointsX[i], pointsY[i], pointsX[i-1], pointsY[i-1], color.lines);
	}
}
