function heroClientBuilder(frame, images, heroNumber) {
    return function(id) {
        return new HeroClient(id, frame, images, heroNumber);
    };
}
