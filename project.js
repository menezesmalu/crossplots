var color = {
	points: "#7B68EE",
	lines: "black",
	invisible: "#D3D3D3",
	bezier: "red"
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
var pcontrole = [];
var pcontroley = [];
var pcontrolex = [];
var circleRadius = 5;
var btnpoints = true;
var btnlines = true;
var btnbezier = true;
var move = -1;
var width = 500;
var height = 280;
var valor = document.getElementById('input_av');
var av = 10;
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

canvas[0].addEventListener('mousedown', event =>{
	var x = event.x - rect[0].left;
	var y = event.y - rect[0].top;
	if(x>0 && x <500 && y>0 && y<280){
		btnpoints = btnlines = btnbezier = true;
		if(isInCircle(event) == -1){
			setPoint(event);
		} else {
			move = isInCircle(event);
		}
	}
})
canvas[0].addEventListener('dblclick', event =>{
	if(isInCircle != -1){
		var i = isInCircle(event);
		if(i != -1){
			points.splice(i, 1);
			resetScreen();
		}
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

function setPoint(event){
	var x = event.x - rect[0].left;
	var y = event.y - rect[0].top;
	var c = drawPoint(x, y,0);
	points.push(c);
	if(points.length > 1) 
		drawLine(points[points.length-1].x, points[points.length-1].y, points[points.length-2].x, points[points.length-2].y, color.lines,0);
	resetScreen();
}

function btnClicked(botao){
	var btn;
	switch(botao){
		case 'btnlines':
			btn = document.getElementById('poligonal');
			btnlines = !btnlines;
			break;
		case 'btnpoints':
			btn = document.getElementById('pontos');
			btnpoints = !btnpoints;
			break;
		case 'btnbezier':
			btn = document.getElementById('bezier');
			btnbezier = !btnbezier;
			break;
	}
	mostrar();	
	
}
function mostrar(){
	for(j in canvas)
		ctx[j].clearRect(0, 0, canvas[j].width, canvas[j].height);
	if(btnlines){
		for(var i=1; i< points.length; i++){
			drawLine(points[i].x, points[i].y, points[i-1].x, points[i-1].y, color.lines,0);
			drawLine(pointsy[i].x, pointsy[i].y, pointsy[i-1].x, pointsy[i-1].y, color.lines,1);
			drawLine(pointsx[i].x, pointsx[i].y, pointsx[i-1].x, pointsx[i-1].y, color.lines,2);
		}
	} if(btnpoints){
		for(var i in points){
			var c = drawPoint(points[i].x, points[i].y, 0);
			c = drawPoint(pointsy[i].x, pointsy[i].y, 1);
			c = drawPoint(pointsx[i].x, pointsx[i].y,2);
		}
	} if (btnbezier){
		drawBezierCurve(av, color.bezier);
	}
}

function resetScreen(){
	removeBezier();
	getBezier();
}


function removeBezier(){
	for(j in canvas) {
		ctx[j].clearRect(0, 0, canvas[j].width, canvas[j].height);
	}
	pointsy.splice(0,pointsy.length);
	pointsx.splice(0,pointsx.length);
	var x = width/(points.length+1);
	var y = height/(points.length+1);
	for(var i in points){
		var c = drawPoint(points[i].x, points[i].y,0);
		var cy = drawPoint(x, points[i].y, 1);
		var cx = drawPoint(points[i].x, y, 2);
		pointsy.push(cy);
		pointsx.push(cx);
		x = x+width/(points.length+1);
		y = y+height/(points.length+1);	
		if(i > 0) {
			drawLine(points[i].x, points[i].y, points[i-1].x, points[i-1].y, color.lines, 0);
			drawLine(pointsy[pointsy.length-1].x, pointsy[pointsy.length-1].y, pointsy[pointsy.length-2].x, pointsy[pointsy.length-2].y, color.lines,1);
			drawLine(pointsx[pointsx.length-1].x, pointsx[pointsx.length-1].y, pointsx[pointsx.length-2].x, pointsx[pointsx.length-2].y, color.lines,2);
		}
	}
}

function deCasteljau(control, i, j, t){
	if(j == 0) return control[i];
	var first = deCasteljau(control, i, j-1,t);
	var second = deCasteljau(control, i+1, j-1,t);
	return{
		x: first.x*(1-t) + second.x*t,
		y: first.y*(1-t) + second.y*t
	}
}
function bezier(t){
	var bezieru = deCasteljau(points,0,points.length-1,t);
	var beziery = deCasteljau(pointsy,0,pointsy.length-1,t);
	var bezierx = deCasteljau(points,0,points.length-1,t);

	pcontrole.push(bezieru);	
	pcontroley.push(beziery);	
	pcontrolex.push(bezierx);
}
function drawBezierCurve(av, colorpick){
	for(var i = 1; i < pcontrole.length; i++){
		drawLine(pcontrole[i-1].x, pcontrole[i-1].y,pcontrole[i].x, pcontrole[i].y, colorpick, 0 );
		drawLine(pcontroley[i-1].x, pcontroley[i-1].y,pcontroley[i].x, pcontroley[i].y, colorpick, 1 );
		drawLine(pcontrolex[i-1].x, pcontrolex[i-1].y,pcontrolex[i].x, pcontrolex[i].y, colorpick, 2 );
	}
}
function getBezier(){
	pcontrole.splice(0, pcontrole.length);
	pcontroley.splice(0, pcontroley.length);
	pcontrolex.splice(0, pcontrolex.length);
	av = parseInt(valor.value);
	for(var i = 0; i <= av; i++){
		bezier(i/av);
	}
	drawBezierCurve(av, color.bezier);
}

function changeBezier(){
	removeBezier();
	getBezier();
}