/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
!function(e,t){var r=t.define,require=t.require,n="function"==typeof r&&r.amd,o=!n&&"undefined"!=typeof exports;if(!n&&!r){var s={};r=t.define=function(e,t,r){"function"==typeof r?(s[e]={factory:r,deps:t.map(function(t){return function(e,t){if("."!==e[0])return e;var r=t.split("/"),n=e.split("/");r.pop();for(var o=0;o<n.length;o++)"."!=n[o]&&(".."==n[o]?r.pop():r.push(n[o]));return r.join("/")}(t,e)}),resolved:!1,exports:null},require(e)):s[e]={factory:null,resolved:!0,exports:r}},require=t.require=function(e){if(!s.hasOwnProperty(e))throw new Error("Module "+e+" has not been defined");var module=s[e];if(!module.resolved){var r=[];module.deps.forEach(function(e){r.push(require(e))}),module.exports=module.factory.apply(t,r)||null,module.resolved=!0}return module.exports}}if(!r)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(e,require){e("skylark-textmask/textmask",["skylark-langx/skylark"],function(e){"use strict";return e.attach("intg.textmask",{})}),e("skylark-textmask/adjustCaretPosition",["./textmask"],function(e){"use strict";const t=[],r="";return e.adjustCaretPosition=function({previousConformedValue:e=r,previousPlaceholder:n=r,currentCaretPosition:o=0,conformedValue:s,rawValue:a,placeholderChar:i,placeholder:l,indexesOfPipedChars:u=t,caretTrapIndexes:c=t}){if(0===o||!a.length)return 0;const f=a.length,p=e.length,d=l.length,h=s.length,k=f-p,m=k>0;if(k>1&&!m&&0!==p)return o;let v,g,y=0;if(!m||e!==s&&s!==l){const e=s.toLowerCase(),t=a.toLowerCase(),c=t.substr(0,o).split(r),f=c.filter(t=>-1!==e.indexOf(t));g=f[f.length-1];const p=n.substr(0,f.length).split(r).filter(e=>e!==i).length,d=l.substr(0,f.length).split(r).filter(e=>e!==i).length,k=d!==p,x=void 0!==n[f.length-1]&&void 0!==l[f.length-2]&&n[f.length-1]!==i&&n[f.length-1]!==l[f.length-1]&&n[f.length-1]===l[f.length-2];!m&&(k||x)&&p>0&&l.indexOf(g)>-1&&void 0!==a[o]&&(v=!0,g=a[o]);const C=u.map(t=>e[t]),T=C.filter(e=>e===g).length,P=f.filter(e=>e===g).length,w=l.substr(0,l.indexOf(i)).split(r).filter((e,t)=>e===g&&a[t]!==e).length,b=w+P+T+(v?1:0);let E=0;for(let t=0;t<h;t++){const r=e[t];if(y=t+1,r===g&&E++,E>=b)break}}else y=o-k;if(m){let e=y;for(let t=y;t<=d;t++)if(l[t]===i&&(e=t),l[t]===i||-1!==c.indexOf(t)||t===d)return e}else if(v){for(let e=y-1;e>=0;e--)if(s[e]===g||-1!==c.indexOf(e)||0===e)return e}else for(let e=y;e>=0;e--)if(l[e-1]===i||-1!==c.indexOf(e)||0===e)return e}}),e("skylark-textmask/constants",[],function(){"use strict";return{placeholderChar:"_",strFunction:"function"}}),e("skylark-textmask/utilities",["./constants"],function(e){"use strict";const t=[];function r(e){return Array.isArray&&Array.isArray(e)||e instanceof Array}const n="[]";return{convertMaskToPlaceholder:function(n=t,o=e.placeholderChar){if(!r(n))throw new Error("Text-mask:convertMaskToPlaceholder; The mask property must be an array.");if(-1!==n.indexOf(o))throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n"+`The placeholder character that was received is: ${JSON.stringify(o)}\n\n`+`The mask that was received is: ${JSON.stringify(n)}`);return n.map(e=>e instanceof RegExp?o:e).join("")},isArray:r,isString:function(e){return"string"==typeof e||e instanceof String},isNumber:function(e){return"number"==typeof e&&void 0===e.length&&!isNaN(e)},isNil:function(e){return void 0===e||null===e},processCaretTraps:function(e){const t=[];let r;for(;-1!==(r=e.indexOf(n));)t.push(r),e.splice(r,1);return{maskWithoutCaretTraps:e,indexes:t}}}}),e("skylark-textmask/conformToMask",["./textmask","./utilities","./constants"],function(e,t,r){const n=[],o="";return e.conformToMask=function(e=o,s=n,a={}){if(!t.isArray(s)){if(typeof s!==r.strFunction)throw new Error("Text-mask:conformToMask; The mask property must be an array.");s=s(e,a),s=t.processCaretTraps(s).maskWithoutCaretTraps}const{guide:i=!0,previousConformedValue:l=o,placeholderChar:u=r.placeholderChar,placeholder:c=t.convertMaskToPlaceholder(s,u),currentCaretPosition:f,keepCharPositions:p}=a,d=!1===i&&void 0!==l,h=e.length,k=l.length,m=c.length,v=s.length,g=h-k,y=g>0,x=f+(y?-g:0),C=x+Math.abs(g);if(!0===p&&!y){let t=o;for(let e=x;e<C;e++)c[e]===u&&(t+=u);e=e.slice(0,x)+t+e.slice(x,h)}const T=e.split(o).map((e,t)=>({char:e,isNew:t>=x&&t<C}));for(let e=h-1;e>=0;e--){const{char:t}=T[e];if(t!==u){const r=e>=x&&k===v;t===c[r?e-g:e]&&T.splice(e,1)}}let P=o,w=!1;e:for(let e=0;e<m;e++){const t=c[e];if(t===u){if(T.length>0)for(;T.length>0;){const{char:t,isNew:r}=T.shift();if(t===u&&!0!==d){P+=u;continue e}if(s[e].test(t)){if(!0===p&&!1!==r&&l!==o&&!1!==i&&y){const r=T.length;let n=null;for(let e=0;e<r;e++){const t=T[e];if(t.char!==u&&!1===t.isNew)break;if(t.char===u){n=e;break}}null!==n?(P+=t,T.splice(n,1)):e--}else P+=t;continue e}w=!0}!1===d&&(P+=c.substr(e,m));break}P+=t}if(d&&!1===y){let e=null;for(let t=0;t<P.length;t++)c[t]===u&&(e=t);P=null!==e?P.substr(0,e+1):o}return{conformedValue:P,meta:{someCharsRejected:w}}}}),e("skylark-textmask/createTextMaskInputElement",["./textmask","./adjustCaretPosition","./conformToMask","./utilities","./constants"],function(e,t,r,n,o){"use strict";const s="",a="none",i="object",l="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),u="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:setTimeout;return e.createTextMaskInputElement=function(e){const c={previousConformedValue:void 0,previousPlaceholder:void 0};return{state:c,update(f,{inputElement:p,mask:d,guide:h,pipe:k,placeholderChar:m=o.placeholderChar,keepCharPositions:v=!1,showMask:g=!1}=e){if(void 0===f&&(f=p.value),f===c.previousConformedValue)return;let y,x;if(typeof d===i&&void 0!==d.pipe&&void 0!==d.mask&&(k=d.pipe,d=d.mask),d instanceof Array&&(y=n.convertMaskToPlaceholder(d,m)),!1===d)return;const C=function(e){if(n.isString(e))return e;if(n.isNumber(e))return String(e);if(void 0===e||null===e)return s;throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value "+`received was:\n\n ${JSON.stringify(e)}`)}(f),{selectionEnd:T}=p,{previousConformedValue:P,previousPlaceholder:w}=c;let b;if(typeof d===o.strFunction){if(!1===(x=d(C,{currentCaretPosition:T,previousConformedValue:P,placeholderChar:m})))return;const{maskWithoutCaretTraps:e,indexes:t}=n.processCaretTraps(x);x=e,b=t,y=n.convertMaskToPlaceholder(x,m)}else x=d;const E={previousConformedValue:P,guide:h,placeholderChar:m,pipe:k,placeholder:y,currentCaretPosition:T,keepCharPositions:v},{conformedValue:M}=r(C,x,E),O=typeof k===o.strFunction;let V={};O&&(!1===(V=k(M,Object.assign({rawValue:C},E)))?V={value:P,rejected:!0}:n.isString(V)&&(V={value:V}));const A=O?V.value:M,j=t({previousConformedValue:P,previousPlaceholder:w,conformedValue:A,placeholder:y,rawValue:C,currentCaretPosition:T,placeholderChar:m,indexesOfPipedChars:V.indexesOfPipedChars,caretTrapIndexes:b}),N=A===y&&0===j,S=g?y:s,I=N?S:A;var F,q;(c.previousConformedValue=I,c.previousPlaceholder=y,p.value!==I)&&(p.value=I,F=p,q=j,document.activeElement===F&&(l?u(()=>F.setSelectionRange(q,q,a),0):F.setSelectionRange(q,q,a)))}}}}),e("skylark-textmask/maskInput",["./textmask","./createTextMaskInputElement"],function(e,t){"use strict";return e.maskInput=function(e){const{inputElement:r}=e,n=t(e),o=({target:{value:e}})=>n.update(e);return r.addEventListener("input",o),n.update(r.value),{textMaskInputElement:n,destroy(){r.removeEventListener("input",o)}}}}),e("skylark-textmask/main",["./textmask","./maskInput"],function(e){"use strict";return e}),e("skylark-textmask",["skylark-textmask/main"],function(e){return e})}(r),!n){var a=require("skylark-langx/skylark");o?module.exports=a:t.skylarkjs=a}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-textmask.js.map