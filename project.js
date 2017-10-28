var color = {
	points: "#7B68EE",
	lines: "black",
	invisible: "#D3D3D3",
	button: "buttonface",
	button2: "red",
	text:"black",
	text2: "white",
}
var canvas = [
	document.getElementById('canvas'),
	document.getElementById('canvas_y'),
	document.getElementById('canvas_x')
];
var ctx = [
	canvas[0].getContext('2d'),
	canvas[1].getContext('2d'),
	canvas[2].getContext('2d')
];
var rect = [
	canvas[0].getBoundingClientRect(),
	canvas[1].getBoundingClientRect(),
	canvas[2].getBoundingClientRect()
];
var points = [];
var pointsy = [];
var pointsx = [];
var circleRadius = 5;
var btnpoints = true;
var btnlines = true;
var move = -1;
var width = 500;
var height = 300;


function resizeCanvas() {
	for(i in canvas){
		canvas[i].width = width;
		canvas[i].height = height;
	}
}

function isInCircle(event){
	var x = event.x - rect[0].left;
	var y = event.y - rect[0].top;
	for(var i in points){
		if(Math.sqrt((x - points[i].x)*(x - points[i].x)+ (y - points[i].y)*(y - points[i].y)) < circleRadius){
			return i;
		}
	}
	return -1;
}
function drawLine(x, y, xp, yp, colorpick, i){
	ctx[i].beginPath();
	ctx[i].strokeStyle = colorpick;
	ctx[i].lineWidth = 1;
	ctx[i].moveTo(xp, yp);
	ctx[i].lineTo(x, y);
	ctx[i].stroke();
}
function drawPoint(x, y, i){
	ctx[i].beginPath();
	ctx[i].lineWidth = 1;
	ctx[i].strokeStyle = color.lines;
	ctx[i].fillStyle = color.points;
	var c = ctx[i].arc(x, y, circleRadius, 0, 2*Math.PI, false);
	ctx[i].stroke();
	ctx[i].fill();
	var pnt = {x: x, y: y};
	return pnt;
}
canvas[0], addEventListener('mousedown', event =>{
	var x = event.x - rect[0].left;
	var y = event.y - rect[0].top;
	if(isInCircle(event) == -1){
		getPoint(event);
	} else {
		move = isInCircle(event);
	}
})
canvas[0].addEventListener('dblclick', event =>{
	if(isInCircle != -1){
		deletePoint(event);
	}
})
canvas[0].addEventListener('mousemove', function(event) {
    if (move != -1) {
    	points[move].x = event.offsetX;
		points[move].y = event.offsetY;
        resetScreen();
    }
});
canvas[0].addEventListener('mouseup', function(event) {
    move = -1;
});
function getPoint(event){
	//define the point
	var x = event.x - rect[0].left;
	var y = event.y - rect[0].top;
	//design the point
	if(x>0 && x <500 && y>0 && y<290){
		var c = drawPoint(x, y,0);
		points.push(c);
		if(points.length > 1) 
			drawLine(points[points.length-1].x, points[points.length-1].y, points[points.length-2].x, points[points.length-2].y, color.lines,0);
		resetScreen();
		pointsy.splice(0, pointsy.length);
		pointsx.splice(0, pointsx.length);
		for(var i in points){
			var cy = drawPoint((width/points.length)*i, points[i].y, 1);
			pointsy.push(cy);
			var cx = drawPoint(points[i].x, (height/points.length)*i, 2);
			pointsx.push(cx);	
			if(pointsx.length > 1){
				drawLine(pointsy[pointsy.length-1].x, pointsy[pointsy.length-1].y, pointsy[pointsy.length-2].x, pointsy[pointsy.length-2].y, color.lines,1);
				drawLine(pointsx[pointsx.length-1].x, pointsx[pointsx.length-1].y, pointsx[pointsx.length-2].x, pointsx[pointsx.length-2].y, color.lines,2);
			}
		}
	}
}

function deletePoint(event){
	var i = isInCircle(event);
	if(i != -1){
		//deleting the double clicked point
		points.splice(i, 1);
		resetScreen();
	}
}
//mudar isso dps  desenhar
function btnPoints(){
	//nao mostrar pontos
	var btn = document.getElementById('pontos');
	if(btnpoints){
		btn.style.backgroundColor = color.button2;
		btn.style.color = color.text2;
		for(j in canvas)
			ctx[j].clearRect(0, 0, canvas[j].width, canvas[j].height);
		for(var i=1; i< points.length; i++){
			if(btnlines){
				drawLine(points[i].x, points[i].y, points[i-1].x, points[i-1].y, color.lines,0);
				drawLine(pointsy[i].x, pointsy[i].y, pointsy[i-1].x, pointsy[i-1].y, color.lines,1);
				drawLine(pointsx[i].x, pointsx[i].y, pointsx[i-1].x, pointsx[i-1].y, color.lines,2);
			}
		}
	} else { // mostrar pontos
		btn.style.backgroundColor = color.button;
		btn.style.color = color.text;
		for(var i in points){
			var c = drawPoint(points[i].x, points[i].y, 0);
			c = drawPoint(pointsy[i].x, pointsy[i].y, 1);
			c = drawPoint(pointsx[i].x, pointsx[i].y,2);
		}
	}
	btnpoints = !btnpoints;
}

//mudar isso dps  desenhar
function btnLines(){ //nao mostrar linhas
	var btn = document.getElementById('poligonal');
	if(btnlines){
		btn.style.backgroundColor = color.button2;
		btn.style.color = color.text2;
		for(j in canvas)
			ctx[j].clearRect(0, 0, canvas[j].width, canvas[j].height);
		for(var i in points){
			if(btnpoints){
				var c = drawPoint(points[i].x, points[i].y, 0);
				c = drawPoint(pointsy[i].x, pointsy[i].y, 1);
				c = drawPoint(pointsx[i].x, pointsx[i].y,2);
			}
		}
	} else { // mostrar pontos
		console.log(btnlines);
		btn.style.backgroundColor = color.button;
		btn.style.color = color.text;
		for(var i=1; i< points.length; i++){
			drawLine(points[i].x, points[i].y, points[i-1].x, points[i-1].y, color.lines,0);
			drawLine(pointsy[i].x, pointsy[i].y, pointsy[i-1].x, pointsy[i-1].y, color.lines,1);
			drawLine(pointsx[i].x, pointsx[i].y, pointsx[i-1].x, pointsx[i-1].y, color.lines,2);
		}
	}
	btnlines = !btnlines;
}

function resetScreen(){
	for(j in canvas)
	ctx[j].clearRect(0, 0, canvas[j].width, canvas[j].height);
	pointsy.splice(0,pointsy.length);
	pointsx.splice(0,pointsx.length);
	for(var i in points){
		var c = drawPoint(points[i].x, points[i].y,0);
		var cy = drawPoint((width/points.length)*i, points[i].y, 1);
		pointsy.push(cy);
		var cx = drawPoint(points[i].x, (height/points.length)*i, 2);
		pointsx.push(cx);	
		if(i > 0) {
			drawLine(points[i].x, points[i].y, points[i-1].x, points[i-1].y, color.lines, 0);
			drawLine(pointsy[pointsy.length-1].x, pointsy[pointsy.length-1].y, pointsy[pointsy.length-2].x, pointsy[pointsy.length-2].y, color.lines,1);
			drawLine(pointsx[pointsx.length-1].x, pointsx[pointsx.length-1].y, pointsx[pointsx.length-2].x, pointsx[pointsx.length-2].y, color.lines,2);
		}
	}
}
