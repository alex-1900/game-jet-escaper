(function() {
    "use strict"

    function goodClient(id, frame, type, x, y, speedX, speedY, callback) {
        AbstructClient.call(this, id, frame);
        var images = app.get('images');
        this.image = images['good_' + type];
        this.speedX = speedX;
        this.speedY = speedY;
        this.callback = callback;

        this.state = {
            x: x,
            y: y,
            prevX: x,
            prevY: y,
        };
    }

    extend(goodClient, AbstructClient);

    goodClient.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, 20)) {
            this.setStates({
                x: this.state.x + this.speedX,
                y: this.state.y + this.speedY,
                prevX: this.state.x,
                prevY: this.state.y
            });
        }
    };

    goodClient.prototype.render = function() {
        this.frame.clearImage(this.state.prevX, this.state.prevY, this.image);
        this.frame.drawImage(this.image, this.state.x, this.state.y);
    };

    goodClient.prototype.getInfo = function() {
        return [
            this.state.x,
            this.state.y,
            this.image.width,
            this.image.height
        ];
    };

    goodClient.prototype.terminate = function() {
        var w = this.image.width + 10;
        var h = this.image.height + 10;
        this.frame.clear(this.state.prevX - 5, this.state.prevY - 5, w, h);
        this.frame.clear(this.x - 5, this.state.y - 5, w, h);
        app.detachClient(this.id);
    };

    goodClient.prototype.trigger = function() {
        var callback = this.callback;
        callback();
    };

    window.GoodClient = goodClient;

})();