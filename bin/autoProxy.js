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
var HashMap = require("../lib/HashMap");

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
var createPacByTOP1W = function () {
    var top1w = fsUtils.readTextSync("../test/top1w.txt");
    var lines = top1w.split(strUtils.NEWLINE);
    var domains = [];
    utils.each(lines, function (l, d) {
        domains.push(d.split(strUtils.COMMA)[1]);
    });
    //pacUtils.createByTOP1W("../test/top1w.txt");
};
//createPacByTOP1W();


var logT = function () {
    var s = logTool.decodeFile("../test/logs/access.log-20150129");
    console.log(s);
};
//logT();

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

//ability
/**
 * 测试obj的hashmap快 还是手写的hashmap快
 *
 * obj的hashmap快一点~
 *
 * 10000次get 平均obj大于map的此时在60~70 而map大于obj的在10~20 其余相等
 */
var ability = function () {
    var hashMap = new HashMap();
    var domains = {};
    var top1wArr = new Array(10000);
    var top1w = fsUtils.readTextSync("../test/top1w.txt");
    var lines = top1w.split(strUtils.NEWLINE);
    utils.each(lines, function (l, d) {
        var arr = d.split(strUtils.COMMA);
        var num = arr[0];
        var host = arr[1];
        var length = host.split(strUtils.DOT).length;
        var ld = domains[length];
        if (!ld) {
            ld = {};
            domains[length] = ld;
        }
        ld[host] = num;
        hashMap.put(host, num);
        top1wArr[num] = host;
    });

    var concatArr = function (arr) {
        var str = '';
        for (var i = 0, e = arr.length; i < e; i++)
            str += arr[i] + ".";
        return str.substring(0, str.length - 1);
    };

    var findDomain = function (host) {
        var sh = host.split(strUtils.DOT);
        var index = sh.length - 1;
        while (index != 0) {
            var ish = sh.slice(index - 1);
            var hostName = concatArr(ish);
            var num = domains[ish.length][hostName];
            if (!num) {
                index--;
                continue;
            }
            return num;
        }
    };

    var testAbility = function (host) {
        var endDate = null;
        var a = 0;
        var b = 0;
        var num = 0;
        var startDate = new Date().getTime();
        //console.log("objTest:" + startDate);
        num = findDomain(host);
        //console.log(findDomain(host));
        endDate = new Date().getTime();
        a = endDate - startDate;
        //console.log("objTestEnd:" + a);


        startDate = new Date().getTime();
        //console.log("mapTest:" + startDate);
        num = hashMap.get(host);
        //console.log(hashMap.get(host));
        endDate = new Date().getTime();
        b = endDate - startDate;
        //console.log("mapTestEnd:" + b);
        // 代表map快
        if (a > b)
            return {
                i: 0,
                h: host,
                n: num,
                a: a,
                b: b
            };
        // 代表obj快
        if (b > a)
            return {
                i: 1,
                h: host,
                n: num,
                a: a,
                b: b
            };
        // 无法比较或相同
        return {
            i: 2,
            h: host,
            n: num,
            a: a,
            b: b
        };
    };

    var roudomTest = function () {
        return testAbility(top1wArr[Math.round(Math.random() * 10000)]);
    };

    var testArr = new Array(3);
    for (var i = 10000; i != 0; i--) {
        var result = roudomTest();
        if (!result)
            continue;
        var iArr = testArr[result.i];
        if (!iArr) {
            iArr = [];
            testArr[result.i] = iArr;
        }
        iArr.push(result);
    }
    console.log("a>b:" + testArr[0].length);
    console.log("b>a:" + testArr[1].length);
    console.log("a=b:" + testArr[2].length);
};

//ability();

//dns.resolve4('google.com', function (err, addresses) {
//    if (err) throw err;
//    console.log('addresses: ' + JSON.stringify(addresses));
//});

// Simple Timer :)
//setInterval(main, config.intervalTime);