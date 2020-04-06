/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
define(["./textmask"],function(e){"use strict";const t=[],l="";return e.adjustCaretPosition=function({previousConformedValue:e=l,previousPlaceholder:n=l,currentCaretPosition:r=0,conformedValue:i,rawValue:s,placeholderChar:o,placeholder:f,indexesOfPipedChars:h=t,caretTrapIndexes:g=t}){if(0===r||!s.length)return 0;const u=s.length,d=e.length,a=f.length,c=i.length,p=u-d,x=p>0;if(p>1&&!x&&0!==d)return r;let C,O,v=0;if(!x||e!==i&&i!==f){const e=i.toLowerCase(),t=s.toLowerCase().substr(0,r).split(l).filter(t=>-1!==e.indexOf(t));O=t[t.length-1];const g=n.substr(0,t.length).split(l).filter(e=>e!==o).length,u=f.substr(0,t.length).split(l).filter(e=>e!==o).length!==g,d=void 0!==n[t.length-1]&&void 0!==f[t.length-2]&&n[t.length-1]!==o&&n[t.length-1]!==f[t.length-1]&&n[t.length-1]===f[t.length-2];!x&&(u||d)&&g>0&&f.indexOf(O)>-1&&void 0!==s[r]&&(C=!0,O=s[r]);const a=h.map(t=>e[t]).filter(e=>e===O).length,p=t.filter(e=>e===O).length,b=f.substr(0,f.indexOf(o)).split(l).filter((e,t)=>e===O&&s[t]!==e).length+p+a+(C?1:0);let m=0;for(let t=0;t<c&&(v=t+1,e[t]===O&&m++,!(m>=b));t++);}else v=r-p;if(x){let e=v;for(let t=v;t<=a;t++)if(f[t]===o&&(e=t),f[t]===o||-1!==g.indexOf(t)||t===a)return e}else if(C){for(let e=v-1;e>=0;e--)if(i[e]===O||-1!==g.indexOf(e)||0===e)return e}else for(let e=v;e>=0;e--)if(f[e-1]===o||-1!==g.indexOf(e)||0===e)return e}});
//# sourceMappingURL=sourcemaps/adjustCaretPosition.js.map
