let canvas;
let ctx;

let stroke = true;
let fill = false;
let fillColor = "#000000";
let lineColor = "#000000";
let lineWidth = 1;

let BLACK = "rgb(0,0,0)";
let WHITE = "rgb(255,255,255)";
let RED = "rgb(255,0,0)";
let GREEN = "rgb(0,255,0)";
let BLUE = "rgb(0,0,255)";

let PI_QUARTER = Math.PI/4;
let PI_HALF = Math.PI/2;
let PI = Math.PI;
let TWO_PI = 2*Math.PI;

function createCanvas(w,h){
    canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.style = "border:solid 2px;";
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
}

function clearCanvas(){
    setFill(WHITE);
    noStroke();
    drawRect(0,0,canvas.width,canvas.height);
}

function noStroke(){
    stroke = false;
}
function setStroke(color=BLACK,w=1){
    lineColor = color;
    lineWidth = w;
    stroke = true;
}

function noFill(){
    fill = false;
}

function setFill(color=BLACK){
    fillColor = color;
    fill = true;
}


function doDraw(){
    if(stroke){
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = lineWidth;
	ctx.stroke();
    }
    if(fill){
	ctx.fillStyle = fillColor;
	ctx.fill();
    }
}

function drawLine(x1,y1,x2,y2){
    ctx.save();
    ctx.beginPath();

    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);

    doDraw();

    ctx.closePath();
    ctx.restore();
}

function drawRect(x1,y1,w,h){
    ctx.save();
    ctx.beginPath();

    ctx.rect(x1,y1,w,h);

    doDraw();

    ctx.closePath();
    ctx.restore();
}

function drawCircle(x,y,r){
    ctx.save();
    ctx.beginPath();
    
    ctx.arc(x,y,r,0,2*Math.PI);

    doDraw();
    
    ctx.closePath();
    ctx.restore();
}
