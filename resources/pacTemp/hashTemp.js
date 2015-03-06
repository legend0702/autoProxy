//${LOG}

function getSplitHost(host) {
    var lastI = host.lastIndexOf('.');
    if (lastI == -1)
        return null;
    return host.split('.');
};

var decode = function (str) {
    var h = 0, off = 0;
    var length = str.length;
    for (var i = 0; i < length; i++) {
        var temp = str.charCodeAt(off++);
        h = 31 * h + temp;
        if (h > 0x7fffffff || h < 0x80000000) {
            h = h & 0xffffffff;
        }
    }
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
};

var indexFor = function (key) {
    return decode(key) & ${HASH_TOTAL};
};

var concatArr = function (arr) {
    var str = '';
    for (var i = 0, e = arr.length; i < e; i++)
        str += arr[i] + ".";
    return str.substring(0, str.length - 1);
};

function FindProxyForURL(url, host) {
    if (host == '127.0.0.1' || host == 'localhost' || isPlainHostName(host)) {
        return '${DIRECT}';
    }
    var sh = getSplitHost(host);
    if(sh == null || sh.length < 2)
        return '${DIRECT}';
    var index = sh.length - 1;
    while (index != 0) {
        var hostName = concatArr(sh.slice(index - 1));
        var iFor = indexFor(hostName);
        switch (iFor) {
            {@each DOMAIN_HASH_TABLE as entry,ind}
                case ${ind}:
                {@each entry as item}
                    if('${item.DOMAIN}' === hostName ) return '${item.PROXY}';
                {@/each}
                break;
            {@/each}
        }
        index--;
    }
    return '${PROXY}';
};
