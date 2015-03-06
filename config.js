// A config-json file can't describe,so config-js :)

module.exports = {
    // domainUtils:A txt store https://publicsuffix.org/list/effective_tld_names.dat
    domainSuffixPath: "../resources/domainSuffix.txt",
    // cnipTool:Chinese ip part.From http://chnroutes-dl.appspot.com/ (up part )
    chinaIPPath: "../resources/cnip.txt",
    // pacUtils
    /**
     * Proxy server
     * Example:PROXY 127.0.0.1:10080
     */
    proxy: "PROXY h.lv5.ac:29274",
    // The file where are logs inside and should be analyze.
    rootDir: "../resources/logs",
    // Use juicer!
    pacTemp: "../resources/pacTemp/hashTemp.js",
    // If a old pac existed,It will backup the old one and put the new one.
    pacPath: "../test/autoProxyW.pac"
};
