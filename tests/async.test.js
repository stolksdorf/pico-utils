const test = require('pico-check');
const {wait, enqueue, loop, sequence} = require('../async.js');


test.group('enqueue', (test)=>{

	test('basic', async (t)=>{
		let res = [], res2 = [];
		const go = (time, str)=>wait(time).then(()=>{
			res.push(str);
		});

		const a = ()=>go(100, 'a').then(()=>res2.push('a'));
		const b = ()=>go(300, 'b').then(()=>res2.push('b'));
		const c = ()=>go(200, 'c').then(()=>res2.push('c'));

		await Promise.all([
			enqueue(a, 'a'),
			enqueue(b, 'b'),
			enqueue(c, 'c')
		])

		t.is(res, ['a', 'b', 'c']);
		t.is(res2, ['a', 'b', 'c']);

	}, {timeout : 3000});


	test('nonblocking', async (t)=>{
		let res = [];

		const a = enqueue(async ()=>{
			await wait(100);
			res.push('a')
		}).then(async ()=>{
			await wait(500);
			res.push('c')
		})
		const b = enqueue(async ()=>{
			await wait(200);
			res.push('b');
		})

		await Promise.all([ a,b ]);
		t.is(res, ['a', 'b', 'c']);
	}, {timeout : 3000});

	test('errors', async (t)=>{
		let res = [];

		const a = enqueue(async ()=>{
			await wait(100);
			res.push('a')
			throw 'c';
		}).catch((err)=>{
			res.push(err)
		})
		const b = enqueue(async ()=>{
			await wait(200);
			res.push('b');
		});
		await Promise.all([ a,b ]);
		t.is(res, ['a', 'c', 'b']);

	})

})




module.exports = test