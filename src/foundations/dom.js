(function() {
    "use strict"

    window.Dom = {
        styleRender: function(object, css) {
            for (var key in css) {
                object.style[key] = css[key];
            }
        },
        imageSplit: function (image, x, y, w, h, p) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            canvas.width = w * p;
            canvas.height = h * p;

            var bufferCanvas = document.createElement('canvas');
            var bufferCtx = bufferCanvas.getContext('2d');
            bufferCanvas.width = image.width;
            bufferCanvas.height = image.height;
            bufferCtx.drawImage(image, 0, 0);

            p = p ? p : 1;
            ctx.drawImage(bufferCanvas, x, y, w, h, 0, 0, w * p, h * p);
            return canvas;
        },
        all: function(selectorName, callback) {
            var selectors = document.querySelectorAll(selectorName);
            for (var i = 0; i < selectors.length; i++) {
                callback(selectors[i], i);
            }
        },
    };
})();
