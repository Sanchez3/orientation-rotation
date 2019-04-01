import * as PIXI from 'pixi.js'
import 'pixi-spine'
import TweenMax from 'gsap'
import PixiPlugin from "gsap/PixiPlugin";

import * as THREE from 'three'

window.THREE = THREE || {};
// import { OrbitControls, DeviceOrientationControls } from 'three'
import OrbitControls from './OrbitControls.js';
import DeviceOrientationControls from './DeviceOrientationControls.js';
import LegacyJSONLoader from './LegacyJSONLoader.js'
// import 'three-orbit-controls'



class Game {
    constructor() {

        this.init();
    }
    init() {
        this.initCanvas();
    }
    preload() {}

    initCanvas() {
        var that = this;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;

        var config = {
            width: wWidth,
            height: wHeight,
            autoResize: true,
            transparent: true,
            forceCanvas: false,
            antialias: true,
            resolution: window.devicePixelRatio,
            preserveDrawingBuffer: true,
            view: document.getElementById('canvas-element')
        }
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        var app = new PIXI.Application(config);
        app.renderer.view.style['touch-action'] = 'auto';

        app.renderer.plugins.interaction.autoPreventDefault = false;
        this.app = app;
        // app.renderer.autoResize = true;
        // var  data = require('@/assets/img/p0-bg.png');
        app.loader
            .add('p0-bg', './assets/img/p0-bg.png')
            .add('start-btn0', './assets/img/start-btn0.png')
            .add('start-btn1', './assets/img/start-btn1.png')
            .add('p0-l0', './assets/img/p0-l0.png')
            .add('p0-l1', './assets/img/p0-l1.png')
            .add('p-sprites', './assets/img/p-sprites.json')
            .add('tfont', './assets/img/tfont.fnt')
            .add('southstart', './assets/img/southstart.json')
            .add('northstart', './assets/img/northstart.json')
            .load(onBoot);
        var stage0;


        var progressText1;
        var progressL_mask;

        var startBtn;

        function onBoot() {
            var bg = new PIXI.Sprite.fromImage('p0-bg');
            bg.anchor.set(0.5);
            bg.x = app.screen.width / 2;
            bg.y = app.screen.height / 2;
            bg.scale.set(Math.max(window.cfg.xscale, window.cfg.yscale))
            app.stage.addChild(bg);

            stage0 = new PIXI.Container();
            app.stage.addChild(stage0);
            stage0.scale.set(window.cfg.scale);




            // var t0 = new PIXI.Sprite.fromImage('p0-t0');
            // t0.anchor.set(0.5, 0);
            // t0.x = window.cfg.swidth / 2;
            // t0.y = window.cfg.sheight * 0.172;


            var progressC = new PIXI.Container();
            stage0.addChild(progressC)
            progressText1 = new PIXI.extras.BitmapText('00', { font: '60px tfont', align: 'left' });
            // progressText1.anchor.set(0.5);
            progressText1.scale.set(47 / 60);
            progressText1.x = window.cfg.swidth * 0.844;
            progressText1.y = window.cfg.sheight * 0.657;

            var progressText2 = new PIXI.extras.BitmapText('%', { font: '60px tfont', align: 'left' });
            progressText2.scale.set(30 / 60);
            progressText2.x = window.cfg.swidth * 0.92;
            progressText2.y = window.cfg.sheight * 0.666;
            // progressText2.anchor.set(0.5);

            progressC.addChild(progressText1, progressText2);

            var progressBg = new PIXI.Sprite.fromImage('p0-l0');
            progressBg.anchor.set(0.5, 0);
            progressBg.x = window.cfg.swidth / 2;
            progressBg.y = window.cfg.sheight * 0.654;

            var progressL = new PIXI.Sprite.fromImage('p0-l1');
            progressL.x = window.cfg.swidth / 2;
            progressL.y = window.cfg.sheight * 0.661;
            progressL.anchor.set(0.5, 0);
            // progressL.scale.set(0,1)
            progressL_mask = new PIXI.Sprite.fromImage('p0-l1');
            progressL_mask.x = window.cfg.swidth / 2 - progressL_mask.width;
            progressL_mask.y = window.cfg.sheight * 0.663;
            progressL_mask.anchor.set(0.5, 0);
            progressL.mask = progressL_mask;

            startBtn = new PIXI.Sprite.fromImage('start-btn0');
            startBtn.anchor.set(0.5, 0);
            startBtn.alpha = 0;
            startBtn.x = window.cfg.swidth / 2;
            startBtn.y = window.cfg.sheight * 0.827;
            var startButton = PIXI.Texture.fromImage('start-btn0');
            var startButtonDown = PIXI.Texture.fromImage('start-btn1');
            startBtn.interactive = true;
            startBtn.buttonMode = true;

            startBtn.on('pointerdown', function() {
                // this.isdown = true;
                this.texture = startButtonDown;
            })
            startBtn.on('click', function() {
                // this.isdown = true;
                // this.texture = startButtonDown;
                // this.alpha = 1;
                startBtn.interactive = false;
                that.initThree()
                console.log('go')
            })
            startBtn.on('tap', function() {
                // this.isdown = true;
                // this.texture = startButtonDown;
                // this.alpha = 1;
                startBtn.interactive = false;
                that.initThree()
                console.log('go')
            })
            startBtn.on('pointerover', function() {
                this.texture = startButtonDown;
            })
            startBtn.on('pointerout', function() {
                this.texture = startButton;
            });
            startBtn.on('pointerupoutside', function() {
                this.texture = startButton;
            });
            startBtn.on('pointerup', function() {
                this.texture = startButton;
            });

            // progressBg.scale.set(window.cfg.scale)
            var res = app.loader.resources;

            var pigContainer0 = new PIXI.Container();
            pigContainer0.y = window.cfg.sheight * 0.1;
            var npig = new PIXI.spine.Spine(res['northstart'].spineData);
            var localRect0 = npig.getLocalBounds();
            npig.position.set(localRect0.x, -localRect0.y);
            pigContainer0.addChild(npig);
            npig.state.setAnimation(0, 'animation', true);

            var pigContainer1 = new PIXI.Container();
            pigContainer1.y = window.cfg.sheight * 0.1;
            var spig = new PIXI.spine.Spine(res['southstart'].spineData);
            var localRect1 = spig.getLocalBounds();
            spig.position.set(-localRect1.x, -localRect1.y);
            pigContainer1.addChild(spig);
            setTimeout(function() {
                spig.state.setAnimation(0, 'animation', true);
            }, 1000)


            stage0.addChild(progressBg, progressL, progressL_mask, startBtn, pigContainer0, pigContainer1);

            var sprites = new PIXI.particles.ParticleContainer(20, {
                scale: true,
                position: true,
                rotation: true,
                uvs: true,
                alpha: true
            });
            app.stage.addChild(sprites);
            var maggots = [];
            var totalSprites = app.renderer instanceof PIXI.WebGLRenderer ? 20 : 10;
            var loadsframes = [];
            for (var i = 0; i < totalSprites; i++) {
                var rd = Math.floor(Math.random() * 7)
                // create a new Sprite
                var p = PIXI.Sprite.fromFrame(`p0-p${rd}.png`);
                // set the anchor point so the texture is centerd on the sprite
                p.anchor.set(0.5);
                // scatter them all
                p.x = Math.random() * app.screen.width;
                p.y = -80;
                p.scale.set(window.cfg.scale);
                // p.tint = Math.random() * 0x808080;

                // create a random direction in radians
                p.direction = Math.random() * Math.PI * 2;

                // this number will be used to modify the direction of the sprite over time
                p.turningSpeed = Math.random() - 0.5;

                // create a random speed between 0 - 2, and these maggots are slooww
                p.speed = (2 + Math.random() * 2) * 0.5;

                p.offset = Math.random() * 100;

                // finally we push the p into the maggots array so it it can be easily accessed later
                maggots.push(p);

                sprites.addChild(p);
            }

            var pBoundsPadding = 100;
            var pBounds = new PIXI.Rectangle(
                -pBoundsPadding,
                -pBoundsPadding,
                app.screen.width + pBoundsPadding * 2,
                app.screen.height + pBoundsPadding * 2
            );
            var tick = 0;
            app.ticker.add(function() {

                // iterate through the sprites and update their position
                for (var i = 0; i < maggots.length; i++) {

                    var p = maggots[i];
                    // p.scale.y = 0.95 + Math.sin(tick + p.offset) * 0.05;
                    p.direction += p.turningSpeed * 0.01;
                    p.x += Math.sin(p.direction) * p.speed;
                    p.y += Math.cos(p.direction) * p.speed;
                    p.rotation = -p.direction + Math.PI;

                    // wrap the maggots
                    if (p.x < pBounds.x) {
                        p.x += pBounds.width;
                    } else if (p.x > pBounds.x + pBounds.width) {
                        p.x -= pBounds.width;
                    }

                    if (p.y < pBounds.y) {
                        // p.y += pBounds.height;
                    } else if (p.y > pBounds.y + pBounds.height) {
                        // p.y=
                        p.y -= pBounds.height;
                    }
                }

                // increment the ticker
                tick += 0.1;
            });


            app.loader.add('airplane', './assets/models/airplane.json')
                .add('boat', './assets/models/boat.json')
                .add('num-sprite', './assets/img/num-sprite.json')
                .add('countdown-sprite', './assets/img/countdown-sprite.json')
                .add('coin-sprite', './assets/img/coin-sprite.json')
                .add('starrynight', './assets/img/starrynight.jpg')

            app.loader.onProgress.add(onfileComplete)
            app.loader.onComplete.add(onLoadComplete)
        }
        var v = { p: 0 };

        function onfileComplete(e) {
            var _p = Math.round(e.progress);
            TweenMax.to(v, 0.1, {
                p: _p,
                ease: Power3.easeIn,
                onUpdate: function() {
                    var val = Math.round(v.p);
                    val = val < 10 ? '0' + val : val;
                    progressText1.text = val;
                    if (val == 100) {
                        progressText1.x = window.cfg.swidth * 0.82;
                    }
                    progressL_mask.x = window.cfg.swidth / 2 - progressL_mask.width + progressL_mask.width * val / 100;
                }
            })
        }

        function onLoadComplete() {
            TweenMax.to(startBtn, 0.3, { alpha: 1, delay: 0.1 })
            // startBtn.alpha=1;
            // that.initThree();
            // that.initStage2(1)
        }

        window.addEventListener('resize', resize)

        function resize() {

            var w = document.getElementsByClassName('canvas-wrapper')[0].clientWidth;
            var h = document.getElementsByClassName('canvas-wrapper')[0].clientHeight;
            // var s = w / 750
            // var h =  h/s
            app.renderer.resize(w, h)
            app.render()
        }

    }
    initThree() {
        var that = this;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        var rr = Math.floor(Math.random() * 180)
        var rx = THREE.Math.degToRad(Math.round(rr));
        var ry = THREE.Math.degToRad(Math.round(rr));
        var rz = 0;
        // objCopy.rotation.reorder('YXZ');
        var airplaneMesh, boatMesh;
        var app = that.app;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, wWidth / wHeight, 0.1, 3000);
        // var ctx = document.getElementById('canvas-element').getContext('webgl');
        var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
        renderer.setSize(wWidth, wHeight);

