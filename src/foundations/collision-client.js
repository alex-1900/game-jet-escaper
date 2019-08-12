(function() {
    "use strict"

    function collisionClient(id, frame, heroClient) {
        AbstructClient.call(this, id, frame);
        var images = app.get('images');
        this.heroClient = heroClient;
        this.clientWidth = document.body.clientWidth;
        this.clientHeight = document.body.clientHeight;
        this.enemyImages = [
            images.enemy_0,
            images.enemy_1,
            images.enemy_2,
            images.enemy_3,
        ];

        this.state = {
            enemies: {},
            heroBullets: {},
            enemyBullets: {},
            enemiesIntervalNumber: 0,
            enemyBulletImage: images.bullet0_0
        };

        this.makeEnemies();
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
                // game over logic
            }
        }
    };

    collisionClient.prototype.checkEnemies = function () {
        for (var id in this.state.heroBullets) {
            var heroBullet = this.state.heroBullets[id];
            var heroBulletInfo = heroBullet.getInfo();
            for (var n in this.state.enemies) {
                var enemy = this.state.enemies[n];
                var enemyInfo = enemy.getInfo();
                var isCollision = this.collisionCheck(
                    heroBulletInfo[0], heroBulletInfo[1], heroBulletInfo[2], heroBulletInfo[3],
                    enemyInfo[0], enemyInfo[1], enemyInfo[2], enemyInfo[3]
                );
                if (isCollision) {
                    this.terminateFromState('heroBullets', id, true);
                    this.terminateFromState('enemies', n);
                    break;
                }
            }
        }
    };

    collisionClient.prototype.checkEnemiesOutScreen = function() {
        for (var id in this.state.enemies) {
            var enemy = this.state.enemies[id];
            var enemyInfo = enemy.getInfo();
            if (!this.collisionCheck(
                enemyInfo[0], enemyInfo[1], enemyInfo[2], enemyInfo[3],
                0, 0, this.clientWidth, this.clientHeight
            )) {
                this.terminateFromState('enemies', id);
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

    collisionClient.prototype.makeEnemies = function () {
        this.state.enemiesIntervalNumber = setInterval((function () {
            var x = Math.floor(Math.random()*this.clientWidth);
            var speedX = Math.floor(Math.random()*2 + 1);
            var speedY = Math.floor(Math.random()*2 + 1);
            if (x > this.clientWidth / 2) {
                speedX = -speedX;
            }
            var imageNumber = Math.floor(Math.random() * 4);
            var image = this.enemyImages[imageNumber];
            var enemy = app.attachClient((function(id) {
                return new EnemyClient(id, this.frame, image, this.state.enemyBulletImage, x, 0, speedX, speedY);
            }).bind(this));
            this.state.enemies[enemy.id] = enemy;
        }).bind(this), 1500);
    };

    collisionClient.prototype.addHeroBullet = function(bullet) {
        this.state.heroBullets[bullet.id] = bullet;
    };

    collisionClient.prototype.addEnemyBullet = function(bullet) {
        this.state.enemyBullets[bullet.id] = bullet;
    };

    collisionClient.prototype.terminate = function() {
        clearInterval(this.state.enemiesIntervalNumber);
        for (var id in this.state.heroBullets) {
            this.terminateFromState('heroBullets', id);
        }
        for (var id in this.state.enemyBullets) {
            this.terminateFromState('enemyBullets', id);
        }
        for (var id in this.state.enemies) {
            this.terminateFromState('enemies', id);
        }
        app.detachClient(this.id);
    };

    window.CollisionClient = collisionClient;
})();