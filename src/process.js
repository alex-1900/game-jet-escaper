(function () {
    var elementCanvasContainer = document.getElementById('domCanvasContainer');
    var elementInitFrame = document.getElementById('initFrame');
    var elementLoader = document.getElementById('loader');
    var elementLoaderFill = document.getElementById('loaderFill');
    var elementStartGame = document.getElementById('startGame');
    var elementLoadBtn = document.getElementById('loadBtn');
    var elementSwitchFrame = document.getElementById('switchFrame');
    var elementFight = document.getElementById('fight');
    var elementController = document.getElementById('controller');
    var elementHandleCtrl = document.getElementById('handle-ctrl');
    var elementShotCtrl = document.getElementById('shot-ctrl');
    var elementMain = document.getElementById('main');
    var elementPanel = document.getElementById('panel');

    var elementBloodFill = document.getElementById('bloodFill');
    var elementBulletNumber = document.getElementById('bulletNumber');
    var elementKillNumber = document.getElementById('killNumber');
    var elementDistance = document.getElementById('distance');

    var elementShowRecord = document.getElementById('showRecord');
    var elementRecordDistance = document.getElementById('recordDistance');
    var elementRecordKillNumber = document.getElementById('recordKillNumber');
    var elementRecordBoard = document.getElementById('recordBoard');
    var elementReplay = document.getElementById('replay');


    var neededImages = {
        img_plane_main: './resources/images/img_plane_main.png',
        img_plane_enemy: './resources/images/img_plane_enemy.png',
        img_boom: './resources/images/img_boom.png',
        img_bullet_size0: './resources/images/img_bullet_size0.png',
        img_bullet_size1: './resources/images/img_bullet_size1.png',
        img_bullet_size2: './resources/images/img_bullet_size2.png',
        img_bg_level_2: './resources/images/img_bg_level_2.jpg',
        img_bg_level_3: './resources/images/img_bg_level_3.jpg',
        img_bg_level_4: './resources/images/img_bg_level_4.jpg',
        img_bg_level_5: './resources/images/img_bg_level_5.jpg',
        img_init0: './resources/images/img_init0.jpg',
        img_bg_logo: './resources/images/img_bg_logo.jpg',
        letter_peek: './resources/images/letter_peek.png',
        img_plane_ui0: './resources/images/img_plane_ui0.png',
        img_plane_ui1: './resources/images/img_plane_ui1.png',
        img_plane_ui2: './resources/images/img_plane_ui2.png',
        img_plane_ui3: './resources/images/img_plane_ui3.png',
        img_smoke: './resources/images/img_smoke.png',
        img_good: './resources/images/img_good.png',
    };
    var imageLoader = new ImageLoader(neededImages);

    var states = {
        heroNumber: 0,
        mapNumber: 0,
    }

    function replayGame() {
        Dom.styleRender(elementShowRecord, {display: 'none'});
        Dom.styleRender(elementSwitchFrame, {display: 'block'});
    }

    function startGameHanldle(images) {
        // 开始游戏
        return function (event) {
            Dom.styleRender(elementSwitchFrame, {display: 'none'});
            Dom.styleRender(elementController, {display: 'block'});
            Dom.styleRender(elementPanel, {display: 'block'});

            var clientWidth = document.body.clientWidth;
            var clientHeight = document.body.clientHeight;
            var app = new App(elementCanvasContainer, clientWidth, clientHeight);
            app.set('images', images);
            window.app = app;

            // background
            var frameBg = new Frame(clientWidth, clientHeight);
            app.attachClient(backgroundClientBuilder(frameBg, images, states.mapNumber));
            app.appendFrame(frameBg);

            // hero
            var frameHero = new Frame(clientWidth, clientHeight);
            var heroClient = app.attachClient(heroClientBuilder(frameHero, images, states.heroNumber));
            app.appendFrame(frameHero);

            // mixed
            var frameMixed = new Frame(clientWidth, clientHeight);
            var mixedClient = app.attachClient(mixedClientBuilder(
                frameMixed, elementBloodFill, elementBulletNumber, elementKillNumber, elementDistance
            ));
            app.appendFrame(frameMixed);

            // bullets and enemies
            var frameEnemies = new Frame(clientWidth, clientHeight);
            var collisionClient = app.attachClient(collisionClientBuilder(frameEnemies, heroClient, mixedClient));
            app.set('CollisionClient', collisionClient);
            app.appendFrame(frameEnemies);

            app.attachClient(controllerClientBuilder(
                elementHandleCtrl, elementShotCtrl, heroClient, mixedClient
            ));

            document.addEventListener('game-over', function(event) {
                var detail = event.detail;
                app.stop();

                Dom.styleRender(elementController, {display: 'none'});
                Dom.styleRender(elementPanel, {display: 'none'});
                Dom.styleRender(elementShowRecord, {display: 'block'});
                elementRecordDistance.innerText = detail.distance;
                elementRecordKillNumber.innerText = detail.killNumber;
            });

            app.start();
        };
    }

    // 加载完毕
    function onLoadSuccess(images) {
        // requestFullScreen();
        Dom.styleRender(elementLoader, {display: 'none'});
        Dom.styleRender(elementStartGame, {display: 'block'});
        Dom.styleRender(elementLoaderFill, {width: 0});
        // 点击开始游戏按钮
        elementStartGame.onclick = function (event) {
            // 显示第二帧 switch
            Dom.styleRender(elementInitFrame, {display: 'none'});
            Dom.styleRender(elementSwitchFrame, {display: 'block'});
        };

        elementFight.onclick = startGameHanldle(images);
    }

    // 渲染加载条
    function onResourceLoading() {
        var length = Object.keys(neededImages).length;
        var piece = 100 / length;
        var count = 0;
        return function (image, key) {
            count += piece;
            var showcount = Math.ceil(count);
            Dom.styleRender(elementLoaderFill, {width: showcount + '%'});
            elementLoaderFill.innerText = key;
        };
    }

    imageLoader.onEachLoaded(onResourceLoading());

    // 点击加载按钮
    document.getElementById('loadBtn').onclick = function(event) {
        Dom.styleRender(elementLoadBtn, {display: 'none'});
        Dom.styleRender(elementLoader, {display: 'block'});
        var promise = imageLoader.load();
        promise.then(function (_images) {
            var images = prepareImages(_images);
            return onLoadSuccess(images);
        });
    };

    // 选择地图和战机
    Dom.all('.map-btn', function(selector, index) {
        selector.onclick = function (event) {
            Dom.all('.map-btn', function(s, i) {
                Dom.styleRender(s, {width: '100px', height: '100px', fontSize: '1.5rem'});
            });
            Dom.styleRender(selector, {width: '120px', height: '120px', fontSize: '1.8rem'});
            states.mapNumber = selector.getAttribute('data');
        }
    });
    Dom.all('.plane-btn', function(selector, index) {
        selector.onclick = function (event) {
            Dom.all('.plane-btn', function(s, i) {
                Dom.styleRender(s, {width: '100px', height: '70px'});
            });
            Dom.styleRender(selector, {width: '120px', height: '84px'});
            states.heroNumber = selector.getAttribute('data');
        }
    });

    function longTouch(element, callback) {
        element.ontouchstart = function(event) {
            event.preventDefault();
            var touching = false;
            touching = true;
            setTimeout(function() {
                if (touching) {
                    callback(event);
                }
            }, 1200);
            element.ontouchend = function(event) {
                touching = false;
            };
        };
    }

    elementReplay.onclick = function() {replayGame()};

    longTouch(elementRecordBoard, function(event) {
        html2canvas(elementRecordBoard).then(function(canvas) {
            var a = document.getElementById('aaa');
            a.href = canvas.toDataURL("image/png").replace("image/jpeg", "image/octet-stream");
            a.download = 'record-card.png';
            a.click();
        });
    });

    elementController.ontouchstart = function(event) {event.preventDefault()};
    elementMain.ontouchstart = function(event) {event.preventDefault()};
})();
