/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
define(function(){"use strict";const e=[];return function({previousConformedValue:t="",previousPlaceholder:l="",currentCaretPosition:n=0,conformedValue:r,rawValue:i,placeholderChar:f,placeholder:s,indexesOfPipedChars:o=e,caretTrapIndexes:h=e}){if(0===n||!i.length)return 0;const g=i.length,u=t.length,d=s.length,a=r.length,c=g-u,p=c>0;if(c>1&&!p&&!(0===u))return n;let x,O,C=0;if(p&&(t===r||r===s))C=n-c;else{const e=r.toLowerCase(),t=i.toLowerCase().substr(0,n).split("").filter(t=>-1!==e.indexOf(t));O=t[t.length-1];const h=l.substr(0,t.length).split("").filter(e=>e!==f).length,g=s.substr(0,t.length).split("").filter(e=>e!==f).length!==h,u=void 0!==l[t.length-1]&&void 0!==s[t.length-2]&&l[t.length-1]!==f&&l[t.length-1]!==s[t.length-1]&&l[t.length-1]===s[t.length-2];!p&&(g||u)&&h>0&&s.indexOf(O)>-1&&void 0!==i[n]&&(x=!0,O=i[n]);const d=o.map(t=>e[t]).filter(e=>e===O).length,c=t.filter(e=>e===O).length,b=s.substr(0,s.indexOf(f)).split("").filter((e,t)=>e===O&&i[t]!==e).length+c+d+(x?1:0);let v=0;for(let t=0;t<a;t++){if(C=t+1,e[t]===O&&v++,v>=b)break}}if(p){let e=C;for(let t=C;t<=d;t++)if(s[t]===f&&(e=t),s[t]===f||-1!==h.indexOf(t)||t===d)return e}else if(x){for(let e=C-1;e>=0;e--)if(r[e]===O||-1!==h.indexOf(e)||0===e)return e}else for(let e=C;e>=0;e--)if(s[e-1]===f||-1!==h.indexOf(e)||0===e)return e}});
//# sourceMappingURL=sourcemaps/adjustCaretPosition.js.map
