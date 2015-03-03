/**
 * Created by HongQing.Zhu on 2015/2/9.
 */
"use strict";
var fs = require('fs');
var utils = require("../lib/utils");
var strUtils = require("../lib/strUtils");
var fsUtils = require("../lib/fsUtils");
var logAnalyzer = require("../lib/logAnalyzer");
var cnipTool = require("../lib/cnipTool");
var pacUtils = require("../lib/pacUtils");

var domainUtils = require("../lib/domainUtils");


//Test
var createPacByTOP1W = function () {
    var top1w = fsUtils.readTextSync("../test/top1w.txt");
    var lines = top1w.split(strUtils.NEWLINE);
    var domains = [];
    utils.each(lines, function (l, d) {
        var doamin = d.split(strUtils.COMMA)[1];
        //dns.look
        //domains.push();
    });
    console.log(domains);
    //pacUtils.createByTOP1W("../test/top1w.txt");
};
//createPacByTOP1W();

var logT = function () {
    var logs = logAnalyzer.decodeFilesSync("../test/logs");
    // var logs = logAnalyzer.decodeFileSync("../test/logs/access.log-20150129");
    var cnipVali = cnipTool.decodeFileAndReturnValidation("../test/cnip.txt");
    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        if (cnipVali.isCNIP(log.urlIP)) {
            console.log("YES:" + log.url.hostname + ":" + log.urlIP);
        } else {
            console.log("NO:" + log.url.hostname + ":" + log.urlIP);
        }
    }
};
//logT();

var domainSuffix = function () {
    var url = "https://publicsuffix.org/list/effective_tld_names.dat";
    console.log(fs.readSync(url));
};
//domainSuffix();

(function () {
    var url = "gotemba.shizuoka.jp";
    console.log(domainUtils.getDomain(url));
})();

var demo = function () {
    var domains = [
        {
            domain: 'baidu.com',
            proxy: false
        },
        {
            domain: 'google.com',
            proxy: true
        }
    ];
    pacUtils.create(domains);
};

//demo();

//dns.resolve4('www.google.com', function (err, addresses) {
//    if (err) throw err;
//    console.log('addresses: ' + JSON.stringify(addresses));
//    addresses.forEach(function (a) {
//        dns.reverse(a, function (err, hostnames) {
//            if (err) {
//                throw err;
//            }
//            console.log('reverse for ' + a + ': ' + JSON.stringify(hostnames));
//        });
//    });
//});

// Simple Timer :)
//setInterval(main, config.intervalTime);