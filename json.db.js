const fs = require('fs');

module.exports = (filepath, shouldWatch=true)=>{
	let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
	const save = async (val)=>{
		data = val;
		return fs.promises.writeFile(filepath, JSON.stringify(data, null, '\t'));
	}
	if(shouldWatch) fs.watch(filepath, async ()=>{
		//can be made sync
		try{ data = JSON.parse((await fs.promises.readFile(filepath, 'utf8'))); }catch(err){}
	});

	const db = {
		query  : async (fn)=>data.filter(fn),
		all    : async ()=>data,
		get    : async (id)=>data.find((x)=>x.id==id),

		set    : async (x)=>save(x),
		clear  : async ()=>save([]),
		add    : async (obj)=>save(data.concat(obj)).then(()=>obj),
		remove : async (id)=>save(data.filter((x)=>x.id!=id)),
		update : async (id, obj)=>{
			const idx = data.findIndex((x)=>x.id==id);
			if(idx==-1) return db.add({id, ...obj});
			data[idx] = {...data[idx], ...obj};
			return save(data).then(()=>data[idx]);
		}
	}
	return db;
};
