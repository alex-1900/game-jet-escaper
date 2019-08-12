(function() {
    "use strict"

    function smokeClient(id, frame, x, y) {
        AbstructClient.call(this, id, frame);
        this.x = x;
        this.y = y;
        var images = app.get('images');
        this.smokes = [
            images.boom_0,
            images.boom_1,
            images.boom_2,
            images.boom_3,
            images.boom_4,
            images.boom_5,
        ];
        this.state = {
            currentImage: 0,
            prevImage: 0
        }
    }

    extend(smokeClient, AbstructClient);

    smokeClient.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, 40)) {
            if (this.state.currentImage == this.smokes.length - 1) {
                this.terminate();
            } else {
                this.setState('prevImage', this.state.currentImage);
                this.setState('currentImage', this.state.currentImage + 1);
            }
        }
    };

    smokeClient.prototype.render = function() {
        var prevImage = this.smokes[this.state.prevImage];
        var x = this.x - prevImage.width / 2;
        var y = this.y - prevImage.height / 2;
        this.frame.clearImage(x, y, prevImage);

        var currentImage = this.smokes[this.state.currentImage];
        var x = this.x - currentImage.width / 2;
        var y = this.y - currentImage.height / 2;
        this.frame.drawImage(currentImage, x, y);
    };

    smokeClient.prototype.terminate = function() {
        var image = this.smokes[this.state.currentImage];
        var x = this.x - image.width / 2;
        var y = this.y - image.height / 2;
        this.frame.clearImage(x, y, image);
        setTimeout((function() {
            app.detachClient(this.id);
        }).bind(this), 200);
    };

    window.SmokeClient = smokeClient;
})();
