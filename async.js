const wait = async (n,val)=>new Promise((r)=>setTimeout(()=>r(val), n));
const loop = async (fn)=>setTimeout(()=>loop(fn), await fn() || 1000);
const sequence = async (obj, fn)=>Object.keys(obj).reduce((a,key)=>a.then((r)=>fn(obj[key], key, r)), Promise.resolve());
const debounce = (fn, t=16)=>function(...args){clearTimeout(this.clk);this.clk=setTimeout(()=>fn(...args),t);};


const sequence = async (obj, fn)=>{
	let res = Array.isArray(obj)?[]:{};
	return Object.keys(obj).reduce((p,k)=>p.then(()=>fn(obj[k], k)).then(r=>res[k]=r), Promise.resolve()).then(()=>res);
};

const debounce = (fn, t=16)=>{ let timeout; return (...args)=>{clearTimeout(timeout); timeout=setTimeout(()=>fn(...args), t);}};
const throttle = (fn, t=16)=>{ let timeout; return (...args)=>{ if(timeout){return;}  timeout=setTimeout(()=>{timeout=false;fn(...args)}, t);}}



const cacheOnce = (func)=>{
	let lastArgs, lastResult;
	return (...args)=>{
		const key = JSON.stringify(args);
		if(lastArgs !== key){
			lastArgs = key;
			lastResult = func(...args);
		}
		return lastResult;
	}
}

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