        camera.position.set(0, 5, -15);
        camera.lookAt(scene.position);
        // scene.add(camera);
        scene.add(camera);
        var pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        var boatContainer = new THREE.Object3D();
        var airplaneContainer = new THREE.Object3D();
        scene.add(airplaneContainer);
        var orbitControls = new THREE.OrbitControls(camera, document.getElementById('canvas-element'))
        // orbitControls.minDistance = 75;
        // orbitControls.maxDistance = 300;
        // orbitControls.enablePan = false;
        orbitControls.target.set(0, 0, 0);
        // orbitControls.enableRotate = false
        orbitControls.update()
        scene.add(new THREE.GridHelper(1000, 100));
        scene.add(new THREE.AxesHelper(20));
        var controls;
        var startFlag = false;

        var light = new THREE.AmbientLight(0x404040); // Soft white light
        scene.add(light);



        var threeAssets = [];
        var manager = new THREE.LoadingManager();
        manager.onStart = function(url, itemsLoaded, itemsTotal) {
            // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };

        manager.onLoad = function() {
            console.log('Loading complete!');
            threecallback && threecallback();
        };

        manager.onProgress = function(url, itemsLoaded, itemsTotal) {
            // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
            var per = parseInt(itemsLoaded / itemsTotal * 100);
            console.log(per)
            // $("#percentage").html(per + ' %');
        };

        manager.onError = function(url) {
            console.log('There was an error loading ' + url);
        };

        function threecallback() {

            var sgeometry = new THREE.SphereBufferGeometry(1500, 40, 40);
            sgeometry.scale(-1, 1, 1);
            var starrynight = threeAssets['starrynight'];
            var smaterial = new THREE.MeshBasicMaterial({
                map: starrynight,
                fog: false,
                transparent: true,
                opacity: 1
            });

            var smesh = new THREE.Mesh(sgeometry, smaterial);

            smesh.rotation.y = -Math.PI / 2;


            var texture = threeAssets['color'];

            var boatGeo = threeAssets['boat'];
            var boatMat = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                specular: 0x000000,
                shininess: 0
            });

