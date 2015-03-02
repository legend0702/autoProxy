/**
 * Created by HongQing.Zhu on 2015/2/9.
 */
"use strict";

var url = require('url');
var dns = require('dns');
var utils = require("../lib/utils");
var strUtils = require("../lib/strUtils");
var fsUtils = require("../lib/fsUtils");
var pacUtils = require("../lib/pacUtils");
var ipUtils = require("../lib/ipUtils");
var hashMap = require("../lib/HashMap");

//Analyze result
var data = {

};

//Log analyzer
var logTool = (function () {
    var logTool = {};
    //Log schema
    var logSchema = function () {
        return {
            // 1422170012.007
            time: '',
            // 60889
            remotePort: null,
            // 221.219.115.49
            remoteIP: '',
            // TCP_MISS/200
            status: '',
            // 606 流量
            pkgSize: 0,
            // CONNECT
            type: '',
            // mtalk.google.com:5228 ==> node'url object
            url: '',
            // HIER_DIRECT/74.125.20.188
            proxy: '',
            // application/json
            mime: ''
        }
    };

    utils.extend(logTool, {
        //1422783403.348    263 123.66.231.38 TCP_MISS/503 378 HEAD http://aqlhdhvgpnzrxve/ 58889 HIER_NONE/- text/html
        decodeLine: function (line) {
            var log = logSchema();
            if (!utils.isUseful(line))
                return log;
            //hack :)
            log.time = line.substr(0, 14);
            log.remotePort = utils.trim(line.substring(16, 21));
            var larr = line.substr(22).split(strUtils.SPACE);
            log.remoteIP = larr[0];
            log.status = larr[1];
            log.pkgSize = Number(larr[2] || 0);
            log.type = larr[3];
            var u = larr[4] || '';
            if (u) {
                // hack tcp://
                if (log.type === 'CONNECT') {
                    u = "tcp://" + u;
                }
                log.url = url.parse(u);
            }
            log.proxy = larr[5];
            log.mime = larr[6];
            return log;
        },
        decodeFile: function (path) {
            var schemas = [];
            var text = fsUtils.readTextSync(path);
            var lines = text.split(strUtils.NEWLINE);
            utils.each(lines, function (l, d) {
                schemas.push(logTool.decodeLine(d));
            });
            return schemas;
        },
        decodeFiles: function (root) {

        }
    });
    return logTool;
})();

//Test
var juicerT = function () {
    pacUtils.createByTOP1W("../test/top1w.txt");
};
//juicerT();

var logT = function () {
    var s = logTool.decodeFile("G:/jsWork/autoProxy/test/logs/access.log-20150129");
    console.log(s);
};

logT();


//dns.resolve4('google.com', function (err, addresses) {
//    if (err) throw err;
//    console.log('addresses: ' + JSON.stringify(addresses));
//});

// Simple Timer :)
//setInterval(main, config.intervalTime);