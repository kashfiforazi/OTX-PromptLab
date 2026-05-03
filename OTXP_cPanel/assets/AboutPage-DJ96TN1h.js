import{c as a,r as o,z as x,j as e,v as h}from"./index-Zg070cfP.js";import{m as b}from"./proxy-DjxOsHTy.js";import{L as m}from"./loader-circle-DhgfIKCM.js";import{M as g}from"./message-square-CW7zEDQp.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],k=a("facebook",y);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]],p=a("instagram",u);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]],f=a("linkedin",v);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],w=a("twitter",j);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]],_=a("youtube",N);function A(){const[r,i]=o.useState({}),[n,c]=o.useState(!0);o.useEffect(()=>{x().then(t=>{i(t),c(!1)})},[]);const l=[{key:"facebook",icon:k,label:"Facebook",color:"bg-blue-600 hover:bg-blue-700"},{key:"twitter",icon:w,label:"Twitter / X",color:"bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"},{key:"instagram",icon:p,label:"Instagram",color:"bg-pink-600 hover:bg-pink-700"},{key:"linkedin",icon:f,label:"LinkedIn",color:"bg-blue-700 hover:bg-blue-800"},{key:"discord",icon:g,label:"Discord",color:"bg-indigo-600 hover:bg-indigo-700"},{key:"youtube",icon:_,label:"YouTube",color:"bg-red-600 hover:bg-red-700"}];return e.jsx("div",{className:"container max-w-4xl mx-auto px-4 py-12 relative z-10 flex-1",children:e.jsxs(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-sm transition-colors duration-300 text-center",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx(h,{className:"scale-125",showWordmark:!0})}),e.jsx("h1",{className:"text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6 mt-8",children:"About Us"}),n?e.jsx("div",{className:"flex justify-center py-20",children:e.jsx(m,{className:"w-8 h-8 text-blue-600 animate-spin"})}):e.jsxs("div",{className:"space-y-12",children:[e.jsx("div",{className:"prose dark:prose-invert max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-sm leading-relaxed",children:e.jsx("p",{children:r.aboutText||"Welcome to Oentrix Prompt Lab. We are dedicated to providing a collaborative platform for creators to discover, share, and manage high-quality AI prompts. Join our growing community and elevate your creative journey."})}),e.jsxs("div",{className:"pt-8 border-t border-gray-200 dark:border-white/10",children:[e.jsx("h2",{className:"text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6",children:"Connect With Us"}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-4",children:[l.map(t=>{const s=r[t.key];if(!s)return null;const d=t.icon;return e.jsxs("a",{href:s,target:"_blank",rel:"noopener noreferrer",className:`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium text-sm transition-transform hover:scale-105 ${t.color} shadow-sm`,children:[e.jsx(d,{className:"w-5 h-5"}),t.label]},t.key)}),!Object.keys(r).some(t=>t!=="aboutText"&&r[t])&&e.jsx("p",{className:"text-sm text-gray-500 italic",children:"Social links will be added soon."})]})]})]})]})})}export{A as AboutPage};
