define([
	"skylark-langx/skylark",
	'./conformToMask',
	'./adjustCaretPosition',
	'./createTextMaskInputElement'
],function (skylark,conformToMask,adjustCaretPosition,createTextMaskInputElement) {

    'use strict';

    return skylark.attach("intg.textmask",{
        conformToMask,
        adjustCaretPosition,
        createTextMaskInputElement
    });
}); 