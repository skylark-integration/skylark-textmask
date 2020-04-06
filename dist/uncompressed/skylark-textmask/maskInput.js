define([
    "./textmask",
	'./createTextMaskInputElement'
],function (textmask,createTextMaskInputElement) {
    'use strict';


	function maskInput(textMaskConfig) {
	  const {inputElement} = textMaskConfig
	  const textMaskInputElement = createTextMaskInputElement(textMaskConfig)
	  const inputHandler = ({target: {value}}) => textMaskInputElement.update(value)

	  inputElement.addEventListener('input', inputHandler)

	  textMaskInputElement.update(inputElement.value)

	  return {
	    textMaskInputElement,

	    destroy() {
	      inputElement.removeEventListener('input', inputHandler)
	    }
	  }
	}

	return textmask.maskInput = maskInput;

}); 