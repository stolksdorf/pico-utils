const Emitter=()=>{
	let cache={};
	return {
		emit : (evt, ...args)=>(cache[evt]||[]).map(fn=>fn(...args)),
		on : (evt, func)=>{
			cache[evt]=(cache[evt]||[]).concat(func);
			return ()=>cache[evt]=cache[evt].filter(x=>x!=func);
		}
	};
};


const getCallStack = ()=>{
	const _prepareStackTrace = Error.prepareStackTrace
	Error.prepareStackTrace = (_, stack) => stack;
	const stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
};
const resolveFromCaller = (fp, offset=0)=>{
	const callDir = Path.dirname(getCallStack()[2+offset].getFileName());
	return require.resolve(fp, {paths:[callDir]});
};

const getCaller = (offset=0)=>{
	const stackline = (new Error()).stack.split('\n')[3 + offset];
	const [_, name, file, line, col] = /    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(stackline);
	return { name, file, line:Number(line), col:Number(col) };
}

const args = process.argv.slice(2).reduce((acc, part)=>{
	const [_,key,__,val] = /--?(\w+)(=(\w+))?/.exec(part) || [];
	key ? (acc[key] = val||true) : (acc.cmds.push(part));
	return acc;
}, {cmds:[]});

const hasFlag = (flag)=>!!process.argv.find(x=>x==`--${flag}`);
const isDev = !!process.argv.find(x=>x=='--dev');
const isProd = !!process.argv.find(x=>x=='--prod');

const chalk = Object.entries({bright:'\x1b[1m',dim:'\x1b[2m',red:'\x1b[31m',green:'\x1b[32m',yellow:'\x1b[33m',blue:'\x1b[34m',magenta:'\x1b[35m',cyan:'\x1b[36m',white:'\x1b[37m'}).reduce((acc, [name, val])=>{acc[name] = (txt)=>val+txt+'\x1b[0m';return acc;},{});

const chalk = Object.entries({
	bright :1,  grey  :90,  red :31,
	green  :32, yellow:33, blue :34,
	magenta:35, cyan  :36, white:37,
}).reduce((acc, [name, id])=>{ return {...acc, [name]:(txt)=>`\x1b[${id}m${txt}\x1b[0m`}}, {});


const memoize = (fn)=>{
	let cache= {};
	const newFunc = (...args)=>{
		const key = JSON.stringify(args);
		if(cache[key]) return cache[key];
		const res = fn(...args);
		cache[key] = res;
		return res;
	}
	newFunc.clear = ()=>cache={};
	return newFunc;
};


//set && get

/*
	set(obj, 'a.b[5].test[0]', 'foo');
*/

const makePath = (str)=>str.split(/\.|\[/g).map((k)=>k.indexOf(']')==-1?k:Number(k.replace(']', '')))

const get = (obj, path)=>{
	const dig = (obj, path)=>{
		if(path.length == 0) return obj;
		if(typeof obj === 'undefined') return;
		return dig(obj[path.shift()], path);
	}
	return dig(obj, makePath(path));
};

const set = (obj, path, value)=>{
	const dig = (obj, path)=>{
		if(path.length == 0) return obj = value;
		const key = path.shift();
		if(typeof obj[key] === 'undefined'){
			obj[key] = typeof key === 'number' ? [] : {};
		}
		return dig(obj[key], path, value);
	}
	return dig(obj, makePath(path));
}

const cookies = document.cookie.split(';').reduce((res, c) => {
	const [key, val] = c.trim().split('=').map(decodeURIComponent)
	try { return {...res, [key]: JSON.parse(val) } } catch (e) { return {...res, [key]: val } }
}, {});

const _internalPaths = Object.keys(process.binding('natives')).concat(['bootstrap_node', 'node']).map((name) => `${name}.js`);
const getStackOld = (idx=false)=>{
	const stack = (new Error()).stack.split('\n').map((raw)=>{
		const [_, name, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		return { name, file, line : Number(line), col  : Number(col), raw };
	}).filter(({file})=>!!file && !_internalPaths.includes(file)).slice(1);
	if(idx !== false) return stack[idx];
	return stack;
};


// You can call this with no args, an error object, or a error stack as a string
const getStack = (target = (new Error()).stack)=>{
	let [msg, ...stack] = (target.stack || target).split('\n');
	stack = stack .map((raw)=>{
		const [_, scope, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		return { scope, file, line : Number(line), col  : Number(col), raw };
	});
	return {msg, stack};
};


