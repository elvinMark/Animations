var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var w = 2 * Math.PI;
var X0 = canvas.width / 2;
var Y0 = canvas.height / 2;
var radius = [100, 40, 23, 10];
var thetas = [1.3, 2, 2.7, 3.2];
var t = 0;
var dt = 0.1;
var points = [];
var total_points = 100;

function clearCanvas() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
}

function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

function drawLine(x0, y0, x1, y1, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
}

function drawLines(arr, color) {
    i = 0;
    for (var i = 1; i < arr.length; i++) {
        drawLine(arr[i - 1][0], arr[i - 1][1], arr[i][0], arr[i][1], color);
    }
}


function drawCircles(radius, thetas, t, color) {
    var xc = X0;
    var yc = Y0;
    var xtmp, ytmp;
    var angle;
    for (i in radius) {
        drawCircle(xc, yc, radius[i], color);
        angle = w * i * t + thetas[i];
        xtmp = xc + radius[i] * Math.cos(angle);
        ytmp = yc + radius[i] * Math.sin(angle);
        drawLine(xc, yc, xtmp, ytmp);
        xc = xtmp;
        yc = ytmp;
    }
    return [xc, yc];
}

function update() {
    clearCanvas();
    last_coord = drawCircles(radius, thetas, t, "rgba(255,0,0,0.4)");
    if (points.length > 2000)
        points = [];
    points.push(last_coord);
    drawLines(points, "rgb(0,255,0)");
    t += dt;
}

function Complex(real, img) {
    this.real = real;
    this.img = img;

    this.plus = (c1) => {
        return new Complex(this.real + c1.real, this.img + c1.img);
    };

    this.minus = (c1) => {
        return new Complex(this.real - c1.real, this.img - c1.img);
    };

    this.mult = (c1) => {
        return new Complex(this.real * c1.real - this.img * c1.img, this.real * c1.img + this.img * c1.real);
    };

    this.conj = () => {
        return new Complex(this.real, this.img);
    };

    this.norm = () => {
        return Math.sqrt(this.real * this.real + this.img * this.img);
    };

    this.phase = () => {
        return Math.atan2(this.img, this.real);
    };

    this.exp = () => {
        var r = Math.exp(this.real);
        return new Complex(r * Math.cos(this.img), r * Math.sin(this.img));
    }
}

function dft(arr, desired_points) {
    var N = arr.length;
    var out = [];
    for (var i = 0; i < desired_points; i++) {
        var tmp = new Complex(0, 0);
        for (var j in arr) {
            tmp = tmp.plus((new Complex(0, - 2 * Math.PI * i * j / desired_points)).exp().mult(arr[j]));
        }
        out.push(new Complex(tmp.real / desired_points, tmp.img / desired_points));
    }
    return out;
}

var flag = false;
var puntos = [];
var xi = [];

document.onmousedown = function (event) {
    flag = !flag;
}

document.onmousemove = function (event) {
    if (flag) {
        puntos.push([event.offsetX, event.offsetY]);
        xi.push(new Complex((event.offsetX - 250), (event.offsetY - 250)));
        // clearCanvas();
        drawLines(puntos, "rgb(0,0,255)");
    }
}


function startDrawing() {
    total_points = xi.length;
    desired_points = total_points;
    console.log(total_points);
    xk = dft(xi, desired_points);
    radius = [];
    thetas = [];
    for (var i = 0; i < desired_points; i++) {
        radius.push(xk[i].norm());
        thetas.push(xk[i].phase());
    }
    dt = 1 / desired_points;
    flag = false;
    console.log(radius);
    console.log(thetas);
    setInterval(update, 1000 / 60);
}