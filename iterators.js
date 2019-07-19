const map = (obj,fn)=>Object.keys(obj).map((key)=>fn(obj[key],key));
const flatMap = (obj,fn)=>Object.keys(obj).flatMap((key)=>fn(obj[key],key));
const reduce = (obj,fn,init)=>Object.keys(obj).reduce((a,key)=>fn(a,obj[key],key),init);
const filter = (obj,fn)=>Object.keys(obj).reduce((a,key)=>!!fn(obj[key],key)?a.concat(obj[key]):a,[]);
const construct = (obj,fn)=>Object.keys(obj).reduce((a,key)=>{const [k,v]=fn(obj[key],key);a[k]=v;return a;},{});
const cluster = (obj, fn)=>Object.keys(obj).reduce((a,k)=>{const r=fn(obj[k],k);if(!a[r]){a[r]=[]};a[r].push(obj[k]);return a;},{});
const times = (n,fn)=>Array.from(new Array(n*1),(v,i)=>fn(i));
const findKey = (obj,fn)=>Object.keys(obj).find((key)=>fn(obj[key],key));

module.exports = {map,flatMap,reduce,filter,construct,cluster,times};
