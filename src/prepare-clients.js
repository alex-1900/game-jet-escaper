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

function bulletClientBuilder(frame, image, x, y) {
    return function(id) {
        return new BulletClient(id, frame, image, x, y, -3);
    };
}