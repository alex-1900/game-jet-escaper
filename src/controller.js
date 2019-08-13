(function() {
    "use strict"

    function controller(id, handleCtrl, shotCtrl, heroClient, mixedClient) {
        AbstructClient.call(this, id, null);
        this.handleCtrl = handleCtrl;
        this.shotCtrl = shotCtrl;
        this.heroClient = heroClient;
        this.mixedClient = mixedClient;
        this.collisionClient = app.get('CollisionClient');

        this.top = 25;
        this.left = 25;
        this.state = {
            shootTimestamp: 0,
            startX: 0,
            startY: 0,
            shootIntervalNumber: 0,
            shotKey: false,
            isShotting: false,
        };

        this.handleCtrl.ontouchstart = this.ctrlTouchStart.bind(this);
        this.handleCtrl.ontouchmove = this.ctrlTouchMove.bind(this);
        this.handleCtrl.ontouchend = this.ctrlTouchEnd.bind(this);

        this.shotCtrl.ontouchstart = this.shotStart.bind(this);
        this.shotCtrl.ontouchend = this.shotEnd.bind(this);
        this.shotCtrl.ontouchcancel = this.shotEnd.bind(this);
    }

    extend(controller, AbstructClient);

    controller.prototype.update = function(timestamp) {
        if (this.state.isShotting) {
            if (timestamp - this.state.shootTimestamp >= 400) {
                this.state.shootTimestamp = timestamp;
                this.blazedShoot();
            }
        } else {
            this.state.shootTimestamp = timestamp;
        }
    };

    controller.prototype.ctrlTouchMove = function(event) {
        event.preventDefault();
        var finger = event.touches[0];

        var fixX = finger.clientX - this.state.startX;
        var fixY = finger.clientY - this.state.startY;

        var longSide = Math.sqrt(Math.pow(fixX, 2) + Math.pow(fixY, 2));
        if (longSide > 25) {
            var proportion = 25 / longSide;
            fixX = fixX * proportion;
            fixY = fixY * proportion;
        }

        this.heroClient.setSpeed(fixX, fixY);

        Dom.styleRender(this.handleCtrl, {
            top: this.top + fixY + 'px',
            left: this.left + fixX + 'px'
        });
    };

    controller.prototype.ctrlTouchEnd = function(event) {
        this.heroClient.setSpeed(0, 0);
        Dom.styleRender(this.handleCtrl, {
            top: this.top + 'px',
            left: this.left + 'px'
        });
    };

    controller.prototype.ctrlTouchStart = function(event) {
        event.preventDefault();
        var finger = event.touches[event.touches.length - 1];
        this.state.startX = finger.clientX;
        this.state.startY = finger.clientY;
    };

    controller.prototype.shot = function() {
        this.collisionClient.addHeroBullet(this.heroClient.makeBullet());
        this.mixedClient.decrBulletNumber();
    }

    controller.prototype.shotStart = function(event) {
        event.preventDefault();
        if (
            this.state.shotKey == false &&
            (this.mixedClient.state.bulletNumber != 0 || this.mixedClient.state.isLimitless)
        ) {
            this.shot();
            this.setStates({
                shotKey: true,
                isShotting: true,
            });
            setTimeout((function() {this.setStates({
                shotKey: false,
            })}).bind(this), 400);
        }
    };

    controller.prototype.blazedShoot = function() {
        if (this.mixedClient.state.bulletNumber != 0 ||
            this.mixedClient.state.isLimitless) {
            this.shot();
        } else {
            this.shotEnd();
        }
    };

    controller.prototype.shotEnd = function() {
        this.setState('isShotting', false);
    };

    window.Controller = controller;
})();
