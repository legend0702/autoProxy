"use strict";

(function (module) {
    var ipUtils = {
        // 判断一个ip是否属于这个(网关/掩码) 
        checkIpWithGWAndMask: function (ip, gateway, mask) {
            var static_ip_arr = ip.split(".");
            var static_gw_arr = gateway.split(".");
            var static_mask_arr = mask.split(".");

            var res0 = parseInt(static_ip_arr[0]) & parseInt(static_mask_arr[0]);
            var res1 = parseInt(static_ip_arr[1]) & parseInt(static_mask_arr[1]);
            var res2 = parseInt(static_ip_arr[2]) & parseInt(static_mask_arr[2]);
            var res3 = parseInt(static_ip_arr[3]) & parseInt(static_mask_arr[3]);
            var res0_gw = parseInt(static_gw_arr[0]) & parseInt(static_mask_arr[0]);
            var res1_gw = parseInt(static_gw_arr[1]) & parseInt(static_mask_arr[1]);
            var res2_gw = parseInt(static_gw_arr[2]) & parseInt(static_mask_arr[2]);
            var res3_gw = parseInt(static_gw_arr[3]) & parseInt(static_mask_arr[3]);
            if (res0 == res0_gw && res1 == res1_gw && res2 == res2_gw && res3 == res3_gw) {
                return true;
            }
            return false;
        }
    };

    if (module)
        module.exports = ipUtils;
})(module);