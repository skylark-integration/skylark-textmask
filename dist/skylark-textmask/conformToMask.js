/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
define(["./textmask","./utilities","./constants"],function(e,t,r){const o=[],s="";return e.conformToMask=function(e=s,n=o,l={}){if(!t.isArray(n)){if(typeof n!==r.strFunction)throw new Error("Text-mask:conformToMask; The mask property must be an array.");n=n(e,l),n=t.processCaretTraps(n).maskWithoutCaretTraps}const{guide:a=!0,previousConformedValue:i=s,placeholderChar:c=r.placeholderChar,placeholder:f=t.convertMaskToPlaceholder(n,c),currentCaretPosition:h,keepCharPositions:u}=l,p=!1===a&&void 0!==i,m=e.length,k=i.length,d=f.length,g=n.length,C=m-k,b=C>0,T=h+(b?-C:0),w=T+Math.abs(C);if(!0===u&&!b){let t=s;for(let e=T;e<w;e++)f[e]===c&&(t+=c);e=e.slice(0,T)+t+e.slice(T,m)}const y=e.split(s).map((e,t)=>({char:e,isNew:t>=T&&t<w}));for(let e=m-1;e>=0;e--){const{char:t}=y[e];t!==c&&t===f[e>=T&&k===g?e-C:e]&&y.splice(e,1)}let M=s,v=!1;e:for(let e=0;e<d;e++){const t=f[e];if(t===c){if(y.length>0)for(;y.length>0;){const{char:t,isNew:r}=y.shift();if(t===c&&!0!==p){M+=c;continue e}if(n[e].test(t)){if(!0===u&&!1!==r&&i!==s&&!1!==a&&b){const r=y.length;let o=null;for(let e=0;e<r;e++){const t=y[e];if(t.char!==c&&!1===t.isNew)break;if(t.char===c){o=e;break}}null!==o?(M+=t,y.splice(o,1)):e--}else M+=t;continue e}v=!0}!1===p&&(M+=f.substr(e,d));break}M+=t}if(p&&!1===b){let e=null;for(let t=0;t<M.length;t++)f[t]===c&&(e=t);M=null!==e?M.substr(0,e+1):s}return{conformedValue:M,meta:{someCharsRejected:v}}}});
//# sourceMappingURL=sourcemaps/conformToMask.js.map
