(function(window, document) {
    "use strict"

    /**
     * client 对象原型
     * @param {Layer} frame client 所在的 Layer 对象
     */
    function client(id, frame) {
        this.frame = frame;
        this.id = id;
        this._state = {
            synchronized: true,
            timestamp: 0
        };
    }

    /**
     * @abstract
     * client 需要实现 update 方法，以帧为单位更新状态
     */
    client.prototype.update = function(timestamp) {
        // pass
    };

    /**
     * @abstract
     */
    client.prototype.render = function() {
        // pass
    };

    client.prototype.setStates = function(states) {
        for (var key in states) {
            this.setState(key, states[key]);
        }
    };

    client.prototype.setState = function(key, value) {
        if (this.state[key] != value) {
            this.state[key] = value;
            this._state.synchronized = true;
            return true;
        }
        return false;
    };

    client.prototype.isOvertime = function(timestamp, msecond) {
        if (timestamp - this._state.timestamp >= msecond) {
            this._state.timestamp = timestamp;
            return true;
        }
        return false;
    };

    /**
     * @abstract
     * 析构方法
     */
    client.prototype.terminate = function() {
        app.detachClient(this.id);
    };

    client.prototype.isSynchronized = function() {
        return this._state.synchronized;
    };

    client.prototype.sync = function() {
        this._state.synchronized = false;
    };

    window.AbstructClient = client;
})(window, document);
