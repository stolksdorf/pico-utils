const map = (obj,fn)=>Object.entries(obj).map(([k,v])=>fn(v,k));

const decodeJWT = (token='')=>JSON.parse(atob(token.split('.')[1]).toString('binary'));

const qs = {
	get : (url)=>Object.fromEntries((url.split('?')[1]||'').split('&').map((c) => c.trim().split('=').map(decodeURIComponent))),
	set : (url, obj)=>url.split('?')[0] + '?' + map(obj, (v,k)=>`${k}=${encodeURIComponent(v)}`).join('&'),
	add : (url, obj)=>qs.set(url, {...qs.get(url, obj), ...obj}),
};

const cookies = {
	get : ()=>Object.fromEntries(document.cookie.split(';').map((c) => c.trim().split('=').map(decodeURIComponent))),
	set : (name, val, opts={})=>document.cookie = `${name}=${val}; ${map(opts, (v,k)=>`${k}=${v}`).join('; ')}`,
	del : (name)=>document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,
};

const request = async (method, url, data={}, options={})=>{
	const {headers, ...opts}=options;
	if(method=='GET') url = qs.add(url, data);
	return await fetch(url, {
		method, headers: {'Content-Type':'application/json', ...headers},
		body : method!='GET' ? JSON.stringify(data) : undefined,
		...opts,
	}).then((res)=>res.json());
};
request.get = request.bind(null, 'GET');
request.post = request.bind(null, 'POST');
request.del = request.bind(null, 'DELETE');
request.put = request.bind(null, 'PUT');