            var boatMesh = new THREE.Mesh(boatGeo, boatMat);
            boatContainer.add(boatMesh);
            boatContainer.rotation.set(
                rx,
                ry,
                rz);

            // boatMesh.position.y = Math.sin(this.angle) * 1.5;
            boatContainer.position.set(15, 0, 0);



            var airplaneGeo = threeAssets['airplane'];
            var airplaneMat = new THREE.MeshStandardMaterial({
                color: 0x646464,
                roughness: .83,
                metalness: .5,
                emissive: 0xc8c8c8,
                map: texture,
                emissiveMap: texture,
                side: THREE.DoubleSide
            });


            airplaneMesh = new THREE.Mesh(airplaneGeo, airplaneMat);
            // airplaneMesh.position.set(0,0,0);

            var box = new THREE.BoxHelper(airplaneMesh);
            airplaneMesh.add(box);
            airplaneContainer.add(airplaneMesh);

            airplaneContainer.rotateX(rx)
            airplaneContainer.rotateY(ry)


            airplaneContainer.position.set(0, 1, 0);
            // airplaneMesh.rotation.y = Math.PI;
            // camera.lookAt(boatContainer.position);

            // rx = Math.random() * 2 * Math.PI;
            // ry = Math.random() * 2 * Math.PI;
            // rz = Math.random() * 2 * Math.PI;
            scene.add(smesh, airplaneContainer);

