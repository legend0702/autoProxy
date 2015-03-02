/*
 * A white-list based PAC without regexp, by @janlay
 * It's just simple and fast.
 * Last update: Dec 9, 2013
 * Special thanks to @Paveo
 */
function FindProxyForURL(url, host) {
    // REPLACE PROXY WITH YOUR OWN'S
    var PROXY = "PROXY 127.0.0.1:8800;SOCKS 127.0.0.1:8801";
    var DEFAULT = "DIRECT";
 
    var parts = host.split('.'),
        // always use proxy, even if inHosts or domains are matched
        overrideDomains = ['google.com', 'googleapis.com', 'nytimes.com', 'fbcdn.net', 'ytimg.com', 'tmagazine.com', 'twitter.com', 'twimg.com', 'cdn.sstatic.net', 'cloudflare.com', 'amazonaws.com', 'facebook.com', 'cdninstagram.com', 'wsj.com', 'reuters.com'],
        // domain/host starts with
        prefixes = ['cn', 'china'],
        // indexOf searching
        inHosts = ['51', '58', '86', '91', '100', '123', '163', '168', '360', 'cn', 'bj', 'zj', 'ali', 'taobao', 'pp', 'qq', 'tencent', 'cdn', 'static', 'china', 'local'],
        // domains end with
        domains = ['im', 'img.com', '115.com', '126.com', '126.net', '39.net', 'baidu.com', 'baixing.com', 'go2map.com', 'blogbus.com', 'blueidea.com', 'caing.com', 'ccb.com', 'comsenz.com', 'csdn.net', 'ctrip.com', 'dangdang.com', 'daqi.com', 'diandian.com', 'dianping.com', 'discuz.net', 'donews.com', 'douban.com', 'dream4ever.org', 'eastmoney.com', 'elong.com', 'et8.org', 'et8.net', 'fengniao.com', 'futu5.com', 'ganji.com', 'gfan.com', 'gfw.io', 'goodbabygroup.com', 'gougou.com', 'hi-pda.com', 'hiapk.com', 'huaban.com', 'huanqiu.com', 'hudong.com', 'iciba.com', 'img-space.com', 'infzm.com', 'ip138.com', 'jandan.net', 'jd.com', 'jiepang.com', 'kaixin001.com', 'ku6.com', 'lampdrive.com', 'lashou.com', 'live.net', 'etao.com', 'mapabc.com', 'mapbar.com', 'meituan.com', 'mi.com', 'miwifi.com', 'microsoft.com', 'onenote.com', 'mozilla.org', 'mop.com', 'mtime.com', 'mydrivers.com', 'nbweekly.com', 'netease.com', 'nuomi.com', 'onlinedown.net', 'paipai.com', 'pchome.net', 'pcpop.com', 'pengyou.com', 'qiyi.com', 'qunar.com', 'renren.com', 'sanguosha.com', 'sdo.com', 'sf-express.com', 'iask.com', 'sogou.com', 'sohu.com', 'soso.com', 'soufun.com', 'tenpay.com', 'tgbus.com', 'tmall.com', 'tudou.com', 'tudouui.com', 'uusee.com', 'verycd.com', 'weibo.com', 'weiphone.com', 'xiami.com', 'xiami.net', 'xici.net', 'xilu.com', 'xinhuanet.com', 'xinnet.com', 'xitek.com', 'xunlei.com', 'yesky.com', 'yihaodian.com', 'ynet.com', 'youdao.com', 'youku.com', 'yupoo.com', 'zaobao.com', 'zhaopin.com', 'zhihu.com', 'my.cl.ly', 'synacast.com', 'xiachufang.com', 'wandoujia.com', 'chdbits.org', 'hdwing.com', 'zhihu.com', 'zhi.hu', 'join.me', 'imgur.com', 'images-amazon.com', 'smzdm.com', 'ycombinator.com', 'gravatar.com', 'v2ex.com', 'verisign.com', 'laiwang.com', 'hiwifi.com'];
 
    // ignore local host name. eg: http://localhost
    if (isPlainHostName(host)) return DEFAULT;
 
    // force proxy by url. eg: http://foo.com/?bar=1&fuckgfw
    if (url.indexOf('fuckgfw') > 0) return PROXY;
 
    // test plain IP
    var lastChar = host.substring(host.length - 1);
    if (lastChar >= '0' && lastChar <= '9') return DEFAULT;
 
    var i, len;
    // force proxy by domain. eg: http://cn.nytimes.com
    for (i = 0, len = overrideDomains.length; i < len; i++)
        if (dnsDomainIs(host, overrideDomains[i])) return PROXY;
 
        // domain/ip prefix. eg: http://60.1.2.3
    for (i = 0, len = prefixes.length, part = parts[0] + '.'; i < len; i++)
        if (prefixes[i] + '.' === part) return DEFAULT;
 
        // match main domain. eg: http://www.verycd.com, http://ip138.com/
    for (i = 0, len = domains.length; i < len; i++)
        if (dnsDomainIs(host, domains[i])) return DEFAULT;
 
        // search pattern in domains. eg: https://www.51job.com, https://www.alipay.com
    for (i = 0, len = inHosts.length; i < len; i++)
        if (host.indexOf(inHosts[i]) >= 0) return DEFAULT;
 
        // for all other host, default to proxy.
    return PROXY;
}