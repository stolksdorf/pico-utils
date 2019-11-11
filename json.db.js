const fs = require('fs');

module.exports = (filepath)=>{
	let data = [];
	const load = async ()=>data=JSON.parse((await fs.promises.readFile(filepath, 'utf8')));
	const save = async (val)=>{
		data = val;
		return fs.promises.writeFile(filepath, JSON.stringify(data, null, '\t')).then(()=>val);
	}
	fs.watch(filepath, load);
	load();

	const db = {
		query : async (fn)=>data.filter(fn),
		all   : async ()=>data,
		get   : async (id)=>data.find((x)=>x.id==id),

		clear  : async ()=>save([]),
		add    : async (obj)=>save(data.concat(obj)),
		remove : async (id)=>save(data.filter((x)=>x.id!=id)),
		update : async (id, obj)=>{
			const idx = data.findIndex((x)=>x.id==id);
			if(idx==-1) return db.add(obj)
			data[idx] = {...data[idx], ...obj};
			return save(data);
		}
	}
	return db;
}
