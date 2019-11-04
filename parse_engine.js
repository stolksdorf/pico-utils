/**

const input = `daaabc`

const rules ={
	aMatch : [/a(a)/, (match, [group1], ctx)=>'x'],
	bMatch : [/b/, (match)=>'y'],
	dMatch : [/d/, (match)=>'yo yo ya'],
	default : (match)=>'ha'
};

console.log(engine(rules, input));

**/
const map = (obj,fn)=>Object.keys(obj).map((key)=>fn(obj[key],key));


const engine = (rules, input)=>{

	let Rules = {}, defaultRule;


	map(rules, (val, id)=>{
		if(id == 'default'){
			defaultRule = val;
			return;
		}
		Rules[id] = {regex: val[0], render:val[1]}
		if(Array.isArray(val[0])){
			Rules[id].regex = val[0][0]
			Rules[id].nest = val[0][1]
		}
	});

	console.log(Rules);

	const getBestMatch = (rules, text)=>{
		const exec = (regex, text, id)=>{
			const match = regex.exec(text);
			if(!match) return false;
			const [matchedText, ...groups] = match;
			return {
				id,
				start : match.index,
				end   : match.index + matchedText.length,
				text  : matchedText,
				input : text,
				groups
			};
		}
		let best;
		Object.keys(rules).map((id)=>{
			const match = exec(rules[id].regex, text, id);
			if(match && (!best || match.start < best.start)){
				best = match;
			}
		});
		return best;
	}


	const context = (input, exitRule=/ /)=>{
		let result = [];
		const run = (text, ctx, idx=0)=>{
			let bestMatch = getBestMatch({'__exit':{regex:exitRule}, ...Rules}, text);

			if(!bestMatch){
				if(defaultRule) result.push(defaultRule(text));
				return [result, text];
			}
			if(bestMatch.id == '__exit'){
				if(defaultRule) result.push(defaultRule(text.substring(0,bestMatch.start)));
				return [result, text.substring(bestMatch.end), bestMatch.groups];
			}

			const bestRule = Rules[bestMatch.id];

			if(bestRule.nest){
				const [subResult, rest, groups] = context(text.substring(bestMatch.end), bestRule.nest);
				result.push(bestRule.render(bestMatch, bestMatch.groups.concat(groups||[]), subResult));
				return run(rest)
			}

			result.push(bestRule.render(bestMatch, bestMatch.groups));
			return run(text.substring(bestMatch.end));

		}
		return run(input)
	};
	return context(input)[0]
}
module.exports = engine
