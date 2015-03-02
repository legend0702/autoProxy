/**
 * 模仿Java中的HashMap :)
 *
 */
(function (m) {
    var HashMap = function (capacity) {
        var hash_table_length = capacity || 8; // init capacity
        var hash_table = new Array(hash_table_length); // hashTable/linkedList
        var total_size = 0; // Total size.
        var me = this;

        /**
         * Add a key&value
         *
         * @param key
         * @param value
         */
        this.put = function (key, value) {
            if (key != null) {
                var hash = hashCode(key);
                var index = indexFor(hash, hash_table.length);
                //If exist,cover old.
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

        /**
         * Get a value by key.If the key is not exist,it will return null instead.
         * @param key
         * @return value
         */
        this.get = function (key) {
            if (key != null) {
                var hash = hashCode(key);
                var index = indexFor(hash, hash_table.length);
                for (var obj = hash_table[index]; obj != null; obj = obj.next) {
                    if (obj.hash == hash && obj.key == key) {
                        return obj.value;
                    }
                }
            }
            return null;
        };


        /**
         * Remove a key&value by key.
         *
         * @param key
         * @return {boolean}
         */
        this.remove = function (key) {
            if (key != null) {
                var hash = hashCode(key);
                var index = indexFor(hash, hash_table.length);
                var entry = hash_table[index];
                var e = entry;
                while (e != null) { //Remove the need one,and put the one' next instead
                    var next = e.next;
                    if (e.hash == hash && e.key == key) {
                        if (entry == e) {
                            hash_table[index] = next;
                        } else {
                            entry.next = next;
                        }
                        total_size--;
                        return true;
                    }
                    entry = e;
                    e = next;
                }
            }
            return false;
        };

        /**
         * Clear hashMap.
         */
        this.clear = function () {
            hash_table = null;
            hash_table = new Array(hash_table_length);
            total_size = 0;
        };

        /**
         * Returns true if this map contains a mapping for the specified key.
         *
         * @param key The key whose presence in this map is to be tested
         * @return true if this map contains a mapping for the specified  key.
         */
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

        /**
         * Returns the number of key-value mappings in this map.
         *
         * @return the number of key-value mappings in this map
         */
        this.size = function () {
            return total_size;
        };

        this.getEntry = function () {
            return hash_table;
        };

        /**
         * A linkedList to resolve hash-conflict.
         *
         * @param hash key'hashcode
         * @param key
         * @param value
         * @param index indexFor hash
         */
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
            if (total_size > hash_table.length)
                rehash();
        };

        /*
         *  Look for position by hash.
         */
        var indexFor = function (hash, length) {
            return hash & (length - 1);
        };

        /*
         *  Create hashCode.
         */
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

        /**
         * Rehash all key&value when the total_size more than the linkedList' capacity.
         */
        var rehash = function () {
            var oldHashTable = hash_table;
            // Clear the size,because the method put will add it
            total_size = 0;
            // Double!!!
            hash_table = new Array(oldHashTable.length + hash_table_length);
            for (var i = 0, c = oldHashTable.length; i < c; i++) {
                var e = oldHashTable[i];
                while (e) {
                    me.put(e.key, e.value);
                    e = e.next;
                }
            }
        };
    };

    if (GLOBAL) {
        GLOBAL.HashMap = HashMap;
    }
    if (module) {
        module.exports = HashMap;
    }
})(module);