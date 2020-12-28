const map = (obj,fn)=>Object.keys(obj).map((key)=>fn(obj[key],key));
const map = (obj,fn)=>Object.entries(obj).map(([k,v])=>fn(v,k));

const reduce = (obj,fn,init)=>Object.keys(obj).reduce((a,key)=>fn(a,obj[key],key),init);
const reduce = (obj,fn,init)=>Object.entries(obj).reduce((a,[k,v])=>fn(a,v,k),init);

const flatMap = (obj,fn)=>Object.keys(obj).flatMap((key)=>fn(obj[key],key));
const mapValues = (obj,fn)=>Object.keys(obj).reduce((a,k)=>{a[k]=fn(obj[key],key);return a;},{});

const sum = (obj,fn)=>Object.entries(obj).reduce((a,[k,v])=>a+fn(v,k),0);
const transform = (obj, fn)=>Object.keys(obj).reduce((acc,k)=>{acc[k]=fn(obj[k],k);return acc;}, Array.isArray(obj)?[]:{});
const construct = (obj,fn)=>Object.keys(obj).reduce((a,key)=>{const [k,v]=fn(obj[key],key);a[k]=v;return a;},{});
const times = (n,fn)=>Array.from(new Array(n*1),(v,i)=>fn(i));

const findKey = (obj,fn)=>Object.keys(obj).find((key)=>fn(obj[key],key));
const filter = (obj,fn)=>Object.keys(obj).reduce((a,key)=>!!fn(obj[key],key)?a.concat(obj[key]):a,[]);
const cluster = (obj, fn)=>Object.keys(obj).reduce((a,k)=>{const r=fn(obj[k],k);if(!a[r]){a[r]=[]};a[r].push(obj[k]);return a;},{});

const pluck = (arr)=>arr[Math.floor(Math.random()*arr.length)];
const sample = (arr, count=1, r=new Set())=>{
	r.add(arr[Math.floor(arr.length*Math.random())]);
	return (r.size == count) ? Array.from(r) : sample(arr, count, r);
};
const weave = (arr, func)=>arr.reduce((acc, val, idx)=>(idx < arr.length-1) ? acc.concat(val, func(acc.length + 1)) : acc.concat(val),[]);

const zip = (...arrs)=>arrs[0].map((_,i)=>arrs.map((arr)=>arr[i]))


/***********************/

const max = (obj, fn)=>{
	return Object.keys(obj).reduce((acc, key)=>{
		const val = obj[key];
		const res = fn(val, key);
		return (res > acc[1]) ? [val,res] : acc;
	}, [null, Number.MIN_SAFE_INTEGER])[0];
};


