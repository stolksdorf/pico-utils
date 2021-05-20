

const adjustColor = (color, amount)=>{
	const amt = (Math.abs(amount) > 1 ? amount / 100 : amount) * 255;
	const { r, g, b } = utils.hex2rgb(utils.getHex(color));
	return utils.rgb2hex({
		r : r + amt,
		g : g + amt,
		b : b + amt,
	});
};

// YIQ equation from http://24ways.org/2010/calculating-color-contrast
const getYIQ = (color)=>{
	const { r, g, b } = utils.hex2rgb(utils.getHex(color));
	return (r * 299 + g * 587 + b * 114) / 1000;
};

const css_colors = {
	maroon  : '#800000',
	red     : '#FF0000',
	orange  : '#FFA500',
	yellow  : '#FFFF00',
	olive   : '#808000',
	green   : '#008000',
	purple  : '#800080',
	fuchsia : '#FF00FF',
	lime    : '#00FF00',
	teal    : '#008080',
	aqua    : '#00FFFF',
	blue    : '#0000FF',
	navy    : '#000080',
	black   : '#000000',
	gray    : '#808080',
	silver  : '#C0C0C0',
	white   : '#FFFFFF',
};

const utils = {
	isHex  : (color)=>/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/.test(color),
	getHex : (color)=>{
		if(color.r || color.b || color.g) return utils.rgb2hex(color);
		if(css_colors[color.toLowerCase()]) return css_colors[color.toLowerCase()];
		if(utils.isHex(color)) return color;
	},
	//FIXME works with short hex codes?
	hex2rgb : (hex)=>{
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r : parseInt(result[1], 16),
			g : parseInt(result[2], 16),
			b : parseInt(result[3], 16),
		} : null;
	},
	rgb2hex : ({ r, g, b })=>{
		const con = (val)=>Math.floor(val).toString(16).padStart(2, '0').toUpperCase();
		return `#${con(r)}${con(g)}${con(b)}`;
	},

	lighten : (color, amt = 0)=>adjustColor(color, amt),
	darken  : (color, amt = 0)=>adjustColor(color, -amt),
	fade    : (color, amt = 0)=>{
		const { r, g, b } = utils.hex2rgb(utils.getHex(color));
		return `rgba(${r},${g},${b},${amt > 1 ? amt / 100 : amt})`;
	},

	isDark   : (color)=>getYIQ(color) < 128,
	isBright : (color)=>getYIQ(color) >= 128,

	/** https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests **/
	luminanace : (color)=>{
		if(typeof color == 'string') color = utils.hex2rgb(utils.getHex(color));
		if(!color) return 0;
		const parts = Object.values(color).map((val)=>{
			val = val / 255;
			return (val <= 0.03928) ? (val / 12.92) : Math.pow((val + 0.055) / 1.055, 2.4);
		});
		return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
	},

	/** https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html **/
	contrastRatio : (color1, color2)=>{
		c1 = utils.luminanace(color1) + 0.05;
		c2 = utils.luminanace(color2) + 0.05;
		const contrastRatio = (c1 > c2) ? (c1 / c2) : (c2 / c1);
		return Number(contrastRatio.toFixed(2));
	},
};

module.exports = utils;
