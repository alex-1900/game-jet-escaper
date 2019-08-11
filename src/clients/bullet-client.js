(function() {
    "use strict"

    function bulletClient(id, frame, image, x, y, speed) {
        AbstructClient.call(this, id, frame);
        this.image = image;
        this.x = x;
        this.speed = speed;

        this.state = {
            y: y,
            prevY: y,
        };
    }

    extend(bulletClient, AbstructClient);

    bulletClient.prototype.update = function(timestamp) {
        this.setStates({
            y: this.state.y + this.speed,
            prevY: this.state.y
        });

        if (this.state.y < -this.image.height || this.state.y > document.body.clientHeight) {
            console.log('terminate');
            this.terminate();
        }
    };

    bulletClient.prototype.render = function() {
        this.frame.clearImage(this.x, this.state.prevY, this.image);
        this.frame.drawImage(this.image, this.x, this.state.y);
    };

    window.BulletClient = bulletClient;
})();