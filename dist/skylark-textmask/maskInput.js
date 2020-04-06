/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
define(["./textmask","./createTextMaskInputElement"],function(t,e){"use strict";return t.maskInput=function(t){const{inputElement:n}=t,u=e(t),a=({target:{value:t}})=>u.update(t);return n.addEventListener("input",a),u.update(n.value),{textMaskInputElement:u,destroy(){n.removeEventListener("input",a)}}}});
//# sourceMappingURL=sourcemaps/maskInput.js.map
