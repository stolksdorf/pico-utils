
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

const _internalPaths = Object.keys(process.binding('natives')).concat(['bootstrap_node', 'node']).map((name) => `${name}.js`);
const getStack = (err)=>{
	return err.stack.split('\n').reduce((stack, raw)=>{
		const [_, name, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		if(!!file && !_internalPaths.includes(file)){
			stack.push({name, file:file.replace(process.cwd(), '').slice(1), line:Number(line), col:Number(col), raw})
		}
		return stack;
	}, []);
};

const getTrace = (offset=0)=>{
	const stack = (new Error()).stack.split('\n').reduce((stack, raw)=>{
		const [_, name, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		if(file) stack.push({
			name, file : file.replace(process.cwd(), '').slice(1), line : Number(line), col  : Number(col), raw
		});
		return stack;
	}, []).slice(offset);
	return stack[0] || {};
};
