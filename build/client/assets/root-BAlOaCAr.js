import{p,q as f,t as g,v as w,r as x,_ as S,j as e,N as d,w as b,O as y,u as N,M as v,L,S as I}from"./components-XXrZDpAO.js";/**
 * @remix-run/react v2.10.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let m="positions";function M({getKey:t,...r}){let{isSpaMode:s}=p(),o=f(),i=g();w({getKey:t,storageKey:m});let a=x.useMemo(()=>{if(!t)return null;let n=t(o,i);return n!==o.key?n:null},[]);if(s)return null;let h=((n,c)=>{if(!window.history.state||!window.history.state.key){let l=Math.random().toString(32).slice(2);window.history.replaceState({key:l},"")}try{let u=JSON.parse(sessionStorage.getItem(n)||"{}")[c||window.history.state.key];typeof u=="number"&&window.scrollTo(0,u)}catch(l){console.error(l),sessionStorage.removeItem(n)}}).toString();return x.createElement("script",S({},r,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${h})(${JSON.stringify(m)}, ${JSON.stringify(a)})`}}))}const k=(t=[],{idKey:r="id",parentKey:s="parentId",childrenKey:o="children"}={})=>{const i=[],a={};return t.forEach(h=>{const n={...h},{[r]:c,[s]:l=null}=n;a[c]=a[c]||[],n[o]=a[c],l!==null?(a[l]=a[l]||[],a[l].push(n)):i.push(n)}),i},j=(t,r=!1)=>e.jsx("ul",{className:`flex ${r?"flex-col ml-4":"space-x-4"}`,children:t.map(s=>{const o=s.children&&s.children.length>0;return e.jsxs("li",{children:[e.jsx(d,{to:s.uri,className:"hover:text-blue-500",children:s.label}),o&&j(s.children,!0)]},s.id)})}),O=({navMenuItems:t})=>{const r=k(t);return e.jsx("header",{className:"min-h-24 bg-green-400 p-4",children:e.jsx("nav",{children:j(r)})})},R=({items:t})=>e.jsxs("nav",{children:[e.jsx("ul",{className:"flex gap-3",children:t.map((r,s)=>e.jsx("li",{children:e.jsx(d,{to:r.uri,children:r.label})},s))}),e.jsx("h2",{children:"Sitemap"})]}),$=({sitemapItems:t})=>e.jsxs("footer",{className:"min-h-24 bg-blue-400",children:[e.jsx("h2",{children:"Footer"}),e.jsx(R,{items:t})]}),E=({path:t,name:r,isLastItem:s})=>s?e.jsx("p",{children:r}):e.jsx(d,{to:t,children:r}),H=()=>{var i;const t=b(),s=(i=t[t.length-1].data)==null?void 0:i.seo.breadcrumbs,o=s?s.length>1:!1;return e.jsx(e.Fragment,{children:s&&o&&e.jsx("nav",{className:"h-8 bg-amber-400","aria-label":"breadcrumb",children:e.jsx("ul",{className:"flex gap-3",children:s.map((a,h)=>{const n=a.url&&new URL(a.url),c=n?n.pathname:"#";return e.jsx("li",{children:e.jsx(E,{path:c,name:a.text,isLastItem:h===s.length-1})},h)})})})})};function B({children:t}){const{navMenuItems:r,sitemapItems:s}=N();return e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(v,{}),e.jsx(L,{})]}),e.jsxs("body",{className:"flex flex-col min-h-screen",children:[e.jsx(O,{navMenuItems:r}),e.jsx(H,{}),e.jsx("main",{className:"flex-grow",children:t}),e.jsx($,{sitemapItems:s}),e.jsx(M,{}),e.jsx(I,{})]})]})}function F(){return e.jsx(y,{})}export{B as Layout,F as default};