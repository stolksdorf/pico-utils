
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





module.exports = {get, set};