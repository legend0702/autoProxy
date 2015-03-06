/**
 * Created by HongQing.Zhu on 2015/3/4.
 */

describe("HashMap Test", function () {
    var HashMap = require("../lib/HashMap"),
        utils = require("../lib/utils"),
        strUtils = require("../lib/strUtils"),
        fsUtils = require("../lib/fsUtils"),
        maxLength = 10000;

    var hashMap = new HashMap(maxLength * 10),
        domains = {},
        top1wArr = [],
        static_key = undefined;

    function getRandomDomain() {
        return  top1wArr[Math.round(Math.random() * maxLength)];
    }

    before(function () {
        var top1w = fsUtils.readTextSync("./test/top1w.txt");
        var lines = top1w.split(strUtils.NEWLINE);
        utils.each(lines, function (l, d) {
            var arr = d.split(strUtils.COMMA);
            var num = arr[0];
            var host = arr[1];
            // put data
            domains[host] = num;
            hashMap.put(host, num);
            top1wArr.push(host);
        });
        static_key = getRandomDomain();
        console.log("Loaded :) " + top1wArr.length);
    });

    beforeEach(function () {
        console.log("Start:" + new Date().getTime());
    });

    afterEach(function () {
        console.log("End:" + new Date().getTime());
    });

    describe("Object Test", function () {
        it("Object Random", function () {
            utils.foreach(top1wArr, function (i, d) {
                domains[d];
            });
        });
        it("Object Static", function () {
            for (var i = 0; i < maxLength; i++) {
                domains[static_key];
            }
        });
    });

    describe("HashMap Test", function () {
        it("HashMap Random", function () {
            utils.foreach(top1wArr, function (i, d) {
                hashMap.get(d);
            });
        });
        it("HashMap Static", function () {
            for (var i = 0; i < maxLength; i++) {
                hashMap.get(static_key);
            }
        });
    });

});