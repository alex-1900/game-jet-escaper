(function () {
    "use strict"

    function frame(width, height, tapHandler) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = "20pt Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif";
        this.ctx.fillStyle = "#3CB371";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        if (tapHandler) {
            this.canvas.ontouchstart = tapHandler;
        }
    }

    frame.prototype.drawImage = function(image, x, y) {
        this.ctx.drawImage(image, x, y);
    };

    frame.prototype.flashText = function(text) {
        this.clear(0, 0, document.body.clientWidth, document.body.clientHeight);
        this.ctx.fillText(text, document.body.clientWidth / 2, document.body.clientHeight / 3);
        setTimeout((function() {
            this.clear(0, 0, document.body.clientWidth, document.body.clientHeight);
        }).bind(this), 1000);
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
