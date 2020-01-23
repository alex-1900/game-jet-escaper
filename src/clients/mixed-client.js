(function() {
    "use strict"

    var GOOD_BULLET = 0;
    var GOOD_HEALTH = 1;
    var GOOD_LIMITLESS = 2;
    var GOOD_KILLALL = 3;

    function mixedClient(id, frame, bloodFill, bulletNumber, killNumber, distance) {
        AbstructClient.call(this, id, frame);
        var images = app.get('images');
        this.enemyImages = [
            images.enemy_0,
            images.enemy_1,
            images.enemy_2,
            images.enemy_3,
        ];
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
            bulletNumber: 21,
            killNumber: 0,
            distance: 0,
            speed: this.speed,
            isLimitless: false,
            enemies: {},
            goods: {},
            enemiesTimestamp: 0,
            goodsTimestamp: 0,
            enemyBulletImage: images.bullet0_0,
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

        if (timestamp - this.state.enemiesTimestamp >= 1500) {
            this.makeEnemy();
            this.state.enemiesTimestamp = timestamp;
        }

        if (timestamp - this.state.goodsTimestamp >= 19000) {
            this.makeGood();
            this.state.goodsTimestamp = timestamp;
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

    mixedClient.prototype.makeEnemy = function () {
        var x = Math.floor(Math.random()*this.clientWidth);
        var speedX = Math.floor(Math.random()*2 + 1);
        var speedY = Math.floor(Math.random()*2 + 1);
        if (x > this.clientWidth / 2) {
            speedX = -speedX;
        }
        var imageNumber = Math.floor(Math.random() * 4);
        var image = this.enemyImages[imageNumber];
        var enemy = app.attachClient((function(id) {
            return new EnemyClient(id, this.frame, image, this.state.enemyBulletImage, x, -40, speedX, speedY);
        }).bind(this));
        this.state.enemies[enemy.id] = enemy;
    };

    mixedClient.prototype.makeGood = function() {
        var randomNumber = Math.floor(Math.random()*100);
        var type = GOOD_KILLALL;
        if (randomNumber < 30) {
            type = GOOD_HEALTH;
        } else if (randomNumber < 60) {
            type = GOOD_BULLET;
        } else if (randomNumber < 75) {
            type = this.state.isLimitless ? GOOD_HEALTH : GOOD_LIMITLESS;
        }

        var x = Math.floor(Math.random()*this.clientWidth);
        var speedX = Math.floor(Math.random()*2 + 0.5);
        var speedY = Math.floor(Math.random()*2 + 2);
        if (x > this.clientWidth / 2) {
            speedX = -speedX;
        }
        var callback = this.getCallbackByType(type);
        var good = app.attachClient(
            goodClientBuilder(this.goodsFrame, type, x, 0, speedX, speedY, callback)
        );
        this.state.goods[good.id] = good;
    }

    mixedClient.prototype.getCallbackByType = function(type) {
        return (function () {
            switch (type) {
                case GOOD_BULLET: {
                    var number = Math.floor(Math.random()*20 + 1);
                    this.addBulletNumber(number);
                    this.showMessage('弹药+' + number, '#FFA07A');
                    break;
                }
                case GOOD_HEALTH: {
                    var number = Math.floor(Math.random()*180 + 1) + 20;
                    this.updateBloodFill(number);
                    this.showMessage('生命值+' + number, '#3CB371');
                    break;
                }
                case GOOD_LIMITLESS: {
                    this.state.isLimitless = true;
                    var customEvent = new CustomEvent('count-down');
                    document.dispatchEvent(customEvent);
                    this.showMessage('15 秒无限弹药', '#FFA500');
                    setTimeout((function() {
                        this.showMessage('无限弹药模式结束', '#FFA500');
                        this.state.isLimitless = false;
                    }).bind(this), 15000);
                    break;
                }
                case GOOD_KILLALL: {
                    this.killAllEnemies();
                    this.showMessage('毁灭打击！', '#FF6347');
                    break;
                }
            }
        }).bind(this);
    };

    mixedClient.prototype.showMessage = function (message, color) {
        this.showFrame.flashText(message, color);
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
        // 无限子弹时间不会减少子弹数量
        if ((!this.state.isLimitless) && this.state.bulletNumber > 0) {
            this.state.bulletNumber -= 1;
            this.elementBulletNumber.innerText = this.state.bulletNumber;
        }
    };
    
    mixedClient.prototype.killAllEnemies = function () {
        for (var id in this.state.enemies) {
            this.updateKillNumber(1);
            var enemyInfo = this.state.enemies[id].getInfo();
            app.attachClient(
                smokeClientBuilder(this.frame, enemyInfo[0], enemyInfo[1])
            );
            this.terminateFromState('enemies', id);
        }
    };

    mixedClient.prototype.terminateFromState = function(key, id, isHitting) {
        var entry = this.state[key][id];
        entry.terminate(isHitting);
        delete this.state[key][id];
    };

    mixedClient.prototype.isLimitless = function() {
        return this.state.isLimitless;
    };

    mixedClient.prototype.terminate = function() {
        for (var id in this.state.enemies) {
            this.terminateFromState('enemies', id);
        }

        for (var id in this.state.goods) {
            this.terminateFromState('goods', id);
        }
        app.detachClient(this.id);
    };

    window.MixedClient = mixedClient;
})();
