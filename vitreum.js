// This is a tiny version of my React rendering library vitreum
// Produces ready-to-serve HTML strings from a single React component.

// npm i babelify react-dom react browserify uglifyify @babel/core @babel/preset-react

const ReactDOMServer = require('react-dom/server'), React = require('react'), browserify = require('browserify');

let LibsList;
const pack       = async (bundler)=>new Promise((res, rej)=>bundler.bundle((err, buf)=>err ? rej(err) : res(buf.toString())));
const getHTML    = (bundle, props={})=>`<main id='root'>${ReactDOMServer.renderToString(React.createElement(eval(`module=undefined;${bundle};global.Root`), props))}</main>`;
const getHydrate = (props, ssr=false)=>`require('react-dom').${ssr ? 'hydrate':'render'}(require('react').createElement(Root, ${JSON.stringify(props)}),document.getElementById('root'));`;
const getLibs    = async (libs)=>await pack(browserify().require(libs).transform('uglifyify', { global : true }));
const getBundler = (entryPoint, opts = {})=>browserify({ standalone : 'Root', postFilter, cache : {}, ...opts }).require(entryPoint).transform('babelify', { presets : ['@babel/preset-react'] });
const postFilter = (id, path)=>{if(!path){throw `Can not find module '${id}'`;} return (path.indexOf('node_modules') === -1) ? true : (LibsList.push(id) && false); };

const defaultOpts = {
	libs  : true,
	ssr   : true,
	dev   : false, //pass a function to run dev tasks
	props : {}
};
const build = async (entryPoint, opts={})=>{
	opts = {...defaultOpts, ...opts};
	let bundler = getBundler(entryPoint, { debug : !!opts.dev })
	const execute = async ()=>{
		LibsList = ['react', 'react-dom']
		let bundle, libs, html=`<main id='root'></main>`;
		bundle = await pack(bundler);
		if(opts.libs) libs = await getLibs(LibsList);
		if(opts.ssr) html = getHTML(bundle, opts.props);
		bundle += getHydrate(opts.props, opts.ssr);
		return {bundle, libs, html};
	}
	if(opts.dev){
		bundler = bundler.plugin('watchify').on('update', async ()=>opts.dev(await execute()));
		return opts.dev(await execute());
	}
	return await execute();
};
const render = ({ head='', html, bundle, libs })=>`<html><head>${head}</head><body>${html}</body><script>${libs}</script><script>${bundle}</script></html>`;

module.exports = { build, render};
