const utils = {
	...require('./iterators.js'),
	...require('./string.js'),
	...require('./numbers.js'),
	...require('./async.js'),
	...require('./other.js'),

	mutate : (name, primitive=Object)=>{
		Object.defineProperty(primitive.prototype, name, { enumerable : false,
			value : function (...args){ return utils[name](this, ...args); }
		});
	}
}

module.exports = utils;