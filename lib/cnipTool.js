/**
 * Created by HongQing.Zhu on 2015/3/3.
 */
"use strict";

//Load china'ip :)
(function (module) {
    var config = require("../config"),
        utils = require("./utils"),
        strUtils = require("./strUtils"),
        fsUtils = require("./fsUtils"),
        ipUtils = require("./ipUtils"),
        HashMap = require("./HashMap"),
        _cnipTool = {};

    // Store cnip [_schema,_schema]
    var cnipSchemas = [];

    // Schema
    var _schema = function () {
        return {
            gateway: null,
            mask: null
        }
    };

    utils.extend(_cnipTool, {
        decodeLine: function (line) {
            var schema = _schema();
            var ls = line.split(strUtils.SPACE);
            schema.gateway = ls[2];
            schema.mask = ls[4];
            return schema;
        },
        decodeFile: function (path) {
            var schemas = [];
            var cb = function (i, l) {
                schemas.push(_cnipTool.decodeLine(l));
            };
            fsUtils.readLineSync(path, cb);
            return schemas;
        },
        createValidation: function (schemas) {
            return _validation(schemas);
        },
        decodeFileAndReturnValidation: function (path) {
            return _cnipTool.createValidation(_cnipTool.decodeFile(path));
        }
    });

    /**
     * Use to validate ip with gateway And mask.
     *
     * @param schemas
     * @private
     */
    var _validation = function (schemas) {
        var gwAndMask = new HashMap(schemas.length);
        var _firstSnippetKey = function (ip) {
            return ip.split(strUtils.DOT)[0];
        };
        var _initHashMap = function (schemas) {
            for (var i = 0; i < schemas.length; i++) {
                var key = _firstSnippetKey(schemas[i].gateway);
                var value = gwAndMask.get(key);
                if (!value)
                    value = [];
                value.push(schemas[i])
                gwAndMask.put(key, value);
            }
        };
        // init :)
        _initHashMap(schemas);

        // CNIP Validation
        var _vali = {
            isCNIP: function (ip) {
                var arr = gwAndMask.get(_firstSnippetKey(ip));
                // If not exist,return false
                if (!arr)
                    return false;
                // Compare everyone
                for (var i = 0; i < arr.length; i++) {
                    var schema = arr[i];
                    if (ipUtils.checkIpWithGWAndMask(ip, schema.gateway, schema.mask))
                        return true;
                }
                // No one
                return false;
            }
        };
        return _vali;
    };

    if (module)
        module.exports = _cnipTool.decodeFileAndReturnValidation(config.chinaIPPath);
})(module);