// A config-json file can't describe,so config-js :)

module.exports = {
    /**
     * Proxy server
     * Example:PROXY 127.0.0.1:8086
     */
    proxy: "PROXY 127.0.0.1:10080",
    // The file where are logs inside and should be analyze.
    rootDir: "",
    // If a old pac existed,It will backup the old one and put the new one.
    pacPath: "..\\test\\proxy2.pac",
    // Use juicer!
    pacTemp: "..\\test\\pacTemp.js",
    //How long time to interval notify it(ms)
    intervalTime: 60000,
    //The app are waiting for next notify!
    isWaiting: true
};
