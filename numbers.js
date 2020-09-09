const round = (val, pow=0)=>Number(Number(val).toPrecision(pow));
const clamp = (val, min, max)=>{
	if(val<min) return min;
	if(val>max) return max;
	return val;
};

const clamp = (val, min, max)=>[val, min, max].sort((a,b)=>a-b)[1];

const rand = (min=10, max)=>{
	if(!max){max=min;min=0}
	return Math.floor(Math.random()*(max-min+1))+min;
};

const weightedRandom = (obj)=>{
	const keys = Object.keys(obj), sum = Object.values(obj).reduce((a,x)=>a+x,0);
	const percents = Object.values(obj).map(x=>x/sum);
	return ()=>{
		let i, sum=0, r= Math.random();
		for(i in percents){
			sum += percents[i];
			if(r <= sum) return keys[i];
		}
	}
};


module.exports = {round,clamp,rand};
