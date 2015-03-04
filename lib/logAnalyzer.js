/**
 * Created by HongQing.Zhu on 2015/3/3.
 */
/**
 * Log analyzer.
 *
 * 第一版先用同步的方式实现(一次性载入数据后再计算)
 * 第二版考虑异步流的方式实现(边载入边计算)
 */
(function (module) {
    // util
    var utils = require("./utils");
    var strUtils = require("./strUtils");
    var fsUtils = require("./fsUtils");
    var url = require("url");

    var _logTool = {};
    //Log schema
    var logSchema = function () {
        return {
            // 1422170012.007
            time: "",
            // 60889
            remotePort: null,
            // 221.219.115.49
            remoteIP: "",
            // TCP_MISS/200
            status: "",
            // 606 流量
            pkgSize: 0,
            // CONNECT
            type: "",
            // mtalk.google.com:5228 ==> node'url object
            url: null,
            // HIER_DIRECT/74.125.20.188 -->  74.125.20.188
            urlIP: "",
            // HIER_DIRECT/74.125.20.188 -->  HIER_DIRECT
            /**
             * If HIER_NONE,ignore urlIP :)
             */
            squidType: "",
            // application/json
            mime: "",
            /**
             * Store origin line like:
             * 1422783403.348    263 123.66.231.38 TCP_MISS/503 378 HEAD http://aqlhdhvgpnzrxve/ 58889 HIER_NONE/- text/html
             */
            origin: ""
        }
    };

    utils.extend(_logTool, {
        /**
         * line : 1422783403.348    263 123.66.231.38 TCP_MISS/503 378 HEAD http://aqlhdhvgpnzrxve/ 58889 HIER_NONE/- text/html
         *        1423380373.178 1084264 61.173.11.39 TCP_MISS/200 286882 CONNECT 0.client-channel.google.com:443 58888 HIER_DIRECT/74.125.25.189 -
         *
         * @returns logSchema
         */
        decodeLine: function (line) {
            var log = logSchema();
            if (!utils.isUseful(line))
                return log;
            //hack :)
            log.time = line.substr(0, 14);
            var subLine = utils.trim(line.substring(15));
            var larr = subLine.split(strUtils.SPACE);
            log.remoteIP = larr[1];
            log.status = larr[2];
            log.pkgSize = Number(larr[3] || 0);
            log.type = larr[4];
            var u = larr[5] || '';
            if (u) {
                // hack tcp://
                if (log.type === "CONNECT") {
                    u = "tcp://" + u;
                }
                log.url = url.parse(u);
            }
            var target = larr[7].split(strUtils.SLASH);
            log.urlIP = target[1];
            log.squidType = target[0];
            log.mime = larr[8];
            log.origin = line;
            return log;
        },
        /**
         * Decode a file
         * @see decodeLine
         * @param path
         * @returns {Array} [schema1,schema1,schema2,schema3]
         */
        decodeFileSync: function (path) {
            var schemas = [];
            var cb = function (i, l) {
                schemas.push(_logTool.decodeLine(l));
            };
            fsUtils.readLineSync(path, cb);
            return schemas;
        },
        /**
         * Decode a dir which all logs under it
         *
         * @see decodeFileSync
         * @param rootPath
         * @returns {Array}
         */
        decodeFilesSync: function (rootPath) {
            var schemas = [];
            var filePaths = fsUtils.readDirSync(rootPath);
            for (var i = 0; i < filePaths.length; i++) {
                var filePath = filePaths[i];
                // Add arr
                schemas = schemas.concat(_logTool.decodeFileSync(filePath));
            }
            return schemas;
        },
        /**
         * SUM(pkgSize)
         * Group by hostName
         * ORDER BY pkgSize Desc
         *    XD
         * @param schemas
         * @returns {Array}
         *      [{hostname: hostname1,
         *        urlIP: {ip1:number,ip2:number},
         *        pkgSize: number},
         *       {hostname: hostname2,
         *        urlIP: {ip1:number,ip2:number},
         *        pkgSize: number}]
         */
        sortByPkgSizeWithGroupHostName: function (schemas) {
            var sortHostNames = [];
            var groupByHostName = {};
            // SUM(pkgSize) GROUP BY hostname
            for (var i = 0; i < schemas.length; i++) {
                var schema = schemas[i];
                var hostname = schema.url.hostname;
                var entry = groupByHostName[hostname];
                if (!entry) {
                    // Copy schema
                    var entry = {
                        hostname: hostname,
                        // {ip:count,ip:count}
                        urlIP: {},
                        pkgSize: 0
                    }
                    groupByHostName[hostname] = entry;
                    sortHostNames.push(entry);
                }
                entry.pkgSize += schema.pkgSize;
                var count = entry.urlIP[schema.urlIP];
                if (!count)
                    count = 0
                entry.urlIP[schema.urlIP] = ++count;
            }
            // ORDER BY pkgSize desc
            sortHostNames.sort(function (pre, next) {
                return (pre.pkgSize > next.pkgSize) ? -1 : 1;
            });
            return sortHostNames;
        }
    });

    if (module)
        module.exports = _logTool;
})(module);