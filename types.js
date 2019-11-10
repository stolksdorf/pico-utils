/*
Usage:

const GeoType = (val, name)=>{
	Type({lat:Number, lng:Number}, val, name);
	if(val.lat < -90 || val.lat > 90) return `${name}.lat has an invalid range`;
	if(val.lng < -180 || val.lng > 180) return `${name}.lng has an invalid range`;
}

const UserType = {
	email      : /^.+@.+\..+$/,
	post_count : Number,
	tags       : [String],
	posts : [{
		title : String,
		read : Function
	}],
	age      : (val)=>val > 0 && val < 130,
	flagged  : Type.opt(Boolean),
	created  : Type.or(Number, Date),
	location : GeoType,
	meta     : '*'
}

*/

const isPlainObject = (obj)=>typeof obj == 'object' && obj.constructor == Object;
const isNativeType = (func)=>/\[native code\]/.test(''+func);
const getNativeName = (func)=>/function (\w+)\(\)/.exec(func+'')[1];

const Type = (schema, arg, name='')=>{
	if(schema === '*') return true;
	if(Array.isArray(schema)){
		if(!Array.isArray(arg)) throw `${name} is not an array.`;
		return arg.every((val, idx)=>Type(schema[0], val, `${name}[${idx}]`));
	}
	else if(isPlainObject(schema)){
		if(!isPlainObject(arg)) throw `${name} is not an object.`;
		return Object.entries(schema).every(([key,val])=>Type(val, arg[key], `${name}.${key}`));
	}
	else if(schema instanceof RegExp){
		if(!schema.test(arg)) throw `${name} did pass regex.`;
	}
	else if(isNativeType(schema)){
		if(arg instanceof schema) return true;
		if(typeof arg == typeof schema()) return true;
		throw `${name} is not ${getNativeName(schema)}`
	}
	else if(typeof schema === 'function'){
		const res = schema(arg, name);
		if(res === true || typeof res == 'undefined') return true;
		throw (res || `${name} did not pass validation.`);
	}
	return true;
};

Type.is = (type, val)=>{ try{ Type(type, val) }catch(err){return false;} return true;};
Type.opt = (type)=>(val, name)=>typeof val == 'undefined' || Type(type, val, name);
Type.or = (...types)=>(val)=>types.some((type)=>Type.is(type, val))

module.exports = Type;


/*

try{
	Type(UserType, {
		email : 'scott.tolksdorf@gmail.com',
		post_count : 9,
		tags : ['yo', 'foo'],
		posts : [
			{
				title : 'hey',
				read : ()=>{}
			},
		],
		age : 31,
		flagged : false,
		created : 12343453465,
		location : {
			lat : 4,
			lng : 60
		}
	})
}catch(err){
	console.log('ERROR');
	console.log(err);
}
*/
