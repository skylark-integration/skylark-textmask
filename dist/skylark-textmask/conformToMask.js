/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
define(["./utilities","./constants","./constants"],function(e,t,r){"use strict";const s=[],n="";return function(o=n,i=s,l={}){if(!e.isArray(i)){if(typeof i!==r.strFunction)throw new Error("Text-mask:conformToMask; The mask property must be an array.");i=i(o,l),i=e.processCaretTraps(i).maskWithoutCaretTraps}const{guide:a=!0,previousConformedValue:c=n,placeholderChar:f=t,placeholder:h=e.convertMaskToPlaceholder(i,f),currentCaretPosition:u,keepCharPositions:p}=l,m=!1===a&&void 0!==c,d=o.length,g=c.length,k=h.length,b=i.length,C=d-g,T=C>0,w=u+(T?-C:0),y=w+Math.abs(C);if(!0===p&&!T){let e=n;for(let t=w;t<y;t++)h[t]===f&&(e+=f);o=o.slice(0,w)+e+o.slice(w,d)}const v=o.split(n).map((e,t)=>({char:e,isNew:t>=w&&t<y}));for(let e=d-1;e>=0;e--){const{char:t}=v[e];if(t!==f){t===h[e>=w&&g===b?e-C:e]&&v.splice(e,1)}}let M=n,N=!1;e:for(let e=0;e<k;e++){const t=h[e];if(t===f){if(v.length>0)for(;v.length>0;){const{char:t,isNew:r}=v.shift();if(t===f&&!0!==m){M+=f;continue e}if(i[e].test(t)){if(!0===p&&!1!==r&&c!==n&&!1!==a&&T){const r=v.length;let s=null;for(let e=0;e<r;e++){const t=v[e];if(t.char!==f&&!1===t.isNew)break;if(t.char===f){s=e;break}}null!==s?(M+=t,v.splice(s,1)):e--}else M+=t;continue e}N=!0}!1===m&&(M+=h.substr(e,k));break}M+=t}if(m&&!1===T){let e=null;for(let t=0;t<M.length;t++)h[t]===f&&(e=t);M=null!==e?M.substr(0,e+1):n}return{conformedValue:M,meta:{someCharsRejected:N}}}});
//# sourceMappingURL=sourcemaps/conformToMask.js.map
