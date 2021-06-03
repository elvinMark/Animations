var plot_points = function(ctx,arr,org,scale){
	if(arr.length<2)
		return null;
	ctx.beginPath();
	ctx.moveTo(org[0],org[1]);
	ctx.fillText(""+0,org[0],org[1]);
	for(var i=1;i<arr.length;i++){
		//console.log(arr[i]);
		ctx.font = "10px Arial";
		ctx.fillText(""+i,scale*arr[i][0]+org[0],scale*arr[i][1]+org[1]);
		ctx.lineTo(scale*arr[i][0]+org[0],scale*arr[i][1]+org[1]);
	}
	ctx.stroke();
}
var counter = 0;
var animate_plotting = function(ctx,org,scale,order){
	var total_points = 4**order;
	var t = 2**(order+1);
	if(counter > total_points){
		counter = 0;
		ctx.clearRect(0,0,500,500);
		ctx.beginPath();
		ctx.moveTo(org[0],org[1]);
		//ctx.fillText(""+0,org[0],org[1]);
		counter++;
	}
	else{
		var v = hilbert(counter,order);
		//ctx.font = "10px Arial";
		//ctx.fillText(""+counter,scale*v[0]/t+org[0],scale*v[1]/t+org[1]);
		ctx.lineTo(scale*v[0]/t+org[0],scale*v[1]/t+org[1]);
		ctx.stroke();
		counter++;
	}
}

var generate_points = function(n){
	var total_points = 4**n;
	var out=[]
	var t = 2**(n+1);
	for(var i=0;i<total_points;i++){
		tmp = hilbert(i,n);
		out.push([tmp[0]/(t),tmp[1]/(t)]);
	}
	return out;
}

var hilbert = function(i,n){
	var a = [[0,0],[0,1],[1,1],[1,0]];
	var index = i & 3;
	var v = [a[index][0],a[index][1]];
	var tmp = i>>2;
	var alpha = 2;
	var tmp2;
	for(var k =0;k<n-1;k++){
		index = tmp & 3;
		if(index == 0){
			tmp2=v[0];
			v[0] = v[1];
			v[1] = tmp2;
		}
		else if(index == 3){
			tmp2 = v[0];
			v[0] = v[1];
			v[1] = tmp2;
			v[0] = alpha-1- v[0] ;
			v[1] = alpha-1- v[1] ;
		}
		v[0] += a[index][0]*alpha;
		v[1] += a[index][1]*alpha;
		tmp = tmp>>2;
		alpha=2*alpha;
	}
	return v;
}