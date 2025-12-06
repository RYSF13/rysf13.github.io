//Full automation!!!
//:)

window.enlist=function(id,list){
var element=document.getElementById(id);
element.innerHTML="";//clear the content
for(var i=0;i<list.length;i++){element.innerHTML+=`<li><a href="${list[i][1]}">${list[i][0]}</a></li>`}
}
!function(){document.addEventListener('DOMContentLoaded',()=>{
//loading animation
o=document.querySelectorAll('.section');b=new IntersectionObserver(n=>{n.forEach(w=>{if(w.isIntersecting) w.target.classList.add('visible')})},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});o.forEach(p =>{b.observe(p)})
//retro screen effects
document.querySelector('.effects').innerHTML=`<!-- background effects -->
<div class="crt-overlay"><div class="crt-scanline"></div><div class="crt-vignette"></div><div class="crt-flicker"></div></div><div class="scanline-bar"></div>`
//navigator
document.querySelector('.nav').innerHTML=`<div class="nav-title">RYSF13</div>
<div class="nav-links">
<a href="/">[Home]</a>
<a href="/about">[About]</a>
<a href="//github.com/RYSF13">[Git]</a>
<a href="mailto:1085908428@qq.com">[Contact]</a>`;
//footer
document.querySelector('.footer').innerHTML=
`Copyright (c) <a href="https://github.com/RYSF13/">Robert Ryan</a> & Project AURORA, 20XX | All rights reserved | <div class="dot-green blink"></div> SYSTEM STATUS: NORMAL`
//lists
//projects
enlist('projects',[
  ["ToolJS","https://github.com/RYSF13/ToolJS/"],
  ["CIH(Archived)","https://github.com/RYSF13/CIH/"],
  ["The Free Publishing License","https://github.com/RYSF13/FPL/"]
]);
//links
enlist('links',[
  ["Lu Bei Lu Chen","https://www.lubeiluchen.cc"],
  ["Frans","https://iwriteiam.nl"],
  ["Code.Golf","https://code.golf"]
]);
//other
enlist('explore',[
["HELLO WORLD 1K","demo/earth.html"],
["JS Quine Clock","demo/clock.html"],
["Please enter text","about:blank"],
["3301","/cicada3301/"]
]);

})}()

// *REAL* spinning earth animation!!!
window.dOcument={body:document.querySelector("#earth")}

eval(z='p="<"+"pre>"/*     *#########* */;for(y in n="zw24l6k\
4e3t4jnt4qj24xh2 x/*  ################*  */42kty24wrt413n243n\
9h243pdxt41csb yz/*#####################* */43iyb6k43pk7243nm\
r24".split(4)){/*  #################*       */for(a in t=pars\
eInt(n[y],36)+/*     ################*       */(e=x=r=[]))for\
(r=!r,i=0;t[a/*         *#############      * */]>i;i+=.05)wi\
th(Math)x-= /*          *#############*      * */.05,0>cos(o=\
new Date/1e3/*          *########*           * */+x/PI)&&(e[~\
~(32*sin(o)*/*               ####*           # */sin(.5+y/7))\
+60] =-~ r);/*                   *####      *# */for(x=0;122>\
x;)p+="   *#"/*                  *#######*  * */[e[x++]+e[x++\
]]||(S=("eval"/*                 ##########  */+"(z=\'"+z.spl\
it(B = "\\\\")./*  ###           ######*    */join(B+B).split\
(Q="\'").join(B+Q/*             *#####*   */)+Q+")//RY3")[x/2\
+61*y-1]).fontcolor/*           ###      */(/\\w/.test(S)&&"#\
03B");dOcument.body.innerHTML=p+=B+"\\n"}setTimeout(z)')//RY3\
