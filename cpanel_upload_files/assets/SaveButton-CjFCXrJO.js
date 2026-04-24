import{h as u,k as x,r as c,j as i,d as l,c as d,g as h,y as g,z as v}from"./index-CLOLMLsg.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]],w=u("bookmark",p);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],D=u("share-2",S);function j({promptId:s,className:b}){const{user:t,signIn:f}=x(),[a,r]=c.useState(!1),[y,n]=c.useState(!0);c.useEffect(()=>{async function o(){if(!t){r(!1),n(!1);return}try{const e=l(d,"users",t.uid,"savedPrompts",s),k=await h(e);r(k.exists())}catch(e){console.error(e)}finally{n(!1)}}o()},[t,s]);const m=async o=>{if(o.stopPropagation(),!t){await f();return}try{const e=l(d,"users",t.uid,"savedPrompts",s);a?(await g(e),r(!1)):(await v(e,{savedAt:new Date}),r(!0))}catch(e){console.error(e)}};return y?null:i.jsxDEV("button",{onClick:m,title:a?"Remove from saved":"Save prompt",className:`p-2.5 rounded-full transition-all flex items-center justify-center ${b} ${a?"bg-blue-100 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/40":"bg-white/80 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/20 border-gray-300 dark:border-white/20"} border shadow-sm backdrop-blur-md`,children:i.jsxDEV(w,{className:`w-5 h-5 ${a?"fill-current":""}`},void 0,!1,{fileName:"/app/applet/src/components/SaveButton.tsx",lineNumber:64,columnNumber:7},this)},void 0,!1,{fileName:"/app/applet/src/components/SaveButton.tsx",lineNumber:55,columnNumber:5},this)}export{w as B,j as S,D as a};
