import{c as d,d as x,r as n,j as l,e as u,g as y,h as m,x as p,y as g}from"./index-9Zk3U7O9.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]],w=d("bookmark",v);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],j=d("share-2",S);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],N=d("shield-check",C),$=async r=>{if(navigator.clipboard&&navigator.clipboard.writeText)try{return await navigator.clipboard.writeText(r),!0}catch(e){console.error("Failed to copy to clipboard",e)}try{const e=document.createElement("textarea");e.value=r,e.style.position="fixed",e.style.opacity="0",document.body.appendChild(e),e.focus(),e.select();const a=document.execCommand("copy");return document.body.removeChild(e),a}catch(e){return console.error("Fallback clipboard copy failed",e),!1}};function D({promptId:r,className:e}){const{user:a,signIn:b}=x(),[o,c]=n.useState(!1),[h,i]=n.useState(!0);n.useEffect(()=>{async function s(){if(!a){c(!1),i(!1);return}try{const t=u(y,"users",a.uid,"savedPrompts",r),k=await m(t);c(k.exists())}catch(t){console.error(t)}finally{i(!1)}}s()},[a,r]);const f=async s=>{if(s.stopPropagation(),!a){await b();return}try{const t=u(y,"users",a.uid,"savedPrompts",r);o?(await p(t),c(!1)):(await g(t,{savedAt:new Date}),c(!0))}catch(t){console.error(t)}};return h?null:l.jsx("button",{onClick:f,title:o?"Remove from saved":"Save prompt",className:`p-2.5 rounded-full transition-all flex items-center justify-center ${e} ${o?"bg-blue-100 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/40":"bg-white/80 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/20 border-gray-300 dark:border-white/20"} border shadow-sm backdrop-blur-md`,children:l.jsx(w,{className:`w-5 h-5 ${o?"fill-current":""}`})})}export{w as B,D as S,N as a,j as b,$ as c};
