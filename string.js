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

/*--------------------*/

//TODO: run benchmark on these
//algo vs. algo
//for vs. array

const hash = (str)=>[...str].reduce((acc, char)=>{acc = ((acc<<5)-acc)+char.charCodeAt(0);return acc&acc; }, 0).toString(32);

hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
};

function hashCode(s) {
    let h=0;
    for(let i = 0; i < s.length; i++) 
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;

    return h;
}

function hashCode(str) {
  return Array.from(str)
    .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)
}

TSH=s=>{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return h^h>>>9}
