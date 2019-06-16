/* Functions to doing immutable operations */

const remove = (arr, idx)=>{
	return arr.slice(0,idx).concat(arr.slice(idx+1))
}
const inject = (arr, idx, val)=>{
	return arr.slice(0,idx).concat(val).concat(arr.slice(idx))
}


module.exports = {remove, inject};
