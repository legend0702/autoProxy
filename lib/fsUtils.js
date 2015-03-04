"use strict";

var fs = require("fs"),
    nodePath = require("path"),
    utils = require("./utils"),
    strUtils = require("./strUtils"),
    fsUtils = fsUtils || {};

module.exports = fsUtils;

utils.extend(fsUtils, {
    DEF_ENCODE: strUtils.UTF_8,
    isDirSync: function (path) {
        return fs.statSync(path).isDirectory();
    },
    /**
     * Augment @link {fs.readdirSync}
     * Return fileResolvePaths which under the rootPath.
     * If no file under the rootPath,return a empty array.
     * If sub file is a dir,it will ignore it,only return filePath :)
     *
     * @param rootPath
     * @returns {Array} fileResolvePaths
     */
    readDirSync: function (rootPath) {
        var paths = [];
        var path = nodePath.resolve(rootPath);
        if (!fsUtils.isDirSync(path)) {
            return paths;
        }
        var fsPaths = fs.readdirSync(path);
        for (var i = 0; i < fsPaths.length; i++) {
            paths.push(nodePath.resolve(path, fsPaths[i]));
        }
        return paths;
    },
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
     *
     * @param filePath
     * @param callback (e,data,isEnd)
     * @param options
     *
     * @see fs.createReadStream
     */
    data: function (filePath, callback, options) {
        var ops = utils.extend({"encoding": fsUtils.DEF_ENCODE}, options);
        try {
            var rs = fs.createReadStream(filePath, ops);
            rs.on("data", function (data) {
                //Process call
                callback(null, data, false);
            });
            rs.on("end", function () {
                //Final call
                callback(null, null, true);
            });
        } catch (err) {
            callback(err);
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
        var ops = utils.extend({"encoding": fsUtils.DEF_ENCODE}, options);
        var bufs = [];
        var _readText = function (e, buf, f) {
            if (buf) {
                bufs.push(buf);
                return;
            }
            //Final call
            if (f) {
                callback(null, fsUtils.bufferToString(Buffer.concat(bufs), ops["encoding"]));
                return;
            }
            if (e)
                callback(e);
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
        var ops = utils.extend({"encoding": fsUtils.DEF_ENCODE}, options);
        //Pre str
        var pre = strUtils.EMPTY;
        var _readLine = function (e, data, f) {
            if (data) {
                var strData = data.toString(ops["encoding"]);
                if (strUtils.isNotEmpty(strData)) {
                    //Store to next header
                    pre = strUtils.splitLine(pre.concat(strData), callback);
                    return;
                }
            }
            if (e) {
                callback(e);
                return;
            }
            //Last line without "LF"
            if (pre != strUtils.EMPTY) {
                callback(null, pre, f);
            } else {
                callback(null, null, f);
            }
        };
        fsUtils.data(filePath, _readLine, ops);
    },
    //Read a file by options default encoding is "utf-8"
    readTextSync: function (filePath, encoding) {
        return fsUtils.bufferToString(fs.readFileSync(filePath), encoding ? encoding : fsUtils.DEF_ENCODE);
    },
    //Read a file and split whit "\n" without error
    readLineSync: function (filePath, callback, ops) {
        var text = fsUtils.readTextSync(filePath, ops);
        var lines = text.split(strUtils.NEWLINE);
        utils.each(lines, function (index, line) {
            if (!line)
                return;
            callback(index, line);
        });
    },
    //Read a fileText to Json
    readJson: function (filePath, callback, options) {
        fsUtils.readText(filePath, function (err, data) {
            if (err) callback(err);
            callback(null, JSON.parse(data));
        }, options)
    },
    //Read a fileText to Json sync
    readJsonSync: function (filePath, options) {
        return JSON.parse(fsUtils.readTextSync(filePath, options));
    }
});