(function() {
    "use strict"

    var GOOD_BULLET = 0;
    var GOOD_SPEED = 1;

    function mixedClient(id, frame, bloodFill, bulletNumber, killNumber, distance) {
        AbstructClient.call(this, id, frame);
        this.elementBloodFill = bloodFill;
        this.elementBulletNumber = bulletNumber;
        this.elementKillNumber = killNumber;
        this.elementDistance = distance;
        this.clientWidth = document.body.clientWidth;
        this.clientHeight = document.body.clientHeight;
        this.goodsFrame = new Frame(this.clientWidth, this.clientHeight);
        app.appendFrame(this.goodsFrame);

        this.showFrame = new Frame(this.clientWidth, this.clientHeight);
        app.appendFrame(this.showFrame);

        this.speed = 3;
        this.blood = 1000;

        this.state = {
            blood: 0,
            bulletNumber: 11,
            killNumber: 0,
            distance: 0,
            speed: this.speed,
        }

        this.updateBloodFill(this.blood);
        this.decrBulletNumber();
        this.updateKillNumber(this.state.killNumber);
    }

    extend(mixedClient, AbstructClient);

    mixedClient.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, 400)) {
            this.setStates({
                distance: this.state.distance + this.state.speed,
            });
        }
    };

    mixedClient.prototype.render = function () {
        this.elementDistance.innerText = this.state.distance;
    };

    mixedClient.prototype.updateBloodFill = function(number) {
        this.state.blood += number;
        if (this.state.blood < 0) {
            this.state.blood = 0;
        }
        if (this.state.blood > this.blood) {
            this.state.blood = this.blood;
        }
        var value = Math.floor(this.state.blood / this.blood * 100);
        Dom.styleRender(this.elementBloodFill, {
            width: value + '%'
        });
        this.elementBloodFill.innerText = this.state.blood;
        return this.state.blood;
    };

    mixedClient.prototype.makeGood = function() {
        var type = Math.floor(Math.random()*2);
        var x = Math.floor(Math.random()*this.clientWidth);
        var speedX = Math.floor(Math.random()*2 + 0.5);
        var speedY = Math.floor(Math.random()*2 + 2);
        if (x > this.clientWidth / 2) {
            speedX = -speedX;
        }
        var callback = this.getCallbackByType(type);
        return app.attachClient(
            goodClientBuilder(this.goodsFrame, type, x, 0, speedX, speedY, callback)
        );
    }

    mixedClient.prototype.getCallbackByType = function(type) {
        return (function () {
            switch (type) {
                case GOOD_BULLET: {
                    var number = Math.floor(Math.random()*20 + 1);
                    this.addBulletNumber(number);
                    this.showMessage('弹药', number);
                    break;
                }
                case GOOD_SPEED: {
                    var number = Math.floor(Math.random()*200 + 1);
                    this.updateBloodFill(number);
                    this.showMessage('生命值', number);
                    break;
                }
            }
        }).bind(this);
    };

    mixedClient.prototype.showMessage = function (type, number) {
        var message = type + '+' + number;
        this.showFrame.flashText(message);
    };

    mixedClient.prototype.updateKillNumber = function (number) {
        this.state.killNumber += number;
        this.elementKillNumber.innerText = this.state.killNumber;
    };

    mixedClient.prototype.addBulletNumber = function (number) {
        this.state.bulletNumber += number;
        this.elementBulletNumber.innerText = this.state.bulletNumber;
    };

    mixedClient.prototype.decrBulletNumber = function () {
        if (this.state.bulletNumber > 0) {
            this.state.bulletNumber -= 1;
            this.elementBulletNumber.innerText = this.state.bulletNumber;
        }
    };

    window.MixedClient = mixedClient;
})();
