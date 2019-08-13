// This is a tiny version of my React rendering library vitreum
// Produces ready-to-serve HTML strings from a single React component.

// npm i babelify react-dom react browserify uglifyify @babel/core @babel/preset-react

const ReactDOMServer = require('react-dom/server'), React = require('react'), browserify = require('browserify');

let Libs, LibsCache;
const pack = async (bundler)=>new Promise((res, rej)=>bundler.bundle((err, buf)=>err ? rej(err) : res(buf.toString())));
const getHTML = (bundle, props)=>`<main id='root'>${ReactDOMServer.renderToString(React.createElement(eval(`module=undefined;${bundle};global.Root`), props))}</main>`;
const getHydrate = (props)=>`require('react-dom').hydrate(require('react').createElement(Root, ${JSON.stringify(props)}),document.getElementById('root'));`;
const getLibs = async ()=>{if(!LibsCache){ LibsCache = await pack(browserify().require(Libs).transform('uglifyify', { global : true }));}; return LibsCache;};
const postFilter = (id, filepath)=>{
	if(!filepath) throw `Can not find module '${id}'`;
	return (filepath.indexOf('node_modules') === -1) ? true : (Libs.push(id) && false);
}
const getBundler = (entryPath, opts = {})=>{
	Libs = ['react', 'react-dom'];
	return browserify({ standalone : 'Root', postFilter, ...opts })
		.require(entryPath).transform('babelify', { presets : ['@babel/preset-react'] });
};
const collect = async (bundler, props)=>{
	const bundle = await pack(bundler);
	return {
		bundle : `${bundle};${getHydrate(props)}`,
		libs   : await getLibs(),
		html   : getHTML(bundle, props),
	};
};

const build = async (entryPath, props, opts = {})=>await collect(getBundler(entryPath, opts), props);
const dev = (entryPath, props, task = ({ bundle, html, libs })=>{}, opts={})=>{
	const run = async ()=>task(await collect(bundler, props));
	const bundler = getBundler(entryPath, { debug : true, cache : {}, ...opts }).plugin('watchify').on('update', run);
	run();
};
const render = ({ head, html, bundle, libs })=>`<html><head>${head}</head><body>${html}</body><script>${libs}</script><script>${bundle}</script></html>`;

module.exports = {dev, build, render};
