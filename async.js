const wait = async (n,val)=>new Promise((r)=>setTimeout(()=>r(val), n));
const loop = async (fn)=>setTimeout(()=>loop(fn), await fn() || 1000);
const sequence = async (obj, fn)=>Object.keys(obj).reduce((a,key)=>a.then((r)=>fn(obj[key], key, r)), Promise.resolve());
const debounce = (fn, t=16)=>function(...args){clearTimeout(this.clk);this.clk=setTimeout(()=>fn(...args),t);};

const enqueue = function(fn){
	return new Promise((rsv, rej)=>{
		this.queue = (this.queue || Promise.resolve()).then(()=>new Promise((done)=>{
			fn().then(rsv).catch(rej).finally(done);
		}));
	});
};

const Queue = (func)=>{
	let queue = [];
	let isRunning = false;

	const next = ()=>{
		isRunning = true;
		func(...queue.shift());
	}
	return {
		queue,
		add: (...args)=>{
			queue.push(args);
			if(!isRunning) next();
		},
		next : ()=>{
			isRunning = false;
			if(queue.length !== 0) next();
		}
	}
};

const Emitter = ()=>{
	let fns = {};
	return {
		on : (evt,fn)=>fns[evt]=(fns[evt]||[]).concat(fn),
		off : (evt,fn)=>fns[evt]=(fns[evt]||[]).filter((_fn)=>_fn!==fn),
		emit : (evt, ...data)=>{
			(fns[evt]||[]).map((fn)=>fn(...data));
			(fns['*']||[]).map((fn)=>fn(evt, ...data));
		},
	}
};

module.exports = {
	wait,loop,sequence,enqueue,debounce
};
