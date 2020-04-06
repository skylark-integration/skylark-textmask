/**
 * skylark-textmask - A version of textmask that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-textmask/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-textmask/constants',[],function () {
    'use strict';
    const placeholderChar = '_';
    const strFunction = 'function';
    return {
        placeholderChar: placeholderChar,
        strFunction: strFunction
    };
});
define('skylark-textmask/utilities',['./constants'], function (defaultPlaceholderChar) {
    'use strict';
    const emptyArray = [];
    function convertMaskToPlaceholder(mask = emptyArray, placeholderChar = defaultPlaceholderChar) {
        if (!isArray(mask)) {
            throw new Error('Text-mask:convertMaskToPlaceholder; The mask property must be an array.');
        }
        if (mask.indexOf(placeholderChar) !== -1) {
            throw new Error('Placeholder character must not be used as part of the mask. Please specify a character ' + 'that is not present in your mask as your placeholder character.\n\n' + `The placeholder character that was received is: ${ JSON.stringify(placeholderChar) }\n\n` + `The mask that was received is: ${ JSON.stringify(mask) }`);
        }
        return mask.map(char => {
            return char instanceof RegExp ? placeholderChar : char;
        }).join('');
    }
    function isArray(value) {
        return Array.isArray && Array.isArray(value) || value instanceof Array;
    }
    function isString(value) {
        return typeof value === 'string' || value instanceof String;
    }
    function isNumber(value) {
        return typeof value === 'number' && value.length === undefined && !isNaN(value);
    }
    function isNil(value) {
        return typeof value === 'undefined' || value === null;
    }
    const strCaretTrap = '[]';
    function processCaretTraps(mask) {
        const indexes = [];
        let indexOfCaretTrap;
        while (indexOfCaretTrap = mask.indexOf(strCaretTrap), indexOfCaretTrap !== -1) {
            indexes.push(indexOfCaretTrap);
            mask.splice(indexOfCaretTrap, 1);
        }
        return {
            maskWithoutCaretTraps: mask,
            indexes
        };
    }
    return {
        convertMaskToPlaceholder: convertMaskToPlaceholder,
        isArray: isArray,
        isString: isString,
        isNumber: isNumber,
        isNil: isNil,
        processCaretTraps: processCaretTraps
    };
});
define('skylark-textmask/conformToMask',[
    './utilities',
    './constants',
    './constants'
], function (a, defaultPlaceholderChar, b) {
    'use strict';
    const emptyArray = [];
    const emptyString = '';
    return function conformToMask(rawValue = emptyString, mask = emptyArray, config = {}) {
        if (!a.isArray(mask)) {
            if (typeof mask === b.strFunction) {
                mask = mask(rawValue, config);
                mask = a.processCaretTraps(mask).maskWithoutCaretTraps;
            } else {
                throw new Error('Text-mask:conformToMask; The mask property must be an array.');
            }
        }
        const {guide = true, previousConformedValue = emptyString, placeholderChar = defaultPlaceholderChar, placeholder = a.convertMaskToPlaceholder(mask, placeholderChar), currentCaretPosition, keepCharPositions} = config;
        const suppressGuide = guide === false && previousConformedValue !== undefined;
        const rawValueLength = rawValue.length;
        const previousConformedValueLength = previousConformedValue.length;
        const placeholderLength = placeholder.length;
        const maskLength = mask.length;
        const editDistance = rawValueLength - previousConformedValueLength;
        const isAddition = editDistance > 0;
        const indexOfFirstChange = currentCaretPosition + (isAddition ? -editDistance : 0);
        const indexOfLastChange = indexOfFirstChange + Math.abs(editDistance);
        if (keepCharPositions === true && !isAddition) {
            let compensatingPlaceholderChars = emptyString;
            for (let i = indexOfFirstChange; i < indexOfLastChange; i++) {
                if (placeholder[i] === placeholderChar) {
                    compensatingPlaceholderChars += placeholderChar;
                }
            }
            rawValue = rawValue.slice(0, indexOfFirstChange) + compensatingPlaceholderChars + rawValue.slice(indexOfFirstChange, rawValueLength);
        }
        const rawValueArr = rawValue.split(emptyString).map((char, i) => ({
            char,
            isNew: i >= indexOfFirstChange && i < indexOfLastChange
        }));
        for (let i = rawValueLength - 1; i >= 0; i--) {
            const {char} = rawValueArr[i];
            if (char !== placeholderChar) {
                const shouldOffset = i >= indexOfFirstChange && previousConformedValueLength === maskLength;
                if (char === placeholder[shouldOffset ? i - editDistance : i]) {
                    rawValueArr.splice(i, 1);
                }
            }
        }
        let conformedValue = emptyString;
        let someCharsRejected = false;
        placeholderLoop:
            for (let i = 0; i < placeholderLength; i++) {
                const charInPlaceholder = placeholder[i];
                if (charInPlaceholder === placeholderChar) {
                    if (rawValueArr.length > 0) {
                        while (rawValueArr.length > 0) {
                            const {
                                char: rawValueChar,
                                isNew
                            } = rawValueArr.shift();
                            if (rawValueChar === placeholderChar && suppressGuide !== true) {
                                conformedValue += placeholderChar;
                                continue placeholderLoop;
                            } else if (mask[i].test(rawValueChar)) {
                                if (keepCharPositions !== true || isNew === false || previousConformedValue === emptyString || guide === false || !isAddition) {
                                    conformedValue += rawValueChar;
                                } else {
                                    const rawValueArrLength = rawValueArr.length;
                                    let indexOfNextAvailablePlaceholderChar = null;
                                    for (let i = 0; i < rawValueArrLength; i++) {
                                        const charData = rawValueArr[i];
                                        if (charData.char !== placeholderChar && charData.isNew === false) {
                                            break;
                                        }
                                        if (charData.char === placeholderChar) {
                                            indexOfNextAvailablePlaceholderChar = i;
                                            break;
                                        }
                                    }
                                    if (indexOfNextAvailablePlaceholderChar !== null) {
                                        conformedValue += rawValueChar;
                                        rawValueArr.splice(indexOfNextAvailablePlaceholderChar, 1);
                                    } else {
                                        i--;
                                    }
                                }
                                continue placeholderLoop;
                            } else {
                                someCharsRejected = true;
                            }
                        }
                    }
                    if (suppressGuide === false) {
                        conformedValue += placeholder.substr(i, placeholderLength);
                    }
                    break;
                } else {
                    conformedValue += charInPlaceholder;
                }
            }
        if (suppressGuide && isAddition === false) {
            let indexOfLastFilledPlaceholderChar = null;
            for (let i = 0; i < conformedValue.length; i++) {
                if (placeholder[i] === placeholderChar) {
                    indexOfLastFilledPlaceholderChar = i;
                }
            }
            if (indexOfLastFilledPlaceholderChar !== null) {
                conformedValue = conformedValue.substr(0, indexOfLastFilledPlaceholderChar + 1);
            } else {
                conformedValue = emptyString;
            }
        }
        return {
            conformedValue,
            meta: { someCharsRejected }
        };
    };
});
define('skylark-textmask/adjustCaretPosition',[],function () {
    'use strict';
    const defaultArray = [];
    const emptyString = '';
    return function adjustCaretPosition({previousConformedValue = emptyString, previousPlaceholder = emptyString, currentCaretPosition = 0, conformedValue, rawValue, placeholderChar, placeholder, indexesOfPipedChars = defaultArray, caretTrapIndexes = defaultArray}) {
        if (currentCaretPosition === 0 || !rawValue.length) {
            return 0;
        }
        const rawValueLength = rawValue.length;
        const previousConformedValueLength = previousConformedValue.length;
        const placeholderLength = placeholder.length;
        const conformedValueLength = conformedValue.length;
        const editLength = rawValueLength - previousConformedValueLength;
        const isAddition = editLength > 0;
        const isFirstRawValue = previousConformedValueLength === 0;
        const isPartialMultiCharEdit = editLength > 1 && !isAddition && !isFirstRawValue;
        if (isPartialMultiCharEdit) {
            return currentCaretPosition;
        }
        const possiblyHasRejectedChar = isAddition && (previousConformedValue === conformedValue || conformedValue === placeholder);
        let startingSearchIndex = 0;
        let trackRightCharacter;
        let targetChar;
        if (possiblyHasRejectedChar) {
            startingSearchIndex = currentCaretPosition - editLength;
        } else {
            const normalizedConformedValue = conformedValue.toLowerCase();
            const normalizedRawValue = rawValue.toLowerCase();
            const leftHalfChars = normalizedRawValue.substr(0, currentCaretPosition).split(emptyString);
            const intersection = leftHalfChars.filter(char => normalizedConformedValue.indexOf(char) !== -1);
            targetChar = intersection[intersection.length - 1];
            const previousLeftMaskChars = previousPlaceholder.substr(0, intersection.length).split(emptyString).filter(char => char !== placeholderChar).length;
            const leftMaskChars = placeholder.substr(0, intersection.length).split(emptyString).filter(char => char !== placeholderChar).length;
            const masklengthChanged = leftMaskChars !== previousLeftMaskChars;
            const targetIsMaskMovingLeft = previousPlaceholder[intersection.length - 1] !== undefined && placeholder[intersection.length - 2] !== undefined && previousPlaceholder[intersection.length - 1] !== placeholderChar && previousPlaceholder[intersection.length - 1] !== placeholder[intersection.length - 1] && previousPlaceholder[intersection.length - 1] === placeholder[intersection.length - 2];
            if (!isAddition && (masklengthChanged || targetIsMaskMovingLeft) && previousLeftMaskChars > 0 && placeholder.indexOf(targetChar) > -1 && rawValue[currentCaretPosition] !== undefined) {
                trackRightCharacter = true;
                targetChar = rawValue[currentCaretPosition];
            }
            const pipedChars = indexesOfPipedChars.map(index => normalizedConformedValue[index]);
            const countTargetCharInPipedChars = pipedChars.filter(char => char === targetChar).length;
            const countTargetCharInIntersection = intersection.filter(char => char === targetChar).length;
            const countTargetCharInPlaceholder = placeholder.substr(0, placeholder.indexOf(placeholderChar)).split(emptyString).filter((char, index) => char === targetChar && rawValue[index] !== char).length;
            const requiredNumberOfMatches = countTargetCharInPlaceholder + countTargetCharInIntersection + countTargetCharInPipedChars + (trackRightCharacter ? 1 : 0);
            let numberOfEncounteredMatches = 0;
            for (let i = 0; i < conformedValueLength; i++) {
                const conformedValueChar = normalizedConformedValue[i];
                startingSearchIndex = i + 1;
                if (conformedValueChar === targetChar) {
                    numberOfEncounteredMatches++;
                }
                if (numberOfEncounteredMatches >= requiredNumberOfMatches) {
                    break;
                }
            }
        }
        if (isAddition) {
            let lastPlaceholderChar = startingSearchIndex;
            for (let i = startingSearchIndex; i <= placeholderLength; i++) {
                if (placeholder[i] === placeholderChar) {
                    lastPlaceholderChar = i;
                }
                if (placeholder[i] === placeholderChar || caretTrapIndexes.indexOf(i) !== -1 || i === placeholderLength) {
                    return lastPlaceholderChar;
                }
            }
        } else {
            if (trackRightCharacter) {
                for (let i = startingSearchIndex - 1; i >= 0; i--) {
                    if (conformedValue[i] === targetChar || caretTrapIndexes.indexOf(i) !== -1 || i === 0) {
                        return i;
                    }
                }
            } else {
                for (let i = startingSearchIndex; i >= 0; i--) {
                    if (placeholder[i - 1] === placeholderChar || caretTrapIndexes.indexOf(i) !== -1 || i === 0) {
                        return i;
                    }
                }
            }
        }
    };
});
define('skylark-textmask/createTextMaskInputElement',[
    './adjustCaretPosition',
    './conformToMask',
    './utilities',
    './constants',
    './constants'
], function (adjustCaretPosition, conformToMask, a, defaultPlaceholderChar, b) {
    'use strict';
    const emptyString = '';
    const strNone = 'none';
    const strObject = 'object';
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
    const defer = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout;
    return function createTextMaskInputElement(config) {
        const state = {
            previousConformedValue: undefined,
            previousPlaceholder: undefined
        };
        return {
            state,
            update(rawValue, {
                inputElement,
                mask: providedMask,
                guide,
                pipe,
                placeholderChar = defaultPlaceholderChar,
                keepCharPositions = false,
                showMask = false
            } = config) {
                if (typeof rawValue === 'undefined') {
                    rawValue = inputElement.value;
                }
                if (rawValue === state.previousConformedValue) {
                    return;
                }
                if (typeof providedMask === strObject && providedMask.pipe !== undefined && providedMask.mask !== undefined) {
                    pipe = providedMask.pipe;
                    providedMask = providedMask.mask;
                }
                let placeholder;
                let mask;
                if (providedMask instanceof Array) {
                    placeholder = a.convertMaskToPlaceholder(providedMask, placeholderChar);
                }
                if (providedMask === false) {
                    return;
                }
                const safeRawValue = getSafeRawValue(rawValue);
                const {selectionEnd: currentCaretPosition} = inputElement;
                const {previousConformedValue, previousPlaceholder} = state;
                let caretTrapIndexes;
                if (typeof providedMask === b.strFunction) {
                    mask = providedMask(safeRawValue, {
                        currentCaretPosition,
                        previousConformedValue,
                        placeholderChar
                    });
                    if (mask === false) {
                        return;
                    }
                    const {maskWithoutCaretTraps, indexes} = a.processCaretTraps(mask);
                    mask = maskWithoutCaretTraps;
                    caretTrapIndexes = indexes;
                    placeholder = a.convertMaskToPlaceholder(mask, placeholderChar);
                } else {
                    mask = providedMask;
                }
                const conformToMaskConfig = {
                    previousConformedValue,
                    guide,
                    placeholderChar,
                    pipe,
                    placeholder,
                    currentCaretPosition,
                    keepCharPositions
                };
                const {conformedValue} = conformToMask(safeRawValue, mask, conformToMaskConfig);
                const piped = typeof pipe === b.strFunction;
                let pipeResults = {};
                if (piped) {
                    pipeResults = pipe(conformedValue, Object.assign({
                        rawValue: safeRawValue
                    },conformToMaskConfig));
                    if (pipeResults === false) {
                        pipeResults = {
                            value: previousConformedValue,
                            rejected: true
                        };
                    } else if (a.isString(pipeResults)) {
                        pipeResults = { value: pipeResults };
                    }
                }
                const finalConformedValue = piped ? pipeResults.value : conformedValue;
                const adjustedCaretPosition = adjustCaretPosition({
                    previousConformedValue,
                    previousPlaceholder,
                    conformedValue: finalConformedValue,
                    placeholder,
                    rawValue: safeRawValue,
                    currentCaretPosition,
                    placeholderChar,
                    indexesOfPipedChars: pipeResults.indexesOfPipedChars,
                    caretTrapIndexes
                });
                const inputValueShouldBeEmpty = finalConformedValue === placeholder && adjustedCaretPosition === 0;
                const emptyValue = showMask ? placeholder : emptyString;
                const inputElementValue = inputValueShouldBeEmpty ? emptyValue : finalConformedValue;
                state.previousConformedValue = inputElementValue;
                state.previousPlaceholder = placeholder;
                if (inputElement.value === inputElementValue) {
                    return;
                }
                inputElement.value = inputElementValue;
                safeSetSelection(inputElement, adjustedCaretPosition);
            }
        };
    };
    function safeSetSelection(element, selectionPosition) {
        if (document.activeElement === element) {
            if (isAndroid) {
                defer(() => element.setSelectionRange(selectionPosition, selectionPosition, strNone), 0);
            } else {
                element.setSelectionRange(selectionPosition, selectionPosition, strNone);
            }
        }
    }
    function getSafeRawValue(inputValue) {
        if (a.isString(inputValue)) {
            return inputValue;
        } else if (a.isNumber(inputValue)) {
            return String(inputValue);
        } else if (inputValue === undefined || inputValue === null) {
            return emptyString;
        } else {
            throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value " + `received was:\n\n ${ JSON.stringify(inputValue) }`);
        }
    }
});
define('skylark-textmask/main',[
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
define('skylark-textmask', ['skylark-textmask/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-textmask.js.map
