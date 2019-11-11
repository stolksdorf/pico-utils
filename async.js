const wait = async (n,val)=>new Promise((r)=>setTimeout(()=>r(val), n));
const loop = (fn)=>setTimeout(()=>loop(fn), fn() || 1000);
const sequence = async (obj, fn)=>Object.keys(obj).reduce((a,key)=>a.then((r)=>fn(obj[key], key, r)), Promise.resolve());

let queue;
const enqueue = (func)=>{
	return new Promise((resolve, reject)=>{
		queue = (queue || Promise.resolve()).then(()=>{
			return func().then(resolve).catch(reject);
		}).finally(()=>{delete queue});
	})
};

module.exports = {wait,loop,sequence, enqueue};
