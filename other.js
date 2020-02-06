const getArgs = (processArr = process.argv.slice(2))=>{
	return processArr.reduce((acc, arg)=>{
		if(arg[0]=='-'){
			let [key,val] = arg.replace(/-(-)?/, '').split('=');
			acc[key] = typeof val == 'undefined' ? true : val;
			return acc;
		}
		acc.args.push(arg);
		return acc;
	}, {args:[]});
};

const hasFlag = (flag)=>!!process.argv.find(x=>x==`--${flag}`);
const isDev = !!process.argv.find(x=>x=='--dev');
const isProd = !!process.argv.find(x=>x=='--prod');

const chalk = Object.entries({bright:'\x1b[1m',dim:'\x1b[2m',red:'\x1b[31m',green:'\x1b[32m',yellow:'\x1b[33m',blue:'\x1b[34m',magenta:'\x1b[35m',cyan:'\x1b[36m',white:'\x1b[37m'}).reduce((acc, [name, val])=>{acc[name] = (txt)=>val+txt+'\x1b[0m';return acc;},{});



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
const getStack = (idx=false)=>{
	const stack = (new Error()).stack.split('\n').map((raw)=>{
		const [_, name, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		return { name, file, line : Number(line), col  : Number(col), raw };
	}).filter(({file})=>!!file && !_internalPaths.includes(file)).slice(1);
	if(idx !== false) return stack[idx];
	return stack;
};
