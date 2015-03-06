//${LOG}
var hostStore = {};
{@each DOMAINS as domain}
hostStore['${domain.DOMAIN}'] = '${domain.PROXY}';
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
    if (sh == null || sh.length == 1)
        return '${DIRECT}';
    if (sh[sh.length - 1] === 'cn')
        return '${DIRECT}';
    var index = sh.length - 1;
    while (index != 0) {
        var proxy = hostStore[concatArr(sh.slice(index - 1))];
        if (proxy)
            return proxy;
        index--;
    }
    return '${PROXY}';
};