
// JS Pad 
/*
Creates a light-weight code editor that executes the JS on each keypress
Changes text color base don if it's valid code.
*/

data:text/html,<html contenteditable onkeyup="try{this.style.color='rgb(240,239,208)';console.clear();eval(this.innerText);}catch(err){this.style.color='rgb(223,175,143)';console.log(err);}"><title>js_pad</title><style>html{background:rgb(63,63,63);color:rgb(240,239,208);font-size:1.5em;font-family:Monospace}</style></html>


// CSS Debugger
/*
Creates a colored outline of all css elements

*/

javascript:(function(){ for(i=0;A=document.querySelectorAll("*")[i++];)A.style.outline="solid hsl("+(A+A).length*9+",99%,50%)1px" })();


ref: https://gist.github.com/addyosmani/fd3999ea7fce242756b1
