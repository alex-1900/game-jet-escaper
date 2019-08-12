(function() {
    "use strict"

    function enemyClient(id, frame, image, bulletImage, x, y, speedX, speedY) {
        AbstructClient.call(this, id, frame);
        this.collisionClient = app.get('CollisionClient');
        this.image = image;
        this.bullet = bulletImage;
        this.speedX = speedX;
        this.speedY = speedY;
        this.state = {
            x: x,
            y: y,
            prevX: x,
            prevY: y,
        };
    }

    extend(enemyClient, AbstructClient);

    enemyClient.prototype.update = function(timestamp) {
        this.setStates({
            x: this.state.x + this.speedX,
            y: this.state.y + this.speedY,
            prevX: this.state.x,
            prevY: this.state.y
        });
        if (this.isOvertime(timestamp, 1000)) {
            this.makeBullet();
        }
    };

    enemyClient.prototype.render = function() {
        this.frame.clearImage(this.state.prevX, this.state.prevY, this.image);
        this.frame.drawImage(this.image, this.state.x, this.state.y);
    };

    enemyClient.prototype.getInfo = function() {
        return [
            this.state.x,
            this.state.y,
            this.image.width,
            this.image.height
        ];
    };

    enemyClient.prototype.makeBullet = function() {
        var bulletX = this.state.x + this.image.width / 2 - this.bullet.width / 2;
        var bulletY = this.state.y + this.image.height;
        var bullet = app.attachClient(bulletClientBuilder(this.frame, this.bullet, bulletX, bulletY, true));
        this.collisionClient.addEnemyBullet(bullet);
    }

    enemyClient.prototype.terminate = function() {
        var w = this.image.width + 10;
        var h = this.image.height + 10;
        this.frame.clear(this.state.prevX - 5, this.state.prevY - 5, w, h);
        this.frame.clear(this.x - 5, this.state.y - 5, w, h);
        app.detachClient(this.id);
    };

    window.EnemyClient = enemyClient;
})();
