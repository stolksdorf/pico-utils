
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

//Pass either an error object or an offset for the trace.
const getTrace = (arg = 0)=>{
	const stackline = (arg instanceof Error)
		? arg.stack.split('\n')[1]
		: (new Error()).stack.split('\n')[Number(arg) + 2];
	let name, loc = stackline.replace('at ', '').trim();
	const res = /(.*?) \((.*?)\)/.exec(loc);
	if(res){ name = res[1]; loc = res[2]; }
	const [_, filename, line, col] = /(.*?):(\d*):(\d*)/.exec(loc);
	return { filename, name, line, col };
}
