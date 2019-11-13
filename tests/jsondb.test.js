const test = require('pico-check').skip();

const fs = require('fs');

const dbFilePath = './tests/temp.db.json';

//fs.writeFileSync(dbFilePath, '[]');

//const DB = require('../json.db.js')(dbFilePath);



test('clear', async (t)=>{
	DB.clear();
	t.is(await DB.all(), [])
});


test('mass add', async (t)=>{

	await Promise.all([
		DB.remove(4),
		DB.add({id: 4, a : 1}),
		DB.add({b : 2}),
		DB.add({c : 3}),
		DB.update(4, {yo : true})
	]);

	console.log(await DB.all());
});

test('mass add/remove', async (t)=>{
	await DB.clear();

	await Promise.all([
		DB.update(1, {a : 1}),
		DB.update(2, {b : 2}),
		DB.update(3, {c : 3}),
		DB.update(4, {yo : true})
	]);

	await Promise.all([
		DB.remove(1),
		DB.remove(2),
		DB.remove(3),
		DB.remove(4)
	]);

	t.is(await DB.all(), [])
});



module.exports = test