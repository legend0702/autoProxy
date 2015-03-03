/**
 * Created by HongQing.Zhu on 2015/3/3.
 */
var utils = require("../lib/utils");
var strUtils = require("../lib/strUtils");
var fsUtils = require("../lib/fsUtils");
var HashMap = require("../lib/HashMap");

/**
 * 测试obj的hashmap快 还是手写的hashmap快
 *
 * 10000次get 平均obj大于map的次数在60~70 而map大于obj的在10~20 其余相等
 * 注:只要增加hashMap的容量 就能反超obj的默认实现 原理很简单 数组足够大支持O(1) :)
 * 修复了一下resize策略 现在效率高很多(原来的resize策略写错了 我说怎么怪怪的...
 * 基本完爆obj :)
 *
 */
var ability = function () {
    var hashMap = new HashMap();
    var domains = {};
    var top1wArr = new Array(10000);
    // init
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
        var host = null;
        do {
            host = top1wArr[Math.round(Math.random() * 10000)];
        } while (!host)
        return testAbility(host);
    };

    var testArr = new Array(3);
    // 10000 :)
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
    console.log("a>b(hashMap快):" + testArr[0].length);
    console.log("b>a(obj快):" + testArr[1].length);
    console.log("a=b(相等):" + testArr[2].length);
};
ability();