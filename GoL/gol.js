var board = [];
var nboard = [];
var rows;
var cols;

function init_board(r,c){
    var aux;
    rows = r;
    cols = c;
    for(var i = 0;i<r;i++){
	aux = [];
	aux1 = [];
	for(var j = 0;j<c;j++){
	    aux.push(0);
	    aux1.push(0);
	}
	board.push(aux);
	nboard.push(aux1);
    }
}
function random_init(){
    for(var i = 0;i<rows;i++){
	for(var j = 0;j<cols;j++)
	    board[i][j] = Math.floor(Math.random()*2);
    }
}
function copy_board(){
    for(var i = 0;i<rows;i++){
	for(var j = 0;j<cols;j++)
	    nboard[i][j] = board[i][j];
    }
}
function draw_board(ctx,H,W){
    ctx.fillStyle = "#777777";
    var scale_x = W/cols;
    var scale_y = H/rows;
    for(var i = 0;i<rows;i++){
	for(var j = 0;j<cols;j++){
	    if(board[i][j] == 1){
		ctx.fillStyle = "#AAAA22";
		ctx.fillRect(i*scale_y,j*scale_x,(i+1)*scale_y,(j+1)*scale_x);
		ctx.strokeRect(i*scale_y,j*scale_x,(i+1)*scale_y,(j+1)*scale_x);
		ctx.fillStyle = "#777777";
	    }
	    else{
		ctx.fillRect(i*scale_y,j*scale_x,(i+1)*scale_y,(j+1)*scale_x);
		ctx.strokeRect(i*scale_y,j*scale_x,(i+1)*scale_y,(j+1)*scale_x);
	    }
	}
    }
}
function get_sum(x,y){
    var s=0;
    for(var i = -1;i<2;i++)
	for(var j = -1;j<2;j++)
	    s = s + nboard[(x+i+rows)%rows][(y+j+cols)%cols];
    return s - nboard[x][y];
}
function check_alive_or_death(x,y){
    var s = get_sum(x,y);
    if(nboard[x][y]){
	if(s<=1)
	    return 0;
	else if(s>=4)
	    return 0;
	else
	    return 1;
    }
    else{
	if(s == 3)
	    return 1;
	else
	    return 0;
    }
}

function evolve(){
    copy_board();
    for(var i = 0;i<rows;i++){
	for(var j = 0;j<cols;j++){
	    board[i][j] = check_alive_or_death(i,j);
	}
    }
}
