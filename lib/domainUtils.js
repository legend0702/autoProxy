/**
 * Created by HongQing.Zhu on 2015/2/11.
 */
"use strict";

(function(module) {
    // DomainUtils
    var doUtils = {
        /**
         * First char analyze.
         * a - z
         *
         * @param domains
         */
        firstCharAnalyze: function(domains) {
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
})(module);