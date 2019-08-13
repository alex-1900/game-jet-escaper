(function() {
    "use strict"

    function bulletClient(id, frame, image, x, y, speed) {
        AbstructClient.call(this, id, frame);
        this.image = image;
        this.x = x;
        this.speed = speed;
        this.damage = 65;

        this.state = {
            y: y,
            prevY: y
        };
    }

    extend(bulletClient, AbstructClient);

    bulletClient.prototype.update = function(timestamp) {
        this.setStates({
            y: this.state.y + this.speed,
            prevY: this.state.y
        });
    };

    bulletClient.prototype.render = function() {
        this.frame.clearImage(this.x, this.state.prevY, this.image);
        this.frame.drawImage(this.image, this.x, this.state.y);
    };

    bulletClient.prototype.getInfo = function() {
        return [
            this.x,
            this.state.y,
            this.image.width,
            this.image.height
        ];
    };

    bulletClient.prototype.terminate = function(isHitting) {
        this.frame.clearImage(this.x, this.state.prevY, this.image);
        this.frame.clearImage(this.x, this.state.y, this.image);
        if (isHitting) {
            app.attachClient(
                smokeClientBuilder(this.frame, this.x, this.state.y)
            );
        }
        app.detachClient(this.id);
    };

    window.BulletClient = bulletClient;
})();