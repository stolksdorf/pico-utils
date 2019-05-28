const snakeCase = (text)=>text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '_'),
const titleCase = (text)=>text.replace(/\w\S*/g, (txt)=>txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase()),
const kebobCase = (text)=>text.toLowerCase().replace(/[^\w]+/g, '-'),
const camelCase = (text)=>text.replace(/^([A-Z])|[\s-_]+(\w)/g, (_, a, b)=>b?b.toUpperCase():a.toLowerCase()),

//format money?


module.exports = {snakeCase,titleCase,kebobCase,camelCase};

