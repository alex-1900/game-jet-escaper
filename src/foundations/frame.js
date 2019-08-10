(function () {
    "use strict"

    function frame(width, height, tapHandler) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        if (tapHandler) {
            this.canvas.ontouchstart = tapHandler;
        }
    }

    frame.prototype.drawImage = function(image, x, y) {
        this.ctx.drawImage(image, x, y);
    };

    frame.prototype.clear = function(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
    };

    frame.prototype.clearImage = function(x, y, image) {
        this.ctx.clearRect(x, y, image.width, image.height);
    };

    frame.prototype.appendTo = function (dom) {
        dom.appendChild(this.canvas);
    };

    window.Frame = frame;
})();
