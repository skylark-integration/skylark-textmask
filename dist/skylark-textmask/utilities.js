/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
define(["./constants"],function(r){"use strict";const e=[];function t(r){return Array.isArray&&Array.isArray(r)||r instanceof Array}const n="[]";return{convertMaskToPlaceholder:function(n=e,a=r){if(!t(n))throw new Error("Text-mask:convertMaskToPlaceholder; The mask property must be an array.");if(-1!==n.indexOf(a))throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n"+`The placeholder character that was received is: ${JSON.stringify(a)}\n\n`+`The mask that was received is: ${JSON.stringify(n)}`);return n.map(r=>r instanceof RegExp?a:r).join("")},isArray:t,isString:function(r){return"string"==typeof r||r instanceof String},isNumber:function(r){return"number"==typeof r&&void 0===r.length&&!isNaN(r)},isNil:function(r){return void 0===r||null===r},processCaretTraps:function(r){const e=[];let t;for(;-1!==(t=r.indexOf(n));)e.push(t),r.splice(t,1);return{maskWithoutCaretTraps:r,indexes:e}}}});
//# sourceMappingURL=sourcemaps/utilities.js.map
