(function() {
    "use strict"

    function controller(handleCtrl, shotCtrl, heroClient) {
        this.handleCtrl = handleCtrl;
        this.shotCtrl = shotCtrl;
        this.heroClient = heroClient;
        this.collisionClient = app.get('CollisionClient');

        this.top = 25;
        this.left = 25;
        this.state = {
            startX: 0,
            startY: 0,
            shootIntervalNumber: 0,
            shotKey: false,
        };

        this.handleCtrl.ontouchstart = this.ctrlTouchStart.bind(this);
        this.handleCtrl.ontouchmove = this.ctrlTouchMove.bind(this);
        this.handleCtrl.ontouchend = this.ctrlTouchEnd.bind(this);

        this.shotCtrl.ontouchstart = this.shotStart.bind(this);
        this.shotCtrl.ontouchend = this.shotEnd.bind(this);
        this.shotCtrl.ontouchcancel = this.shotEnd.bind(this);
    }

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

    controller.prototype.shotStart = function(event) {
        event.preventDefault();
        if (this.state.shotKey == false) {
            this.state.shotKey = true;
            this.collisionClient.addHeroBullet(this.heroClient.makeBullet());
            setTimeout((function() {this.state.shotKey = false}).bind(this), 400);
        }
        this.state.shootIntervalNumber = setInterval((function () {
            this.collisionClient.addHeroBullet(this.heroClient.makeBullet());
        }).bind(this), 400);
    };

    controller.prototype.shotEnd = function(event) {
        clearInterval(this.state.shootIntervalNumber);
    };

    function makeController(elementHandleCtrl, elementShotCtrl, heroClient) {
        return new controller(elementHandleCtrl, elementShotCtrl, heroClient);
    }

    window.Controller = controller;
    window.makeController = makeController;
})();