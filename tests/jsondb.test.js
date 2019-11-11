const test = require('pico-check');

const DB = require('../json.db.js')('./tests/temp.db.json');




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
})



module.exports = test