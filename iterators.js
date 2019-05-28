const map = (obj,fn)=>Object.keys(obj).map((key)=>fn(obj[key],key));
const flatMap = (obj,fn)=>Object.keys(obj).flatMap((key)=>fn(obj[key],key));
const reduce = (obj,fn,init)=>Object.keys(obj).reduce((a,key)=>fn(a,obj[key],key),init);
const filter = (obj,fn)=>Object.keys(obj).reduce((a,key)=>!!fn(obj[key],key)?a.concat(obj[key]):a,[]);
const construct = (obj,fn)=>Object.keys(obj).reduce((a,key)=>{const [k,v]=fn(obj[key],key);a[k]=v;return a;},{});
const times = (n,fn)=>Array.from(new Array(n*1),(v,i)=>fn(i));

const chunk = (arr, n)=>arr.reduce((acc, val)=>{
	if(acc[acc.length-1].length == n) acc.push([]);
	acc[acc.length-1].push(val);
	return acc;
}, [[]]);

module.exports = {map,flatMap,reduce,filter,construct,times};