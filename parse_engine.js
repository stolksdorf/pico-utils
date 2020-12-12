/* Usage


const rules = {
	'aa' : ()=>'woo',
	'bb(.)b' : ([letter], raw, pre)=>'foo' + letter + ` (${pre})`
};


console.log(parse(rules, `g bbtb aa aa   goo bbdb`));

*/


const parse = (rules, text)=>{
	const Rules = Object.entries(rules).map(([rgx, fn])=>[new RegExp(rgx),fn]);
	let remaining = text, result = [];
	while(remaining.length > 0){
		let match = Rules.reduce((best, [rgx, fn])=>{
			let match = rgx.exec(remaining);
			if(!match) return best;
			if(!best || match.index < best.index){ match.func = fn; return match; }
			return best;
		}, false);
		if(!match) break;
		const [matchedText, ...groups] = match;
		result.push(match.func(groups, matchedText, remaining.substring(0,match.index)));
		remaining = remaining.substring(match.index + matchedText.length);
	}
	return result;
};
