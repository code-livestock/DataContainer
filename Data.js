const events = require('events');
const util = require("util");
const rUtils = require("./Utils");



class Data extends events.EventEmitter {
    constructor(__id) {
        super();
        this.__id = __id || rUtils.getGUID(11, 20);
    };
    setValue(pro, v) {
        var oldV = this[pro];
        if (v != oldV) {
            this[pro] = v;
            this.emit("propertyChanged", this, pro, oldV, v);
        }
    };
    getID() {
        return this.__id;
    };
    getValue(pro) {
        return this[pro];
    }
}
module.exports = Data;