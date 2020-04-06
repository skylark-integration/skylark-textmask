define([
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