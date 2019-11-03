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

const engine = (rules, input, context)=>{
	let {fallback, ...Rules} = rules;
	fallback = fallback || ((text, ctx)=>ctx)
	const run = (text, ctx, idx=0)=>{
		let bestMatch, bestRule;
		Object.keys(Rules).map((id)=>{
			const match = Rules[id][0].exec(text);
			if(match && (!bestRule || match.index < bestMatch.index)){
				bestRule = id;
				bestMatch = match;
			}
		})
		if(!bestRule) return fallback(text, ctx);
		const [matchedText, ...groups] = bestMatch;
		let match = {
			start : bestMatch.index,
			text  : matchedText,
			pre   : text.substring(0, bestMatch.index),
			input : text
		};
		const newCtx = Rules[bestRule][1](match, groups, ctx);
		return run(text.substring(bestMatch.index + matchedText.length), newCtx, idx+1);
	}
	return run(input, context)
};

module.exports = engine
