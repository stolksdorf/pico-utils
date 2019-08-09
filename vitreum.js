// This is a tiny version of my React rendering library vitreum
// Produces ready-to-serve HTML strings from a single React component.

// npm i babelify react-dom react browserify @babel/core @babel/preset-react


const ReactDOMServer = require('react-dom/server'), React = require('react'), browserify = require('browserify');

const pack = (bundler)=>new Promise((res, rej)=>bundler.bundle((err, buf)=>err ? rej(err) : res(buf.toString())));
const getBundler = (componentPath, opts = {})=>{
	return browserify({ standalone : 'Root', cache : {}, ...opts }).external('react').require(componentPath)
		.transform('babelify', { presets : ['@babel/preset-react'] });
};
let libs;
const render = async (bundler, props)=>{
	const bundle = await pack(bundler);
	if(!libs) libs = await pack(browserify().require(['react', 'react-dom']));
	return `<html>
	<body><main id='root'>${ReactDOMServer.renderToString(React.createElement(eval(`module=undefined;${bundle};global.Root`), props))}</main></body>
	<script>${libs};${bundle}</script>
	<script>require('react-dom').hydrate(require('react').createElement(Root, ${JSON.stringify(props)}),document.getElementById('root'));</script>
	</html>`;
};
const build = async (componentPath, props = {})=>render(getBundler(componentPath, props), props);
const dev = async (componentPath, props, task = (html)=>{})=>{
	const go = async ()=>task(await render(bundler, props));
	const bundler = getBundler(componentPath, props, { debug : true }).plugin('watchify').on('update', go);
	go();
};
module.exports = { build, dev };
