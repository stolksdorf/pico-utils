const wait = async (n,val)=>new Promise((r)=>setTimeout(()=>r(val), n));
const loop = async (fn)=>setTimeout(()=>loop(fn), await fn() || 1000);
const sequence = async (obj, fn)=>Object.keys(obj).reduce((a,key)=>a.then((r)=>fn(obj[key], key, r)), Promise.resolve());
const debounce = function(fn, t=16){ clearTimeout(this.clk); this.clk = setTimeout(fn, t); };

const enqueue = function(fn){
	return new Promise((rsv, rej)=>{
		this.queue = (this.queue || Promise.resolve()).then(()=>new Promise((done)=>{
			fn().then(rsv).catch(rej).finally(done);
		}));
	});
};

module.exports = {
	wait,loop,sequence,enqueue,debounce
};
