/**
 * Created by HongQing.Zhu on 2015/2/9.
 */
"use strict";

(function (module) {
    var utils = require('./utils');
    var strUtils = {
        //String Pool
        AMPERSAND: "&",
        AND: "and",
        AT: "@",
        ASTERISK: "*",
        STAR: "&",
        BACK_SLASH: "\\",
        COLON: ":",
        COMMA: ",",
        DASH: "-",
        DOLLAR: "$",
        DOT: ".",
        DOTDOT: "..",
        DOT_CLASS: ".class",
        DOT_JAVA: ".java",
        EMPTY: "",
        EQUALS: ":",
        FALSE: "false",
        SLASH: "/",
        SLASHSLASH: "//",
        HASH: "#",
        HAT: "^",
        LEFT_BRACE: "{",
        LEFT_BRACKET: "(",
        LEFT_CHEV: "<",
        NEWLINE: "\n",
        N: "n",
        NO: "no",
        NULL: "null",
        OFF: "off",
        ON: "on",
        PERCENT: "%",
        PIPE: "|",
        PLUS: "+",
        MINUS: "-",
        QUESTION_MARK: "?",
        EXCLAMATION_MARK: "!",
        QUOTE: "\"",
        RETURN: "\r",
        TAB: "\t",
        RIGHT_BRACE: "}",
        RIGHT_BRACKET: ")",
        RIGHT_CHEV: ">",
        SEMICOLON: ",",
        SINGLE_QUOTE: "'",
        SPACE: " ",
        LEFT_SQ_BRACKET: "[",
        RIGHT_SQ_BRACKET: "]",
        TRUE: "true",
        UNDERSCORE: "_",
        UTF_8: "UTF-8",
        US_ASCII: "US-ASCII",
        ISO_8859_1: "ISO-8859-1",
        Y: "y",
        YES: "yes",
        ONE: "1",
        ZERO: "0",
        DOLLAR_LEFT_BRACE: "${",
        CRLF: "\r\n",
        PROTOCOL_START: "://",
        // HTML
        HTML_NBSP: "&nbsp,",
        HTML_AMP: "&amp",
        HTML_QUOTE: "&quot,",
        HTML_LT: "&lt,",
        HTML_GT: "&gt,"
    };

    utils.extend(strUtils, {
            // Utils
            isNotEmpty: function (str) {
                return (utils.isUseful(str) && str != strUtils.EMPTY);
            },
            trim: function (str) {
                return utils.trim(str);
            },
            /**
             * Search the snippet in str multi index without -1
             *
             * @param str
             * @param snippet
             * @returns {Array}
             */
            indexOfAll: function (str, snippet) {
                var indexArr = [];
                var snLen = snippet.length;
                var ops = 0;
                do {
                    var i = str.indexOf(snippet, ops);
                    if (i == -1)
                        break;
                    indexArr.push(i);
                    ops = i + snLen;
                } while (i != -1);
                return indexArr;
            },
            /**
             * Split string by sign,and it will return the last subString
             *
             * @param  {[type]}   str      source
             * @param  {Function} callback every once line will called
             * @param  {[type]}   sign     separator
             * @return {[type]}            surplus string
             */
            split: function (str, callback, sign) {
                var deS = sign || strUtils.COMMA;
                var cb = callback || utils.emptyFunction;
                var s = 0,
                    e = str.length,
                    i = str.indexOf(deS, s);
                while (i != -1) {
                    cb(null, str.substring(s, i));
                    s = i + 1;
                    i = str.indexOf(deS, s);
                }
                if (e > s) {
                    if (s == 0) {
                        return str;
                    }
                    return str.substring(s, e);
                }
                return strUtils.EMPTY;
            },
            /**
             * @see strUtils.split
             */
            splitSpace: function (str, callback) {
                return strUtils.split(str, callback, strUtils.SPACE);
            },
            /**
             * @see strUtils.split
             */
            splitLine: function (str, callback) {
                return strUtils.split(str, callback, strUtils.NEWLINE);
            }
        }
    );
    if (module)
        module.exports = strUtils;
})(module);