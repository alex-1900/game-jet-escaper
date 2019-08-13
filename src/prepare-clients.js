function heroClientBuilder(frame, images, heroNumber) {
    return function(id) {
        return new HeroClient(id, frame, images, heroNumber);
    };
}

function backgroundClientBuilder(frame, images, mapNumber) {
    return function(id) {
        return new BackgroundClient(id, frame, images, mapNumber);
    };
}

function bulletClientBuilder(frame, image, x, y, isEnemy) {
    var s = isEnemy ? 3 : -3;
    return function(id) {
        return new BulletClient(id, frame, image, x, y, s);
    };
}

function smokeClientBuilder(frame, x, y) {
    return function(id) {
        return new SmokeClient(id, frame, x, y);
    };
}

function collisionClientBuilder(frame, heroClient, mixedClient) {
    return function(id) {
        return new CollisionClient(id, frame, heroClient, mixedClient);
    };
}

function mixedClientBuilder(frame, bloodFill, bulletNumber, killNumber, distance) {
    return function(id) {
        return new MixedClient(id, frame, bloodFill, bulletNumber, killNumber, distance);
    };
}

function controllerClientBuilder(elementHandleCtrl, elementShotCtrl, heroClient, mixedClient) {
    return function(id) {
        return new Controller(id, elementHandleCtrl, elementShotCtrl, heroClient, mixedClient);
    };
}

function goodClientBuilder(frame, type, x, y, speedX, speedY, callback) {
    return function(id) {
        return new GoodClient(id, frame, type, x, y, speedX, speedY, callback);
    };
}
