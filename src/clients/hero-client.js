(function() {
    "use strict"

    function heroClient(id, frame, images, heroNumber) {
        AbstructClient.call(this, id, frame);
        var clientWidth = document.body.clientWidth;
        var clientHeight = document.body.clientHeight;
        this.image = images['hero_' + heroNumber];
        this.bullet0_0 = images.bullet2_0;

        this.boundaryX = clientWidth - this.image.width;
        this.boundaryY = clientHeight - this.image.height;

        var x = clientWidth / 2 - this.image.width / 2;
        var y = clientHeight - this.image.height - 20;
        this.state = {
            x: x,
            y: y,
            prevX: x,
            prevY: y,
            speedX: 0,
            speedY: 0,
            isShooting: false,
            currentBullet: this.bullet0_0,
        };
    }

    extend(heroClient, AbstructClient);

    heroClient.prototype.update = function(timestamp) {
        this.setStates({
            x: (this.state.x < 0 && this.state.speedX < 0) ||
                (this.state.x > this.boundaryX && this.state.speedX > 0) ?
                this.state.x : this.state.x + this.state.speedX,
            y: (this.state.y < 0 && this.state.speedY < 0) ||
                (this.state.y > this.boundaryY && this.state.speedY > 0) ?
                this.state.y : this.state.y + this.state.speedY,
            prevX: this.state.x,
            prevY: this.state.y
        });
    };

    heroClient.prototype.render = function() {
        this.frame.clearImage(this.state.prevX, this.state.prevY, this.image);
        this.frame.drawImage(this.image, this.state.x, this.state.y);
        if (this.state.isShooting) {
            var bulletX = this.state.x + this.image.width / 2 - this.state.currentBullet.width / 2;
            var bulletY = this.state.y;
            this.frame.drawImage(this.image, bulletX, this.state.y);
        }
    };

    heroClient.prototype.setSpeed = function(fixX, fixY) {
        var speedX = fixX / 10;
        var speedY = fixY / 10;
        this.setStates({
            speedX: speedX,
            speedY: speedY,
        });
    };

    heroClient.prototype.setShootingState = function(isShooting) {
        this.setState('isShooting', isShooting);
    }

    heroClient.prototype.makeBullet = function() {
        var bulletX = this.state.x + this.image.width / 2 - this.state.currentBullet.width / 2;
        var bulletY = this.state.y;
        var bullet = app.attachClient(bulletClientBuilder(this.frame, this.state.currentBullet, bulletX, bulletY));
        return bullet;
    }

    window.HeroClient = heroClient;
})();