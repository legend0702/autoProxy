/**
 * Created by HongQing.Zhu on 2015/2/9.
 */
"use strict";

var utils = require("../lib/utils");
var fsUtils = require("../lib/fsUtils");
var logAnalyzer = require("../lib/logAnalyzer");
var cnipTool = require("../lib/cnipTool");
var pacUtils = require("../lib/pacUtils");
var ipUtils = require("../lib/ipUtils");
var domainUtils = require("../lib/domainUtils");

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
        schemas[i].url.hostname = domain;
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

var logT = function () {
    var logs = logAnalyzer.decodeFilesSync("../resources/logs");
    //var logs = logAnalyzer.decodeFileSync("../resources/logs/access.log-20150129");
    fixLogSchema(logs);
    var hostNames = logAnalyzer.sortByPkgSizeWithGroupHostName(logs);
    var cnipVali = cnipTool.decodeFileAndReturnValidation("../resources/cnip.txt");
    for (var i = 0; i < hostNames.length; i++) {
        var hostName = hostNames[i];
        utils.each(hostName.urlIP, function (ip, count) {
            hostName.domain = hostName.hostname;
            hostName.proxy = true;
            // 只要有在国内的节点 就认为可以从国内直接连接 :)
            if (cnipVali.isCNIP(ip)) {
                hostName.proxy = false;
                return false;
            }
        });
    }
    pacUtils.create(hostNames)
};

// Do it :)
logT();