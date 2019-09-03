(function() {
    "use strict"

    function collisionClient(id, frame, heroClient, mixedClient) {
        AbstructClient.call(this, id, frame);
        this.heroClient = heroClient;
        this.mixedClient = mixedClient;
        this.clientWidth = document.body.clientWidth;
        this.clientHeight = document.body.clientHeight;

        this.state = {
            heroBullets: {},
            enemyBullets: {},
            killForGood: 0
        };
    }

    extend(collisionClient, AbstructClient);

    collisionClient.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, 80)) {
            // check screen
            this.checkOutScreen(this.state.heroBullets);
            this.checkOutScreen(this.state.enemyBullets);
            this.checkEnemiesOutScreen();

            // check bullet hit
            this.checkHeros();
            this.checkEnemies();
            this.checkGoods();
        }
    };

    collisionClient.prototype.checkHeros = function() {
        var heroInfo = this.heroClient.getInfo();
        for (var id in this.state.enemyBullets) {
            var bullet = this.state.enemyBullets[id];
            var bulletInfo = bullet.getInfo();
            var isCollision = this.collisionCheck(
                heroInfo[0], heroInfo[1], heroInfo[2], heroInfo[3],
                bulletInfo[0], bulletInfo[1], bulletInfo[2], bulletInfo[3]
            );
            if (isCollision) {
                this.terminateFromState('enemyBullets', id, true);
                var blood = this.mixedClient.updateBloodFill(-bullet.damage);
                if (blood == 0) {
                    var customEvent = new CustomEvent('game-over', {
                        detail: {
                            killNumber: this.mixedClient.state.killNumber,
                            distance: this.mixedClient.state.distance
                        }
                    });
                    document.dispatchEvent(customEvent);
                }
                // game over logic
            }
        }
    };

    collisionClient.prototype.checkGoods = function() {
        var heroInfo = this.heroClient.getInfo();
        for (var id in this.mixedClient.state.goods) {
            var good = this.mixedClient.state.goods[id];
            var goodInfo = good.getInfo();
            var isCollision = this.collisionCheck(
                heroInfo[0], heroInfo[1], heroInfo[2], heroInfo[3],
                goodInfo[0], goodInfo[1], goodInfo[2], goodInfo[3]
            );
            if (isCollision) {
                good.trigger();
                this.mixedClient.terminateFromState('goods', id);
            }
        }
    };

    collisionClient.prototype.checkEnemies = function () {
        for (var id in this.state.heroBullets) {
            var heroBullet = this.state.heroBullets[id];
            var heroBulletInfo = heroBullet.getInfo();
            for (var n in this.mixedClient.state.enemies) {
                var enemy = this.mixedClient.state.enemies[n];
                var enemyInfo = enemy.getInfo();
                var isCollision = this.collisionCheck(
                    heroBulletInfo[0], heroBulletInfo[1], heroBulletInfo[2], heroBulletInfo[3],
                    enemyInfo[0], enemyInfo[1], enemyInfo[2], enemyInfo[3]
                );
                if (isCollision) {
                    this.terminateFromState('heroBullets', id, true);
                    this.mixedClient.terminateFromState('enemies', n);
                    this.mixedClient.updateKillNumber(1);
                    if (this.state.killForGood == 8) {
                        this.state.killForGood = 0;
                        this.mixedClient.makeGood();
                    }
                    this.state.killForGood++;
                    break;
                }
            }
        }
    };

    collisionClient.prototype.checkEnemiesOutScreen = function() {
        for (var id in this.mixedClient.state.enemies) {
            var enemy = this.mixedClient.state.enemies[id];
            var enemyInfo = enemy.getInfo();
            if (!this.collisionCheck(
                enemyInfo[0], enemyInfo[1], enemyInfo[2], enemyInfo[3],
                0, -40, this.clientWidth, this.clientHeight
            )) {
                this.mixedClient.terminateFromState('enemies', id);
            }
        }
    };

    collisionClient.prototype.checkOutScreen = function(bullets) {
        for (var id in bullets) {
            var bullet = bullets[id];
            var bulletInfo = bullet.getInfo();
            if (bulletInfo[1] < -bulletInfo[2] || bulletInfo[1] > document.body.clientHeight) {
                delete bullets[id];
                bullet.terminate();
            }
        }
    };

    collisionClient.prototype.terminateFromState = function(key, id, isHitting) {
        var entry = this.state[key][id];
        entry.terminate(isHitting);
        delete this.state[key][id];
    };

    collisionClient.prototype.collisionCheck = function(x1, y1, w1, h1, x2, y2, w2, h2) {
        var x1Sub2 = x1 - x2;
        var y1Sub2 = y1 - y2;
        if (
            (y1Sub2 > 0 ? y1Sub2 < h2 : Math.abs(y1Sub2) < h1) &&
            (x1Sub2 > 0 ? x1Sub2 < w2 : Math.abs(x1Sub2) < w1)
        ) {
            return true;
        }
        return false;
    };

    collisionClient.prototype.addHeroBullet = function(bullet) {
        this.state.heroBullets[bullet.id] = bullet;
    };

    collisionClient.prototype.addEnemyBullet = function(bullet) {
        this.state.enemyBullets[bullet.id] = bullet;
    };

    collisionClient.prototype.terminate = function() {
        for (var id in this.state.heroBullets) {
            this.terminateFromState('heroBullets', id);
        }
        for (var id in this.state.enemyBullets) {
            this.terminateFromState('enemyBullets', id);
        }
        app.detachClient(this.id);
    };

    window.CollisionClient = collisionClient;
})();