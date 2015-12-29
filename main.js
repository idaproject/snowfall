function Flake(x,y,vx,vy,s) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.mx = Math.abs(vx * 2);
	this.vy = vy;
	this.my = vy;
	this.s = s;
	this.seed = Math.random() * 1e12;
	///
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		height = canvas.height = s * 2,
		width = canvas.width = s * 2,
		grad = context.createRadialGradient(s, s, 1, s, s, s);
	grad.addColorStop(0, 'rgba(255,255,255,.66)');
	grad.addColorStop(1, 'rgba(255,255,255,0)');
	context.beginPath();
	context.arc(s, s, s, 0, Math.PI * 2, !0);
	context.fillStyle = grad;
	context.fill();
	context.closePath();

	this.img = canvas;
}
Flake.prototype = {
	constructor: Flake,
	update: function() {
		this.x += this.vx;
		this.y += this.vy;

		if( this.x > width + this.s * 2 ) {
			this.x = 0 - this.s * 2;
		}
		if( this.x < 0 - this.s * 2 ) {
			this.x = width + this.s * 2;
		}

		if( this.y > height + this.s * 2 ) {
			this.y = 0 - this.s * 2;
		}
		if( this.y < 0 - this.s * 2 ) {
			this.y = height + this.s * 2;
		}
		if( Math.abs(this.vx) > this.mx ) {
			this.vx = this.vs > 0 ? this.mx : -1 * this.mx;
		}
		// direction modification is kinda cheap...
		this.vx += Math.sin(Date.now() + this.seed)/100;
		if( this.vy < this.my ) {
			this.vy += this.my/10;
		}
	}
};

var canvas, context, height, width, snow_count, hand_size, snow;

setTimeout(init, 10);

function init() {
	canvas = document.createElement('canvas');
	canvas.setAttribute("style", "position: fixed;top: 0;left: 0;z-index: 10000;width: 100%;height: 100%;pointer-events: none;");
	document.body.appendChild(canvas);
	
	context = canvas.getContext('2d');
	height = canvas.height = document.body.offsetHeight;
	width = canvas.width = document.body.offsetWidth;

	snow_count = 512;
	hand_size = 32;
	snow = [];

	for( var i = 0; i < snow_count; i++ ) {
		var x = Math.random() * width,
			y = Math.random() * height,
			s = Math.random() * 2.5 + 2.5,
			vx = Math.random() * 2 - 1,
			vy = Math.random() + s/2.5;
		snow.push(new Flake(x,y,vx,vy,s));
	}
	canvas.onmousemove = function(e) {
		for( var i = 0; i < snow_count; i++ ) {
			var dx = snow[i].x - e.clientX,
				dy = snow[i].y - e.clientY,
				d = Math.sqrt(dx*dx + dy*dy);
			if( d < hand_size ) {
				var r = Math.atan2(dy, dx);
				snow[i].vx = 2 * Math.cos(r);
				snow[i].vy = 2 * Math.sin(r);
			}
		}
	};
	update();
	render();
}
function update() {
	for( var i = 0; i < snow_count; i++ ) {
		snow[i].update();
	}
	setTimeout(update, 1000/30);
}
function render() {
	context.clearRect(0, 0, width, height);
	for( var i = 0; i < snow_count; i++ ) {
		context.drawImage(snow[i].img, snow[i].x - snow[i].s, snow[i].y - snow[i].s);
	}
	requestAnimationFrame(render);
}
