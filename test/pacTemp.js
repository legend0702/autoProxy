//${log}

function getFirstChar(host) {
    if (host.length < 4) {
        return host[0];
    }
    var preI = host.indexOf('.');
    var lastI = host.lastIndexOf('.');
    if (preI = lastI) {
        return host[0];
    }
    return host.substr(preI + 1, 1);
}

function getDomain(host) {

}

var HashMap = function (capacity) {
    var hash_table_length = capacity || 8;
    var hash_table = new Array(hash_table_length);
    var total_size = 0;
    this.put = function (key, value) {
        if (key != null) {
            var hash = hashCode(key);
            var index = indexFor(hash, hash_table.length);
            for (var obj = hash_table[index]; obj != null; obj = obj.next) {
                if (obj.hash == hash && obj.key == key) {
                    obj.value = value;
                    return obj.value;
                }
            }
            addEntry(hash, key, value, index);
        }
        return false;
    };

    this.get = function (key) {
        if (key != null) {
            var hash = hashCode(key); /
                var index = indexFor(hash, hash_table.length);
            for (var obj = hash_table[index]; obj != null; obj = obj.next) {
                if (obj.hash == hash && obj.key == key) {
                    return obj.value;
                }
            }
        }
        return null;
    };

    this.containsKey = function (key) {
        if (key != null) {
            var hash = hashCode(key);
            var index = indexFor(hash, hash_table.length);
            for (var obj = hash_table[index]; obj != null; obj = obj.next) {
                if (obj.hash == hash && obj.key == key) {
                    return true;
                }
            }
        }
        return false;
    };

    var addEntry = function (hash, key, value, index) {
        var entry = hash_table[index];
        var item = {
            "hash": hash,
            "key": key,
            "value": value,
            "next": entry
        };
        hash_table[index] = item;
        total_size++;
        if (total_size > hash_table)
            rehash();
    };

    var indexFor = function (hash, length) {
        return hash & (length - 1);
    };

    var hashCode = function (key) {
        var h = 0, off = 0;
        var length = key.length;
        for (var i = 0; i < length; i++) {
            var temp = key.charCodeAt(off++);
            h = 31 * h + temp;
            if (h > 0x7fffffff || h < 0x80000000) {
                h = h & 0xffffffff;
            }
        }
        h ^= (h >>> 20) ^ (h >>> 12);
        return h ^ (h >>> 7) ^ (h >>> 4);
    };

    var rehash = function () {
        var oldHashTable = hash_table;
        // Double!!!
        hash_table = new Array(oldHashTable.length + hash_table_length);
        for (var i = 0, c = oldHashTable.length; i < c; i++) {
            var e = oldHashTable[i];
            while (e) {
                this.put(e.key, e.value);
                e = e.next;
            }
        }
    };
};

function FindProxyForURL(url, host) {
    if (host == '127.0.0.1' || isPlainHostName(host)) {
        return '${DIRECT}';
    }
    //Hard block domain
    if (dnsDomainIs(host, 'google.com') ||
        dnsDomainIs(host, 'google.com.hk') ||
        dnsDomainIs(host, 'google-analytics.com') ||
        dnsDomainIs(host, 'googleapis.com') ||
        dnsDomainIs(host, 'googlecode.com') ||
        dnsDomainIs(host, 'googlevideo.com') ||
        dnsDomainIs(host, 'googleusercontent.com') ||
        dnsDomainIs(host, 'ggpht.com') ||
        dnsDomainIs(host, 'youtube.com') ||
        dnsDomainIs(host, 'wikipedia.org') ||
        dnsDomainIs(host, 'sf.net') ||
        dnsDomainIs(host, 'github.com') ||
        dnsDomainIs(host, 'sourceforge.net') ||
        dnsDomainIs(host, 'wp.me') ||
        dnsDomainIs(host, 'ow.ly') ||
        dnsDomainIs(host, 'po.st') ||
        dnsDomainIs(host, 'goo.gl')
        ) {
        return  '${proxy}';
    }
    var fc = getFirstChar(host);
    {
        @each
        domains
        as
        ds
    }
    if (fc == '${ds.k}') {
        {
            @each
            ds.domains
            as
            d
        }
        if (dnsDomainIs(host, '${d}'))  return '${DIRECT}';
        {
            @/each
        }
    }
    {
        @/each
    }
};
