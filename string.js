const snakeCase = (text)=>text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '_');
const titleCase = (text)=>text.replace(/\w\S*/g, (txt)=>txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase());
const kebobCase = (text)=>text.toLowerCase().replace(/[^\w]+/g, '-');
const camelCase = (text)=>text.replace(/^([A-Z])|[\s-_]+(\w)/g, (_, a, b)=>b?b.toUpperCase():a.toLowerCase());

// Get all regex matches
//const execAll = (rgx, str)=>{let m,r=[]; while (m=rgx.exec(str)){r.push(m[1]);}; return r;};
const execAll = (rgx, str)=>str.matchAll(rgx)

const between = (str,start,end)=>str.match(new RegExp(start+"(.*)"+end))[1];

//const shortid = (n=7)=>Array.from(new Array(n*1),(v,i)=>'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'[Math.floor(Math.random()*64)]).join('');
const shortid = (n=8)=>Array.from(new Array(n*1),(v,i)=>'23456789abcdefghijkmnpqrstuvwxyz'[Math.floor(Math.random()*32)]).join('');

const shortid = ()=>Math.random().toString(32).substr(2);    

const template = (str, data={})=>{
	return Object.entries(data).reduce((acc, [key, val])=>{
		return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), val)
	}, str);
};


const key = '0123456789abcdefghjkmnpqrstvwxyz';
const toB32 = (num)=>(num >= 32) ? tob32(Math.floor(num/32)) + tob32(num-32) : key[num];
const fromB32 = (b32,r=0)=>(b32.length !== 1) ? fromB32(b32.slice(0,-1),r+1) + fromB32(b32.slice(-1),r) : key.indexOf(b32)*Math.pow(32,r);

const toPicoDate = (date)=>toB32(date.getFullYear()-2020) + toB32(date.getMonth()+1) + toB32(date.getDate());
const fromPicoDate = (pd)=>new Date(2020+fromB32(pd[0]),fromB32(pd[1])-1,fromB32(pd[2]));

//const fromPicoDate = (pd)=>{const [year,month,day]=pd.split('').map(x=>fromB32(x)); return new Date(2020+year, month-1, day);};




/*--------------------*/

//TODO: run benchmark on these
//algo vs. algo
//for vs. array

const hashOLD = (str)=>[...str].reduce((acc, char)=>{acc = ((acc<<5)-acc)+char.charCodeAt(0);return acc&acc; }, 0).toString(32);
const hash = (s)=>{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return (h^h>>>9).toString(32)};
