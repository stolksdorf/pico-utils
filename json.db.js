const fs = require('fs');
const {readFile, writeFile} = fs.promises;

module.exports = (filepath, shouldWatch=false)=>{
	let data = [];
	try{data = JSON.parse(fs.readFileSync(filepath, 'utf8'));}catch(err){}

	const debounce = function(fn, t=16){ clearTimeout(this.clk); this.clk = setTimeout(fn, t); };
	const enqueue = function(fn){
		return new Promise((rsv, rej)=>{
			this.queue = (this.queue || Promise.resolve()).then(()=>new Promise((done)=>{
				fn().then(rsv).catch(rej).finally(done);
			}));
		});
	};
	const save = async (val)=>{
		data = val;
		return writeFile(filepath, JSON.stringify(data, null, '\t'));
	};
	if(shouldWatch){
		fs.watch(filepath, ()=>{
			debounce(async ()=>{
				try{ data = JSON.parse((await readFile(filepath, 'utf8'))); }catch(err){}
			});
		});
	}
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
	};
	return Object.entries(db).reduce((acc, [key, fn])=>{
		acc[key] = (...args)=>enqueue(()=>fn(...args));
		return acc;
	},{})
};
