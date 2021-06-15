const decodeJWT = (token='')=>JSON.parse(atob(token.split('.')[1]).toString('binary'));


const qs = {
	get : (url)=>Object.fromEntries((url.split('?')[1]||'').split('&').map((c) => c.trim().split('=').map(decodeURIComponent).reverse())),
	set : (url, obj)=>url.split('?')[0] + '?' + Object.entries(obj).map(([v,k])=>`${k}=${encodeURIComponent(v)}`).join('&'),
	add : (url, obj)=>qs.set(url, {...qs.get(url, obj), ...obj}),
};

const cookies = {
	get : ()=>Object.fromEntries(document.cookie.split(';').map((c) => c.trim().split('=').map(decodeURIComponent))),
	set : (name, val, opts={})=>document.cookie = `${name}=${val}; ${Object.entries(opts).map(([v,k])=>`${k}=${v}`).join('; ')}`,
	del : (name)=>document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,
};

const request = async (method, url, data={}, options={})=>{
	const {headers, ...opts}=options;
	if(method=='GET') url = qs.add(url, data);
	return fetch(url, {
		method, headers: {'Content-Type':'application/json', ...headers},
		body : method!='GET' ? JSON.stringify(data) : undefined,
		...opts,
	}).then(res=>{
		return res.text().then(data=>{
			try{res.data=JSON.parse(data);}catch(err){res.data=data;}
			if(!res.ok) throw res;
			return res;
		})
	});
};
request.get  = request.bind(null, 'GET');
request.post = request.bind(null, 'POST');
request.del  = request.bind(null, 'DELETE');
request.put  = request.bind(null, 'PUT');




	function download(filename, text) {
		//We manually create an invisible link tag, and set it's content to be our file
		//Then we trigger a click action which will prompt it to download.
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

const isValidEmail = (email)=>{
	return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(email)
};


module.exports = {qs, cookies, request, isValidEmail};

/**** Simple Static Server ****/
const http = require('http');
const url  = require('url');
const fs   = require('fs');
const path = require('path');

const server = (root = '', port = 8000)=>{
	const types = { '.ico': 'image/x-icon','.html': 'text/html','.js': 'text/javascript','.json': 'application/json','.css': 'text/css','.png': 'image/png','.jpg': 'image/jpeg','.wav': 'audio/wav','.mp3': 'audio/mpeg','.svg': 'image/svg+xml'};
	const getType = (ext)=>types[ext] || 'text/plain';
	http.createServer((req, res)=>{
		try{
			let systempath = path.join(process.cwd(), root, url.parse(req.url).pathname);
			let indexpath = path.join(systempath, 'index.html');
			if(fs.existsSync(indexpath)) systempath = indexpath;
			if(!fs.existsSync(systempath)){
				res.statusCode = 404;
				res.end(`File ${systempath} not found!`);
				return;
			}
			res.setHeader('Content-type', getType(path.parse(systempath).ext) );
			res.end(fs.readFileSync(systempath));
		}catch(err){
			console.log(err);
			res.statusCode = 500;
			res.end(`Error getting the file: ${err}.`);
		}
		return;
	}).listen(parseInt(port));
	console.log(`Static server listening on port ${port}`);
};
