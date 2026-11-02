import {chromium} from '@playwright/test';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto(process.argv[2]||'http://localhost:3300/',{waitUntil:'networkidle'});
console.log(await p.evaluate(()=>{const vw=innerWidth;const out=[];document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect();if(r.right>vw+1&&r.width>0){let clipped=false;for(let n=el.parentElement;n&&n!==document.body;n=n.parentElement){const o=getComputedStyle(n).overflowX;if(o!=='visible'){clipped=true;break}}if(!clipped)out.push(el.tagName+'.'+String(el.className).slice(0,60)+' '+Math.round(r.right))}});return {sw:document.documentElement.scrollWidth,out:out.slice(0,15)}}));
await b.close();
