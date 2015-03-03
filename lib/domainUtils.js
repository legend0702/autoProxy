/**
 * Created by HongQing.Zhu on 2015/2/11.
 */
"use strict";

(function (module) {
    var config = require("../config");
    var strUtils = require("./strUtils");
    var fsUtils = require("./fsUtils");
    var domainSuffixMap = {};
    /** Record the Max-Snippet' length,Use it to check the max of host' split snippet*/
    var domainSuffixMaxSnippet = 0;

    (function init() {
        var path = config.domainSuffixPath;
        if (!path)
            return;
        var text = fsUtils.readLineSync(path, function (index, line) {
            var trimLine = strUtils.trim(line);
            // 只要有//出现就忽略这一行
            if (trimLine.indexOf(strUtils.SLASHSLASH) != -1)
                return;
            var frequency = strUtils.indexOfAll(trimLine, strUtils.DOT);
            if (frequency > domainSuffixMaxSnippet)
                domainSuffixMaxSnippet = frequency;
            domainSuffixMap[trimLine] = true;
        });
    })();

    var _firstSnippetKey = function (host) {
        return host.split(strUtils.DOT)[0];
    };

    // DomainUtils
    var doUtils = {
        /**
         * Judge the extSuffix,return the domain.
         * It will return null when the host is a wrong or bad or cant find the extSuffix.
         *
         * @param host *.*.*.*.extSuffix example:www.google.com,www.youtube.com
         * @returns null/*.extSuffix example:bing.com,google.com,youtube.com
         */
        getDomain: function (host) {
            var hostArr = host.split(strUtils.DOT);
            var hostArrLen = hostArr.length;
            // A bad host :(
            if (hostArrLen < 1)
                return null;
            /**
             * If a host only has two snippets,i think it already a domain :)
             *
             * !waring!:
             *  It has some bad small :)
             *  Like com.cn or gov.cm it is just a extSuffix,not a host
             *  But i think,you will not give me something like them :)
             */
            if (hostArrLen == 2)
                return host;
            // Judge extSuffix from end of hostArr :)
            /**
             * host:code.google.com: code.google.com -- > google.com --> com --> return google.com
             */
            var lastIndex = -(hostArrLen - 1 > domainSuffixMaxSnippet ? domainSuffixMaxSnippet : hostArrLen - 1);
            while (lastIndex != 0) {
                var extSuffix = hostArr.slice(lastIndex).join(strUtils.DOT);
                if (domainSuffixMap[extSuffix]) {
                    lastIndex--;
                    break;
                }
                lastIndex++
            }
            // Cant find a extSuffix :(
            if (lastIndex == 0)
                return null;
            // A bad host like gotemba.shizuoka.jp or other three-snippets extSuffix :(
            if ((-lastIndex) >= hostArrLen)
                return null;
            return hostArr.slice(lastIndex).join(strUtils.DOT);
        },
        /**
         * First char analyze.
         * a - z
         *
         * @param domains [bing.com,google.com,youtube.com]
         */
        firstCharAnalyze: function (domains) {
            var dos = [];
            // Keep order
            var temp = {};
            for (var i = 0, e = domains.length; i < e; i++) {
                var domain = domains[i];
                var fc = domain[0];
                if (!temp[fc]) {
                    temp[fc] = [];
                    dos.push({
                        k: fc,
                        domains: temp[fc]
                    });
                }
                temp[fc].push(domain);
            }
            return dos;
        }
    };

    if (module)
        module.exports = doUtils;
})
(module);