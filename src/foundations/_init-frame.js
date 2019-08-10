(function() {
    "use strict"

    function initFrame(app, images) {
        this.items = {};
        var frame = new Frame(clientWidth, clientHeight, this.onTap.bind(this));

        frame.ctx.drawImage(images.bg_logo, 0, 0, images.bg_logo.width, images.bg_logo.height, 0, 0, clientWidth, clientHeight);
        var mid = clientWidth / 2;
        frame.drawImage(images.hero_1, mid - images.hero_1.width - 20, clientHeight / 1.5);
        frame.drawImage(images.hero_2, mid + 20, clientHeight / 1.5);
        this.items['hero1'] = [images.hero_1, mid - images.hero_1.width - 20, clientHeight / 1.5];
        this.items['hero2'] = [images.hero_2, mid + 20, clientHeight / 1.5];

        app.appendFrame(frame);
    }

    initFrame.prototype.onTap = function(event) {
        for (var name in this.items) {
            var item = this.items[name];
            if (this.inImageArea(item[0], item[1], item[2])) {
                this.switchAction(name, event);
            }
        }
    };

    initFrame.prototype.switchAction = function(name, event) {
        switch (name) {
            case 'hero1': {
                alert('hero1');
                break;
            }
            case 'hero2': {
                alert('hero2');
            }
        }
    };

    initFrame.prototype.inImageArea = function(image, x, y) {
        var mouse = event.touches[0];
        if (
            mouse.clientX >= x &&
            mouse.clientX <= x + image.width &&
            mouse.clientY >= y &&
            mouse.clientY <= y + image.height
        ) {
            return true;
        }
        return false;
    }

    window.InitFrame = initFrame;
})();
