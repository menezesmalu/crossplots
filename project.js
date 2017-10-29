var color = {
	points: "#7B68EE",
	lines: "black",
	linescontrol: "red",
	invisible: "#D3D3D3",
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
var height = 300;
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
	}
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
			console.log(btnbezier);
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
		drawBezierCurve();
	}

}

function resetScreen(){
	for(j in canvas)
		ctx[j].clearRect(0, 0, canvas[j].width, canvas[j].height);
	pointsy.splice(0,pointsy.length);
	pointsx.splice(0,pointsx.length);
	pcontrole.splice(0, pcontrole.length);
	pcontroley.splice(0, pcontroley.length);
	pcontrolex.splice(0, pcontrolex.length);
	for(var i in points){
		var c = drawPoint(points[i].x, points[i].y,0);
		var cy = drawPoint((width/points.length)*i, points[i].y, 1);
		pointsy.push(cy);
		var cx = drawPoint(points[i].x, (height/points.length)*i, 2);
		pointsx.push(cx);	
	}
	getBezier();
	mostrar();
}

function pot(a, b){
	var potencia = 1;
	for(var i = 0; i < b; i++)
		potencia = potencia*a;
	return potencia;
}
function fatorial(n){
	if(n == 1 || n ==0) return 1;
	else return n*fatorial(n-1);
}
function combinacao(n, i){
	var a = fatorial(n);
	var b = fatorial(i);
	var c = fatorial(n-i);
	return a/(b*c);
}
function bezier(t){
	var x0 = 0;
	var y0 = 0;
	var x1 = 0
	var y1 = 0;
	var x2 = 0
	var y2 = 0;
	for(var i = 0; i < points.length; i++){
		var comb = combinacao(points.length-1, i);
		x0 = x0 + (comb)*pot((1-t), points.length-i-1)*pot(t,i)*points[i].x;
		y0 = y0 + (comb)*pot((1-t), points.length-i-1)*pot(t,i)*points[i].y;

		x1 = x1 + (comb)*pot((1-t), pointsy.length-i-1)*pot(t,i)*pointsy[i].x;
		y1 = y1 + (comb)*pot((1-t), pointsy.length-i-1)*pot(t,i)*pointsy[i].y;

		x2 = x2 + (comb)*pot((1-t), pointsx.length-i-1)*pot(t,i)*pointsx[i].x;
		y2 = y2 + (comb)*pot((1-t), pointsx.length-i-1)*pot(t,i)*pointsx[i].y;
	}
	var b0 = {x: x0, y: y0}
	var b1 = {x: x1, y:y1};
	var b2 = {x: x2, y: y2}

	pcontrole.push(b0);	
	pcontroley.push(b1);	
	pcontrolex.push(b2);
}
function drawBezierCurve(av){
	for(var i = 1; i < pcontrole.length; i++){
		drawLine(pcontrole[i-1].x, pcontrole[i-1].y,pcontrole[i].x, pcontrole[i].y, color.linescontrol, 0 );
		drawLine(pcontroley[i-1].x, pcontroley[i-1].y,pcontroley[i].x, pcontroley[i].y, color.linescontrol, 1 );
		drawLine(pcontrolex[i-1].x, pcontrolex[i-1].y,pcontrolex[i].x, pcontrolex[i].y, color.linescontrol, 2 );
	}
}
function getBezier(){
	pcontrole.splice(0, pcontrole.length);
	pcontroley.splice(0, pcontroley.length);
	pcontrolex.splice(0, pcontrolex.length);
	if (valor.value != av) {av = parseInt(valor.value);
	for(var i = 0; i <= av; i++){
		bezier(i/av);
	}
	drawBezierCurve(av);
	}
}