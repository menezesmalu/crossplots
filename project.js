var color = {
	circles: "#7B68EE",
	lines: "black",

}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var pointsX = [];
var	pointsY = [];
var points = [];
var circleRadius = 5;


function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}


canvas.addEventListener("mousedown", getPosition, false);

function getPosition(event){
	var x = event.x;
	var y = event.y;

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	ctx.beginPath();
	ctx.arc(x, y, circleRadius, 0, 2*Math.PI, false);
	ctx.fillStyle = color.circles;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = color.lines;
	ctx.stroke();
}


