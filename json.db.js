const fs = require('fs').promises;

module.exports = (filepath)=>{
	let data = [];

	const get = async ()=>data=JSON.parse((await fs.readFile(filepath, 'utf8')));
	const save = async ()=>fs.writeFile(filepath, JSON.stringify(data, null, '\t'));

	const db = {
		add : async (obj)=>{
			await get();
			data.push(obj);
			await save();
			return obj;
		},
		remove : async (id)=>{
			await get();
			data=data.filter((x)=>x.id!=id);
			return await save();
		},
		query : async (fn)=>{
			await get();
			return data.filter(fn);
		},
		all : async ()=>{
			await get();
			return data;
		},
		update : async (id, obj)=>{
			await get();
			const idx = data.findIndex((x)=>x.id==id);
			if(idx==-1) return db.add(obj)
			data[idx] = {...data[idx], ...obj};
			await save();
			return data[idx];
		}
	}
	return db;
}
