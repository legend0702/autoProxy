/**
 * Created by HongQing.Zhu on 2015/2/9.
 */
"use strict";

var config = require("../config");
var utils = require("../lib/utils");
var fsUtils = require("../lib/fsUtils");
var logAnalyzer = require("../lib/logAnalyzer");
var cnipTool = require("../lib/cnipTool");
var pacUtils = require("../lib/pacUtils");
var ipUtils = require("../lib/ipUtils");
var domainUtils = require("../lib/domainUtils");

var validateSchema = function (schemas) {
    //TODO
};

// Fix hostname to domain
// Padding urlIP
var fixLogSchema = function (schemas) {
    var domainIP = {};
    var emptyUrlIP = [];
    for (var i = 0; i < schemas.length; i++) {
        var log = schemas[i];
        var domain = null;
        try {
            domain = domainUtils.getDomain(log.url.hostname);
        } catch (e) {
            console.log(e + ":" + log.origin);
            schemas.splice(i, 1);
            i--;
            continue;
        }
        if (!domain) {
            console.error("Can't find domain:" + schemas[i].origin);
            schemas.splice(i, 1);
            i--;
            continue;
        }
        log.url.hostname = domain;
        var urlIP = log.urlIP;
        // Record ip
        if (ipUtils.isIP(urlIP)) {
            domainIP[domain] = urlIP;
        } else {
            urlIP = domainIP[domain];
            if (!urlIP) {
                emptyUrlIP.push(log);
                continue
            }
            log.urlIP = urlIP;
        }
    }
    for (var i = 0; i < emptyUrlIP.length; i++) {
        var log = emptyUrlIP[i];
        var ip = domainIP[log.url.hostname];
        if (!ip) {
            console.error("Can't find ip for:" + log.origin);
            continue;
        }
        log.urlIP = ip;
    }
};

var analyzerAndCreatePac = function (hostCallBack) {
    //var logs = logAnalyzer.decodeFilesSync(config.rootDir);
    var logs = logAnalyzer.decodeFileSync("../resources/logs/access.log-20150129");
    fixLogSchema(logs);
    var hostNames = logAnalyzer.sortByPkgSizeWithGroupHostName(logs);
    for (var i = 0; i < hostNames.length; i++) {
        var hostName = hostNames[i];
        utils.each(hostName.urlIP, function (ip, count) {
            // 停止循环
            if (false === hostCallBack(ip, hostName)) {
                return false;
            }
        });
        // 如果没有对这个对象设置proxy 就代表这个元素不要了
        if (!utils.isUseful(hostName.proxy)) {
            hostNames.splice(i, 1);
            i--;
        }
    }
    pacUtils.createHashSwitch(hostNames)
};

// Creat white pac :)
analyzerAndCreatePac(function (ip, shcema) {
    shcema.domain = shcema.hostname;
    // 只要有在国内的节点 就认为可以从国内直接连接
    if (cnipTool.isCNIP(ip)) {
        shcema.proxy = false;
        return false;
    }
});