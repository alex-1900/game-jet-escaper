(function() {
    "use strict"

    function backgroundClient(id, frame, images, mapNumber) {
        AbstructClient.call(this, id, frame);
        this.image = images['bg' + mapNumber];
        this.imageWidth = document.body.clientWidth;
        this.imageHeight = document.body.clientHeight;

        this.state = {
            cvsY1: 0,
            cvsY2: -this.imageHeight,
        };
    }

    extend(backgroundClient, AbstructClient);

    backgroundClient.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, 30)) {
            this.setStates({
                cvsY1: this.state.cvsY1 >= this.imageHeight ? 0 : this.state.cvsY1 + 1,
                cvsY2: this.state.cvsY1 - this.imageHeight,
            });
        }
    };

    backgroundClient.prototype.render = function() {
        var clientWidth = document.body.clientWidth;
        this.frame.ctx.drawImage(
            this.image, 0, 0,
            this.image.width, this.image.height,
            0, this.state.cvsY1, clientWidth, this.imageHeight
        );
        this.frame.ctx.drawImage(
            this.image, 0, 0,
            this.image.width, this.image.height,
            0, this.state.cvsY2, clientWidth, this.imageHeight
        );
    };

    window.BackgroundClient = backgroundClient;
})();