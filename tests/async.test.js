const test = require('pico-check');
const {wait, enqueue, loop, sequence, debounce} = require('../async.js');


const spd = 1; //how fast the tests will run

test.group('enqueue', (test)=>{

	test('basic', async (t)=>{
		let res = [], res2 = [];

		const a = enqueue(()=>wait(10 * spd).then(()=>res.push('a')))
			.then(()=>res2.push('a'));
		const b = enqueue(()=>wait(30 * spd).then(()=>res.push('b')))
			.then(()=>res2.push('b'));
		const c = enqueue(()=>wait(20 * spd).then(()=>res.push('c')))
			.then(()=>res2.push('c'));


		await Promise.all([a,b,c])

		t.is(res, ['a', 'b', 'c']);
		t.is(res2, ['a', 'b', 'c']);

	}, {timeout : 3000});


	test('nonblocking', async (t)=>{
		let res = [];

		const a = enqueue(async ()=>{
			await wait(20 * spd);
			res.push('a')
		}).then(async ()=>{
			await wait(50 * spd);
			res.push('d')
		})
		const b = enqueue(async ()=>{
			await wait(10 * spd);
			res.push('b');
		}).then(async ()=>{
			await wait(5 * spd);
			res.push('c')
		})

		await Promise.all([ a,b ]);


		t.is(res, ['a', 'b', 'c', 'd']);
	}, {timeout : 3000});

	test('errors', async (t)=>{
		let res = [];

		const a = enqueue(async ()=>{
			await wait(10 * spd);
			res.push('a')
			throw 'c';
		}).catch((err)=>{
			res.push(err)
		})
		const b = enqueue(async ()=>{
			await wait(20 * spd);
			res.push('b');
		});
		await Promise.all([ a,b ]);
		t.is(res, ['a', 'c', 'b']);

	})

});

test.group('debounce', (test)=>{
	test('basic', async (t)=>{
		const res = [];
		const time = 30
		const go = (val)=>debounce(()=>{
			res.push(val)
		}, time);

		go(1);go(2);go(3);go(4);
		await wait(time + 10);

		t.is(res, [4]);
	});

	test('reset', async (t)=>{
		const res = [];
		const time = 30;
		const go = (val)=>debounce(()=>{
			res.push(val)
		}, time);

		go(1);
		await wait(time - 5);
		go(2);
		await wait(time - 5);
		go(3);
		await wait(time - 5);
		go(4);
		await wait(time + 5);

		t.is(res, [4]);
	});
})




module.exports = test