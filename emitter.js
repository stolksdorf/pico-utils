const SyncEmitter = ()=>{
	const emitter = {
		active    : true,
		listeners : {},
		emit : (evt, ...args)=>{
			if(!emitter.active) return;
			if(emitter.listeners[evt]) emitter.listeners[evt].map(fn=>fn(...args));
			if(emitter.listeners['*']) emitter.listeners['*'].map(fn=>fn(evt, ...args));
		},
		on : (evt, fn)=>{
			emitter.listeners[evt] = (emitter.listeners[evt]||[]).concat(fn);
			return ()=>emitter.listeners[evt] = emitter.listeners[evt].filter(x=>x!==fn);
		}
	};
	return emitter;
};

const AsyncEmitter = (delay=0)=>{
	let events = new Set(), timer;
	const emitter = {
		active    : true,
		listeners : {},
		emit : (evt)=>{
			if(!emitter.active) return;
			events.add(evt);
			if(!timer){
				timer = setTimeout(()=>{
					const evts = [...events];
					events.clear();
					delete timer;
					evts.map(evt=>{if(emitter.listeners[evt]){ emitter.listeners[evt].map(fn=>fn()); }});
					if(emitter.listeners['*']) emitter.listeners['*'].map(fn=>fn(evts));
				}, delay);
			}
		},
		on : (evt, fn)=>{
			emitter.listeners[evt] = (emitter.listeners[evt]||[]).concat(fn);
			return ()=>emitter.listeners[evt] = emitter.listeners[evt].filter(x=>x!==fn);
		}
	};
	return emitter;
};
