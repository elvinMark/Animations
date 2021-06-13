let points = [];
let r = 5;
let pivoted = [];
let line = [];
let pivot;
let rotAngle = 0;
let dangle = 0.05;
let w;
let h;
let prec = 0.03;

let pivotFlag = true;
let lineFlag = false;
let startRotating = false;

function createRandom2dPoints(N){
    points = [];
    for(let i = 0; i<N;i++){
	points.push([0.9*w*Math.random(),10 + 0.9*h*Math.random()]);
	pivoted.push(0);
    }
}

function drawPoints(){
    setFill(GRAY);
    setStroke(BLACK,5);
    for(let i in points){
	drawCircle(points[i][0],points[i][1],r);
	drawText(points[i][0],points[i][1],pivoted[i] + " ");
    }
}

function drawWindmill(){
    setStroke(GREEN,4);
    drawLine(pivot[0] - 2*w*line[0],pivot[1] - 2*w*line[1],pivot[0] + 2*w*line[0],pivot[1] + 2*w*line[1]);
}

function drawPivot(){
    setFill(BLUE);
    setStroke(BLACK,5);
    drawCircle(pivot[0],pivot[1],r);
}

function distance2d(p1,p2){
    return Math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2);
}

function normVector(v){
    return distance2d([0,0],v);
}

function angleBetweenVectors(v1,v2){
    let d1 = normVector(v1);
    let d2 = normVector(v2);

    return Math.acos((v1[0]*v2[0] + v1[1]*v2[1])/(d1*d2));
}

function windmillIntersectPoint(p){
    let v1 = line;
    let v2 = [p[0] - pivot[0],p[1] - pivot[1]];
    
    let angle = angleBetweenVectors(v1,v2);

    return (angle <= prec) || ((PI - angle) <= prec);
}

function rotateLine(angle){
    angle = angle;
    let x1 = line[0] * Math.cos(angle) + line[1] * Math.sin(angle);
    let y1 = - line[0] * Math.sin(angle) + line[1] * Math.cos(angle);
    line[0] = x1;
    line[1] = y1;
}

function init(){
    createCanvas(500,500);
    w = getWidth();
    h = getHeight();
    pivot = [250,250];
    line = [1,0];
    createRandom2dPoints(5);
    drawPoints();
    // drawWindmill();
}


function update(){
    if(startRotating){
	clearCanvas();
	rotateLine(dangle);

	for(let i in points){
	    if(windmillIntersectPoint(points[i]) && points[i] != pivot){
		pivoted[i] += 1;
		pivot = points[i];
		rotateLine(dangle);
		break;
	    }
	}
	
	drawPoints();
	drawWindmill();
	drawPivot();
    }
}
