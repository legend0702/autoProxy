"use strict";

var module, fs, utils, strUtils,
    fsUtils = fsUtils || {};

if (module) {
    fs = require('fs');
    utils = require('./utils');
    strUtils = require('./strUtils');
    module.exports = fsUtils;
}

utils.extend(fsUtils, {
    DEF_ENCODE: strUtils.UTF_8,
    //Copy a file from stc to dst
    copy: function (src, dst) {
        fs.createReadStream(src).pipe(fs.createWriteStream(dst));
    },
    //Copy a file from stc to dst sync
    copySync: function (src, dst) {
        fs.writeFileSync(dst, fs.readFileSync(src));
    },
    //If a old file existed,It will backup the old one and write the new one.
    writeAndBackupOldSync: function (src, data, suffix) {
        if (fs.existsSync(src))
            fsUtils.copySync(src, src.concat(suffix || new Date().getTime()));
        fs.writeFileSync(src, data);
    },
    //To delete encoding-header
    bufferToString: function (buffer, encoding) {
        //		if(buffer&&buffer.length>3){
        //			if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        //			    buffer = buffer.slice(3);
        //			}
        //		}
        return buffer.toString(encoding || fsUtils.DEF_ENCODE);
    },
    /**
     * A async file-stream-reader
     * @param filePath
     * @param callback (e,data,isEnd)
     * @param options
     *
     * @see fs.createReadStream
     */
    data: function (filePath, callback, options) {
        var cb = callback || utils.emptyFunction;
        var ops = {
            'encoding': fsUtils.DEF_ENCODE
        };
        ops = utils.def(options, ops);
        try {
            var rs = fs.createReadStream(filePath, ops);
            rs.on('data', function (data) {
                //Process call
                cb(null, data, false);
            });
            rs.on('end', function () {
                //Final call
                cb(null, null, true);
            });
        } catch (err) {
            cb(err);
        }
    },
    /**
     * Read a file async by options
     *
     * @param filePath
     * @param callback
     * @param options
     *
     * @see fsUtils.data
     */
    readText: function (filePath, callback, options) {
        var cb = callback || utils.emptyFunction;
        var ops = utils.def(options, {
            'encoding': fsUtils.DEF_ENCODE
        });
        var bufs = [];
        var _readText = function (e, buf, f) {
            if (buf) {
                bufs.push(buf);
                return;
            }
            //Final call
            if (f) {
                cb(null, fsUtils.bufferToString(Buffer.concat(bufs), ops['encoding']));
                return;
            }
            if (e)
                cb(e);
        };
        fsUtils.data(filePath, _readText, ops);
    },
    /**
     * Read a line and callback once
     *
     * @param filePath
     * @param callback (e,data,isEnd)
     * @param options
     *
     * @see fsUtils.data
     */
    readLine: function (filePath, callback, options) {
        var cb = callback || utils.emptyFunction;
        var encode = options ? options['encoding'] : fsUtils.DEF_ENCODE;
        //Pre str
        var pre = strUtils.EMPTY;
        var _readLine = function (e, data, f) {
            if (data) {
                var strData = data.toString(encode);
                if (strUtils.isNotEmpty(strData)) {
                    //Store to next header
                    pre = strUtils.splitLine(pre.concat(strData), cb);
                    return;
                }
            }
            if (e) {
                cb(e);
                return;
            }
            //Last line without 'LF'
            if (pre != strUtils.EMPTY) {
                cb(null, pre, f);
            } else {
                cb(null, null, f);
            }
        };
        fsUtils.data(filePath, _readLine, options);
    },
    //Read a file by options default:{encoding:'utf-8'}
    readTextSync: function (filePath, options) {
        return fsUtils.bufferToString(fs.readFileSync(filePath), options ? options['encoding'] : fsUtils.DEF_ENCODE);
    },
    //Read a fileText to Json
    readJson: function (filePath, callback, options) {
        var cb = callback || utils.emptyFunction;
        fsUtils.readText(filePath, utils.def(options), function (err, data) {
            if (err) cb(err);
            cb(null, JSON.parse(data));
        })
    },
    //Read a fileText to Json sync
    readJsonSync: function (filePath, options) {
        return JSON.parse(fsUtils.readTextSync(filePath, options));
    }
});