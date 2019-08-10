(function() {
    "use strict"

    function heroClient(id, frame, images, heroNumber) {
        AbstructClient.call(this, id, frame);
        var clientWidth = document.body.clientWidth;
        var clientHeight = document.body.clientHeight;
        this.image = images['hero_' + heroNumber];
        var x = clientWidth / 2 - this.image.width / 2;
        var y = clientHeight - this.image.height - 20;
        this.state = {
            x: x,
            y: y,
            prevX: x,
            prevY: y,
        };
    }

    extend(heroClient, AbstructClient);

    heroClient.prototype.update = function(timestamp) {
        this.setStates({
            y: this.state.y - 1,
            prevX: this.state.x,
            prevY: this.state.y
        });
    };

    heroClient.prototype.render = function() {
        this.frame.clearImage(this.state.prevX, this.state.prevY, this.image);
        this.frame.drawImage(this.image, this.state.x, this.state.y);
    };

    window.HeroClient = heroClient;
})();