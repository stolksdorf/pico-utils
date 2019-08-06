const map = (obj,fn)=>Object.keys(obj).map((key)=>fn(obj[key],key));
const flatMap = (obj,fn)=>Object.keys(obj).flatMap((key)=>fn(obj[key],key));
const reduce = (obj,fn,init)=>Object.keys(obj).reduce((a,key)=>fn(a,obj[key],key),init);
const filter = (obj,fn)=>Object.keys(obj).reduce((a,key)=>!!fn(obj[key],key)?a.concat(obj[key]):a,[]);
const construct = (obj,fn)=>Object.keys(obj).reduce((a,key)=>{const [k,v]=fn(obj[key],key);a[k]=v;return a;},{});
const cluster = (obj, fn)=>Object.keys(obj).reduce((a,k)=>{const r=fn(obj[k],k);if(!a[r]){a[r]=[]};a[r].push(obj[k]);return a;},{});
const times = (n,fn)=>Array.from(new Array(n*1),(v,i)=>fn(i));
const findKey = (obj,fn)=>Object.keys(obj).find((key)=>fn(obj[key],key));
const sample = (obj)=>obj[Object.keys(obj)[Math.floor(Object.keys(obj).length*Math.random())]];


/***********************/

const max = (obj, fn)=>{
	return Object.keys(obj).reduce((acc, key)=>{
		const val = obj[key];
		const res = fn(val, key);
		return (res > acc[1]) ? [val,res] : acc;
	}, [null, Number.MIN_SAFE_INTEGER])[0];
};

const sample = (arr, count=1, r=new Set())=>{
	r.add(arr[Math.floor(arr.length*Math.random())]);
	return (r.size == count) ? Array.from(r) : sample(arr, count, r);
};
