define(['./constants'], function (constants) {
    'use strict';
    const emptyArray = [];
    function convertMaskToPlaceholder(mask = emptyArray, placeholderChar = constants.placeholderChar) {
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