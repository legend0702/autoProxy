//${LOG}

var hostStore = {};
@each entry as en,i}
    case ${i}:
    {@each en as e}
    if('${e.domain}' === hostName ) return '${e.proxy}';
    {@/each}
    break;
{@/each}

function getSplitHost(host) {
    var lastI = host.lastIndexOf('.');
    if (lastI == -1)
        return null;
    return host.split('.');
};

var concatArr = function (arr) {
    var str = '';
    for (var i = 0, e = arr.length; i < e; i++)
        str += arr[i] + ".";
    return str.substring(0, str.length - 1);
};

function FindProxyForURL(url, host) {
    if (host === '127.0.0.1' || host === 'localhost' || isPlainHostName(host)) {
        return '${DIRECT}';
    }
    var sh = getSplitHost(host);
    if (sh == null || sh.length < 2)
        return '${DIRECT}';

    var index = sh.length - 1;
    while (index != 0) {
        var hostName = concatArr(sh.slice(index - 1));
        var iFor = indexFor(hostName);
        index--;
    }

    return '${PROXY}';
}