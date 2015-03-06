"use strict";

(function (module) {
    var net = null,
        ipUtils = {};
    if (module) {
        net = module.require("net");
        module.exports = ipUtils;
    }

    ipUtils.isIP = function (ip) {
        if (net)
            return net.isIP(ip);
        var obj = ip;
        var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        var reg = obj.match(exp);
        return reg ? true : false;
    };
    // 判断一个ip是否属于这个(网关/掩码)
    ipUtils.checkIpWithGWAndMask = function (ip, gateway, mask) {
        var static_ip_arr = ip.split(".");
        var static_gw_arr = gateway.split(".");
        var static_mask_arr = mask.split(".");
        //strUtils.indexOfAll(urlIP, strUtils.DOT).length == 4
        var res0 = parseInt(static_ip_arr[0]) & parseInt(static_mask_arr[0]);
        var res1 = parseInt(static_ip_arr[1]) & parseInt(static_mask_arr[1]);
        var res2 = parseInt(static_ip_arr[2]) & parseInt(static_mask_arr[2]);
        var res3 = parseInt(static_ip_arr[3]) & parseInt(static_mask_arr[3]);
        var res0_gw = parseInt(static_gw_arr[0]) & parseInt(static_mask_arr[0]);
        var res1_gw = parseInt(static_gw_arr[1]) & parseInt(static_mask_arr[1]);
        var res2_gw = parseInt(static_gw_arr[2]) & parseInt(static_mask_arr[2]);
        var res3_gw = parseInt(static_gw_arr[3]) & parseInt(static_mask_arr[3]);
        return (res0 == res0_gw && res1 == res1_gw && res2 == res2_gw && res3 == res3_gw)
    }
})(module);