const test = require('pico-check');

const fs = require('fs');

const dbFilePath = './tests/temp.db.json';

const db = require('../json.db.js')(dbFilePath);

const wait = async (n,val)=>new Promise((r)=>setTimeout(()=>r(val), n));

test('clear', async (t)=>{
	await db.clear();
	t.is(await db.all(), [])
});


test('mass add', async (t)=>{

	await Promise.all([
		db.remove(4),
		db.add({id: 4, a : 1}),
		db.add({b : 2}),
		db.add({c : 3}),
		db.update(4, {yo : true})
	]);

	const temp = await db.all()
	t.is(temp.length, 3 );
	t.is(await db.get(4), {id: 4, a : 1, yo : true} );
});

test('mass add/remove', async (t)=>{
	await db.clear();

	await Promise.all([
		db.update(1, {a : 1}),
		db.update(2, {b : 2}),
		db.update(3, {c : 3}),
		db.update(4, {yo : true})
	]);

	await Promise.all([
		db.remove(1),
		db.remove(2),
		db.remove(3),
		db.remove(4)
	]);

	t.is(await db.all(), [])
}, {timeout : 10000});



test('write, read, write', async (t)=>{
	await db.clear();
	await Promise.all([
		db.add({id : 4, a : 1}),
		db.get(4).then((val)=>{
			return db.add({id : 5, b : val.a})
		}),
		db.update(4, {a : 'yo'})
	])
	t.is(await db.all(), [ { id: 4, a: 'yo' }, { id: 5, b: 1 } ])
})



module.exports = test