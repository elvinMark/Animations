let x = 700;
let y = 600;
let x0 = 500;
let y0 = 500;
let r = 400;

let dangle = 0.1;
let rot_angle = 0;
let lines = [];

function createLines(N){
    let dt = TWO_PI / (N - 1);
    let t = 0;
    let x1,y1;

    lines = [];
    
    for(let i = 0;i<N;i++){
	x1 = x0 + r*Math.cos(t);
	y1 = y0 + r*Math.sin(t);
	t += dt;
	lines.push([x,y,x1,y1,(x+x1)/2,(y+y1)/2]);
    }
}


function rotateLine(line,angle){
    let dx1 = line[0] - line[4];
    let dy1 = line[1] - line[5];
    let dx2 = line[2] - line[4];
    let dy2 = line[3] - line[5];

    let nx1 = line[4] + dx1*Math.cos(angle) + dy1*Math.sin(angle);
    let ny1 = line[5] - dx1*Math.sin(angle) + dy1*Math.cos(angle);

    let nx2 = line[4] + dx2*Math.cos(angle) + dy2*Math.sin(angle);
    let ny2 = line[5] - dx2*Math.sin(angle) + dy2*Math.cos(angle);

    return [nx1,ny1,nx2,ny2,line[4],line[5]];

    
}

function rotateLines(angle){
    for(let i in lines)
	lines[i] = rotateLine(lines[i],angle);
}

function drawAllLines(){
    setStroke(BLACK,2);
    for(let i in lines)
	drawLine(lines[i][0],lines[i][1],lines[i][2],lines[i][3]);
}

function init(){
    createCanvas(1000,1000);

    setStroke(RED,5);
    noFill();
    drawCircle(x0,y0,r);

    createLines(100);
    drawAllLines();
}


function update(){
    if(rot_angle < PI_HALF){
	clearCanvas();
	
	setStroke(RED,5);
	noFill();
	drawCircle(x0,y0,r);
	
	rotateLines(dangle);
	drawAllLines();
	
	rot_angle += dangle;
    }
}
