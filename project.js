function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function resizeToFit() {
    var width = parseFloat(window.getComputedStyle(canvas).width);
    var height = parseFloat(window.getComputedStyle(canvas).height);
    resizeCanvas(width, height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = '5';
    ctx.fillStyle = 'blue';
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var circle = {
    x: 15,
    y: 100,
    radius: 15
};
var speed = 5;

resizeToFit();
draw();


setInterval(function() {
	var left = circle.x - 15 + speed;
	var right = circle.x + 15 + speed;
	if (left < 0 || right > canvas.width) {
		speed = -speed;
	}
	circle.x += speed;
	draw();
}, 1000 / 30);