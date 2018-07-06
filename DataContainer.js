/**
 * 数据容器.
 * 用来管理RTData
 * @type {Object}
 */
var events = require('events');
var util = require("util");
class DataContainer extends events.EventEmitter {
    constructor() {
        super();
        this.__index = {};
        this.__dataArray = {};
    };
    getAllData() {
        var r = [], cs = this.__dataArray;
        for (var key in cs) {
            r.push(cs[key]);
        }
        return r;
    };
    addIntoIndex(data, index, pro) {
        var value = data[pro];
        var cached = index[value];
        if (!cached) {
            cached = {};
            index[value] = cached;
        }
        cached[data.__id] = data;
    };
    removeDataFromIndex(data, index, pro) {
        var value = data[pro];
        delete index[value];
    };
    addData(data) {
        var cs = this.__dataArray;
        if (data && data.getID) {
            var id = data.getID();
            if (data != cs[id]) {
                cs[id] = data;
                var indexCache = this.__index;
                for (var pro in indexCache) {
                    var index = indexCache[pro];
                    this.addIntoIndex(data, index, pro);
                }
                var scope = this;
                data.on("propertyChanged", function () {
                    scope.onDataPropertyChanged.apply(scope, arguments);
                });
                this.emit("dataAdded", data);
                return true;
            } else {
                //抛出异常

            }
        }
        return false;

    };
    /**
     * 移除数据
     * @param data
     * @returns {boolean}
     */
    removeData(data) {
        var cs = this.__dataArray;
        if (data && data.getID) {
            var id = data.getID();
            if (data == cs[id]) {
                delete cs[id];
                data.removeAllListeners();
                //在所有的索引中把该数据清除
                var indexCache = this.__index;
                for (var pro in indexCache) {
                    var index = indexCache[pro];
                    this.removeDataFromIndex(data, index, pro);
                }
                this.emit("dataRemoved", data);
                return true;
            }
        }
        return false;
    };
    removeDataByID(id) {
        var cs = this.__dataArray;
        if (id) {
            var data = cs[id];
            if (data) {
                this.removeData(data);
                data.removeListener("propertyChanged", this.onDataPropertyChanged);
                return true;
            }
        }
        return false;
    };
    onDataPropertyChanged(source, pro, oldValue, nValue) {
        //更新索引序列;
        var index = this.__index[pro];
        if (index) {
            delete index[oldValue];
        } else {
            index = {};
            this.__index[pro] = index;
        }

        index[nValue] = source;
        //转发属性事件
        this.emit("dataPropertyChanged", source, pro, oldValue, nValue);
    };
    getUniqueDataBy(pro, value) {
        var cached = this.getDataBy(pro, value);
        if (cached && cached.length > 0) {
            return cached[0];
        }
        return null;
    };
    getDataByID(id) {
        return this.__dataArray[id];
    };
    getDataBy(pro, value) {
        var index = this.__index[pro], cs = this.__dataArray;
        if (!index) {
            index = {};
            this.__index[pro] = index;
            for (var key in cs) {
                var data = cs[key];
                this.addIntoIndex(data, index, pro);
            }
        }
        var cached = index[value], result = [];
        for (var id in cached) {
            result.push(cached[id]);
        }
        return result;

    };
    buildIndex(pro) {
        var index = this.__index[pro];
        if (!index) {
            index = {};
            this.__index[pro] = index;
        }
    }

}
module.exports = DataContainer;