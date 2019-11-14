const round = (val, pow=0)=>Number(Number(val).toPrecision(pow));
const clamp = (val, min, max)=>{
	if(val<min) return min;
	if(val>max) return max;
	return val;
};
const rand = (min=10, max)=>{
	if(!max){max=min;min=0}
	return Math.floor(Math.random()*(max-min+1))+min;
};


module.exports = {round,clamp,rand};