            // navigator.permissions.query()
            controls = new THREE.DeviceOrientationControls(airplaneMesh);
            controls.disconnect();
            // airplaneContainer.rotateX(rx);


            // const id = setTimeout(() => alert('Enable device orientation in Settings > Safari > Motion & Orientation Access.'), 500);

            // window.addEventListener('deviceorientation', event => {
            //     clearTimeout(id);
            //     // ...
            // });

            // airplaneMesh.rotation.set(rx, ry, rz);
        }
        var objectLoader = new THREE.LegacyJSONLoader(manager);
        objectLoader.load('./assets/models/airplane.json', function(rs) {
            threeAssets['airplane'] = rs;
        });
        objectLoader.load('./assets/models/boat.json', function(rs) {
            threeAssets['boat'] = rs;
        });
        var textureLoader = new THREE.TextureLoader(manager);
        textureLoader.load('./assets/models/color.jpg', function(rs) {
            threeAssets['color'] = rs;
        });
        textureLoader.load('./assets/img/starrynight.jpg', function(rs) {
            threeAssets['starrynight'] = rs;
        });




        var THREE_TEXTURE = PIXI.BaseTexture.fromCanvas(renderer.domElement, PIXI.SCALE_MODES.LINEAR);
        var THREE_SPRITE = new PIXI.Sprite.from(new PIXI.Texture(THREE_TEXTURE));
        app.stage.addChild(THREE_SPRITE);

        var game0 = new PIXI.Container();
        game0.scale.set(window.cfg.scale);
        app.stage.addChild(game0);

        var countdownframes = [];
        for (var i = 0; i < 12; i++) {
            var val = i < 10 ? '0' + i : i;
            countdownframes.push(PIXI.Texture.fromFrame(`countdown_${val}.png`));
        }
        var numframes = [];
        for (var i = 0; i < 5; i++) {
            numframes.push(PIXI.Texture.fromFrame(`${i+1}.png`));
        }



        var countSprite = new PIXI.extras.AnimatedSprite(countdownframes);
        countSprite.anchor.set(0.5);
        countSprite.x = window.cfg.swidth / 2;
        countSprite.y = window.cfg.sheight / 2;
        game0.addChild(countSprite)
        countSprite.loop = false;
        countSprite.animationSpeed = 12 / 60;
        // countSprite.gotoAndStop(11);
        countSprite.play()


        var numSprite = new PIXI.extras.AnimatedSprite(numframes);
        numSprite.anchor.set(0.5);
        numSprite.x = window.cfg.swidth / 2;
        numSprite.y = window.cfg.sheight / 2;
        game0.addChild(numSprite)
        numSprite.loop = false;
        numSprite.animationSpeed = 1 / 60;
        numSprite.alpha = 1;
        numSprite.play();
        // TweenMax.to(numSprite.scale, 1, {x:0, y:0,repeat:5});
        TweenMax.from(numSprite, 1, { pixi: { scaleX: 0, scaleY: 0 }, repeat: 5, ease: Strong.easeInOut })
        numSprite.onComplete = function() {
            numSprite.alpha = 0;
        }

        numSprite.onFrameChange = function(n) {
            if (n === 4) {
                numSprite.onFrameChange = null
                countSprite.animationSpeed = -10 / 60;
                countSprite.play();
                countSprite.onComplete = function() {
                    // numSprite.alpha = 1;
                    controls.connect();
                    startFlag = true;
                }
            }
        };

        var coinframes = [];
        for (var i = 0; i < 16; i++) {
            var val = i < 10 ? '0' + i : i;
            coinframes.push(PIXI.Texture.fromFrame(`coin_${val}.png`));
        }
        var coinSprite = new PIXI.extras.AnimatedSprite(coinframes);
        coinSprite.anchor.set(0.5);
        coinSprite.x = window.cfg.swidth / 2;
        coinSprite.y = window.cfg.sheight / 2;
        game0.addChild(coinSprite);
        coinSprite.animationSpeed = 16 / 60;
        coinSprite.play();
        coinSprite.alpha = 0;


        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        var lasetE;

        function isParallel(v1, v2) {

            var dotValue = v1.dot(v2);

            var crossValue = new THREE.Vector3();
            crossValue.crossVectors(v1, v2)
            // value = value.dot(v2.normalize());
            console.log(crossValue)
            if (crossValue.x.toFixed(2) == 0 && crossValue.y.toFixed(2) == 0 && crossValue.z.toFixed(2) == 0 && dotValue > 0)
                return true;
            return false;

        }

        var animate = function() {
            requestAnimationFrame(animate);
            if (controls) {
                controls.update();
            }

            if (startFlag && airplaneMesh) {
                var v1 = new THREE.Vector3(0, 0, 1);
                var v2 = new THREE.Vector3(0, 0, 1);
                //object's positive z-axis
                airplaneMesh.getWorldDirection(v1);

                if (isParallel(v1, v2) && airplaneMesh.rotation.z >= 0) {
                    startFlag = false
                    console.log('finish')
                    controls.dispose();
                    // TweenMax.to(airplaneContainer.rotation, 0.6, { x: 0, y: 0, z: 0 });
                    // airplaneMesh.localToWorld(new THREE.Vector3(0, 0, 1))
                    // airplaneMesh.rotateOnWorldAxis()
                    TweenMax.to(airplaneContainer.position, 0.6, {
                        x: 0,
                        y: -2,
                        z: 0,
                        onComplete: function() {
                            TweenMax.to(coinSprite, 0.6, { alpha: 1 })
                        }
                    });
                    // alert('Finish')


                    // TweenMax.to(cv, 0.5, {
                    //     x: boatContainer.position.x,
                    //     y: boatContainer.position.y,
                    //     z: boatContainer.position.z,
                    //     onUpdate: function() {
                    //         camera.lookAt(cv);
                    //     }
                    // })
                }
            }
            renderer.render(scene, camera);


            THREE_TEXTURE.update();
        };

        animate();
    }

    goNext(p, s) {
        TweenMax.set(s, {
            alpha: 1,
            onComplete: function() {
                p.alpha = 0;
                s.state.setAnimation(0, 'animation', false);
            }
        })
    }
    create() {
        var that = this;
    }
}


export default Game;