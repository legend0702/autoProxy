/**
 * Created by HongQing.Zhu on 2015/2/10.
 */
var config = require("../config"),
    utils = require("./utils"),
    fsUtils = require("./fsUtils"),
    strUtils = require("./strUtils"),
    domainUtils = require("./domainUtils"),
    juicer = require('juicer'),
    pacUtils = pacUtils || {};

juicer.set('strip', false);
module.exports = pacUtils;

//Proxy.pac creater
utils.extend(pacUtils, {
    /**
     * Create proxy.pac :)
     *
     * @param domains
     * @param tarPath
     * @param pacTemp
     */
    create: function (domains, tarPath, pacTemp) {
        var pacData = {
            DIRECT: 'DIRECT',
            proxy: config.proxy,
            log: "Proxy.pac file generated by autoProxy " + new Date().toTimeString(),
            domains: domains || []
        };
        fsUtils.writeAndBackupOldSync(pacTemp || config.pacPath, juicer(fsUtils.readTextSync((pacTemp || config.pacTemp)), pacData));
    },
    /**
     * Simple-Data to create for TOP-1W
     * Example:
     * "1,google.com
     *  2,bing.com
     *  3,youtube.com
     * "
     *
     * @param srcPath
     * @param tarPath
     * @param pacTemp
     */
    createByTOP1W: function (srcPath, tarPath, pacTemp) {
        var domains = [];
        fsUtils.readLine(srcPath, function (e, l, f) {
            if (l) {
                //Hack :)
                domains.push(l.split(strUtils.COMMA)[1]);
                return;
            }
            if (f)
                pacUtils.create(domainUtils.firstCharAnalyze(domains), tarPath, pacTemp);
        });
    }
});