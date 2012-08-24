STATE_PLAYING = 0;
STATE_GAMEOVER = 1;

var TAG_SPRITE_MANAGER = 1;
var PTM_RATIO = 32;

var GameLayer = cc.Layer.extend({
    _time: null,
    _player: null,
    _backSky: null,
    _backSkyHeight: 0,
    _backSkyRe: null,
    _backTileMap: null,
    _backTileMapHeight: 0,
    _backTileMapWidth: 0,
    _backTileMapRe: null,
    _levelManager: null,
    _tmpScore: 0,
    _isBackSkyReload: false,
    _isBackTileReload: false,
    lbScore: null,
    screenRect: null,
    explosionAnimation: [],
    _beginPos: cc.p(0, 0),
    _state: STATE_PLAYING,
    _isTouch: false,
    _nextShotTime: 0,
    //box2d
    _world: null,
    ctor: function () {
        cc.associateWithNative(this, cc.Layer);
    },
    init: function () {
        var bRet = false;
        if (this._super()) {

            var winSize = cc.Director.getInstance().getWinSize();

            //box2d
            var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

            // Construct a world object, which will hold and simulate the rigid bodies.
            this._world = new b2World(new b2Vec2(0, 10), true);
            this._world.SetContinuousPhysics(true);

            // Call the body factory which allocates memory for the ground body
            // from a pool and creates the ground box shape (also from a pool).
            // The body is also added to the world.
            //var groundBody = this.world.CreateBody(groundBodyDef);

            var fixDef = new b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2;

            var bodyDef = new b2BodyDef;

            //create ground
            bodyDef.type = b2Body.b2_staticBody;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(20, 2);
            // upper
            bodyDef.position.Set(10, winSize.height / PTM_RATIO + 1.8);
            this._world.CreateBody(bodyDef).CreateFixture(fixDef);
            // bottom
            bodyDef.position.Set(10, -1.8);
            this._world.CreateBody(bodyDef).CreateFixture(fixDef);

            fixDef.shape.SetAsBox(2, 14);
            // left
            bodyDef.position.Set(-1.8, 13);
            this._world.CreateBody(bodyDef).CreateFixture(fixDef);
            // right
            bodyDef.position.Set(26.8, 13);
            this._world.CreateBody(bodyDef).CreateFixture(fixDef);

            //Set up sprite
            /*
            var mgr = cc.SpriteBatchNode.create(s_image_hit, 150);
            this.addChild(mgr, 0, TAG_SPRITE_MANAGER);

            this.addNewSpriteWithCoords(cc.p(winSize.width / 2, winSize.height / 2));
            */
            /*

            var label = cc.LabelTTF.create("Tap screen", "Marker Felt", 32);
            this.addChild(label, 0);
            label.setColor(cc.c3b(0, 0, 255));
            label.setPosition(cc.p(screenSize.width / 2, screenSize.height - 50));
            */


            // reset global values
            LL.CONTAINER.ENEMIES = [];
            LL.CONTAINER.ENEMY_BULLETS = [];
            LL.CONTAINER.PLAYER_BULLETS = [];
            LL.CONTAINER.ROBOTS = [];
            LL.SCORE = 0;
            LL.LIFE = 4;
            this._state = STATE_PLAYING;

            //load up singleton magic
            Explosion.sharedExplosion();
            Enemy.sharedEnemy();
            Player.sharedPlayer();
            Robot.sharedRobot();

            this._levelManager = new LevelManager(this);
            this.initBackground();
            this.screenRect = cc.rect(0, 0, winSize.width, winSize.height + 10);

            // score
            this.lbScore = cc.LabelTTF.create("Score: 0", "Arial", 14, cc.SizeMake(80, 14), cc.TEXT_ALIGNMENT_RIGHT);
            this.lbScore.setAnchorPoint(cc.p(1, 0));
            this.addChild(this.lbScore, 1000);
            this.lbScore.setPosition(cc.p(winSize.width - 5, winSize.height - 20));

            // life counter in top left
            var playerTexture = cc.TextureCache.getInstance().addImage(s_image_player_sprite);
            var life = cc.Sprite.createWithTexture(playerTexture, cc.rect(0, 0, 100, 100));
            life.setScale(0.4);
            life.setPosition(cc.p(30, winSize.width - 20)); // 748));
            this.addChild(life, 1000, 5);

            // ship Life count
            this._lbLife = cc.LabelTTF.create("0", "Arial", 20);
            this._lbLife.setPosition(cc.p(60, winSize.width - 17)); //751));
            this._lbLife.setColor(cc.RED);
            this.addChild(this._lbLife, 1000);

            // ship
            this._player = new Player();
            LL.CONTAINER.PLAYER = this.addNewBody(this._player);
            //LL.CONTAINER.PLAYER = this.addNewBody(_player);
            this.addChild(this._player, this._player.zOrder, LL.UNIT_TAG.PLAYER);

            // accept touch now!

            var t = cc.config.deviceType;
            if (t == 'browser') {
                this.setTouchEnabled(true);
                this.setKeyboardEnabled(true);
            } else if (t == 'desktop') {
                this.setMouseEnabled(true);
            } else if (t == 'mobile') {
                this.setTouchEnabled(true);
            }

            // schedule
            this.scheduleUpdate();
            this.schedule(this.scoreCounter, 1);

            if (LL.SOUND) {
                cc.AudioEngine.getInstance().playBackgroundMusic(s_music_theme, true);
            }

            bRet = true;
        }
        return bRet;
    },
    addNewBody: function (thesprite) {

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(thesprite.getPosition().x / PTM_RATIO, thesprite.getPosition().y / PTM_RATIO);
        bodyDef.userData = thesprite;
        var body = this._world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var spriteShape = new b2PolygonShape();
        spriteShape.SetAsBox(thesprite.getBoundingBoxToWorld().size.width / PTM_RATIO,
            thesprite.getBoundingBoxToWorld().size.height / PTM_RATIO); //These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = spriteShape;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.3;
        body.CreateFixture(fixtureDef);
        return body;

    },
    addNewSpriteWithCoords: function (p) {
        //UXLog(L"Add sprite %0.2f x %02.f",p.x,p.y);
        var batch = this.getChildByTag(TAG_SPRITE_MANAGER);

        //We have a 64x64 sprite sheet with 4 different 32x32 images.  The following code is
        //just randomly picking one of the images
        var idx = (cc.RANDOM_0_1() > .5 ? 0 : 1);
        var idy = (cc.RANDOM_0_1() > .5 ? 0 : 1);
        var sprite = cc.Sprite.createWithTexture(batch.getTexture(), cc.rect(32 * idx, 32 * idy, 32, 32));
        batch.addChild(sprite);

        sprite.setPosition(cc.p(p.x, p.y));

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
        bodyDef.userData = sprite;
        var body = this._world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(0.5, 0.5); //These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.3;
        body.CreateFixture(fixtureDef);

    },
    scoreCounter: function () {
        if (this._state == STATE_PLAYING) {
            this._time++;

            var minute = 0 | (this._time / 60);
            var second = this._time % 60;
            minute = minute > 9 ? minute : "0" + minute;
            second = second > 9 ? second : "0" + second;
            var curTime = minute + ":" + second;
            this._levelManager.loadLevelResource(this._time);
        }
    },
    onTouchesBegan: function (touches, event) {
        this._isTouch = true;
    },
    onTouchesMoved: function (touches, event) {
        if (this._isTouch) {
            this.processEvent(touches[0]);
        }
    },
    onTouchesEnded: function (touches, event) {
        this._isTouch = false;

        //Add a new body/atlas sprite at the touched location
        for (var it = 0; it < touches.length; it++) {
            var touch = touches[it];

            if (!touch)
                break;

            //var location = touch.getLocation();
            //location = cc.Director.getInstance().convertToGL(location);
            //this.addNewSpriteWithCoords(location);
        }
    },
    onMouseDragged: function (event) {
        if (this._isTouch) {
            this.processEvent(event);
        }
    },

    processEvent: function (event) {
        if (this._state == STATE_PLAYING) {

            //set shooting angle based on mouse
            var rads = cc.pAngle(this._player.getPosition(), event.getLocation());
            this._player.shootingAngle = (-1 * cc.RADIANS_TO_DEGREES(rads));
            //todo may not need the shooting angle
            this._player.setRotation(this._player.shootingAngle);
            //todo smooth out with action

            //grenade
            if (LL.KEYS[cc.KEY.shift]
                && pos.y <= winSize.height
                && LL.CONTAINER.PLAYER_GRENADES.length == 0
                && LL.CONTAINER.containsPowerup(LL.POWERUP.GRENADES)) {
                var delta = event.getDelta();
                var playerPos = this._player.getPosition();
                var targetPos = cc.pAdd(playerPos, delta);
                targetPos = cc.pClamp(targetPos, cc.POINT_ZERO, cc.p(winSize.width, winSize.height));

                var grenade = new Grenade();
                grenade.setPosition(playerPos);
                grenade.targetPosition = targetPos;
                this.addChild(grenade, 3000, LL.UNIT_TAG.PLAYER_GRENADE);

                var lngth = cc.pLength(delta);
                var tmpAction = cc.MoveTo.create(grenade.travelFactor * lngth, targetPos);
                grenade.runAction(tmpAction);
                LL.CONTAINER.PLAYER_GRENADES.push(grenade);
            }
        }
    },

    onKeyDown: function (e) {
        LL.KEYS[e] = true;
    },

    onKeyUp: function (e) {
        LL.KEYS[e] = false;
    },

    update: function (dt) {
        if (this._state == STATE_PLAYING) {
            LL.GameController.getInstance().setGameTime(dt);
            this.checkIsCollide();
            this.removeInactiveUnit(dt);
            this.checkIsReborn();
            this.updateUI();

            this.setView(this._player.getPosition());

            this.shootItUp();

            /*BOX2D*/
            /*//It is recommended that a fixed time step is used with Box2D for stability
            //of the simulation, however, we are using a variable time step here.
            //You need to make an informed choice, the following URL is useful
            //http://gafferongames.com/game-physics/fix-your-timestep/

            var velocityIterations = 8;
            var positionIterations = 1;

            // Instruct the world to perform a single step of simulation. It is
            // generally best to keep the time step and iterations fixed.
            this._world.Step(dt, velocityIterations, positionIterations);

            //Iterate over the bodies in the physics world
            for (var b = this._world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
            //Synchronize the AtlasSprites position and rotation with the corresponding body
            var myActor = b.GetUserData();
            myActor.setPosition(cc.p(b.GetPosition().x * PTM_RATIO, b.GetPosition().y * PTM_RATIO));
            myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));
            //console.log(b.GetAngle());
            }
            }*/
        }

        //if( cc.config.deviceType == 'browser' )
        //   cc.$("#cou").innerHTML = "Ship:" + 1 + ", Enemy: " + LL.CONTAINER.ENEMIES.length + ", Bullet:" + LL.CONTAINER.ENEMY_BULLETS.length + "," + LL.CONTAINER.PLAYER_BULLETS.length + " all:" + this.getChildren().length;
    },
    shootItUp: function () {
        //bullet hell
        if ((LL.KEYS[cc.KEY.space] || LL.CONTAINER.containsPowerup(LL.POWERUP.BULLET_AUTO))
            && this._nextShotTime < LL.GameController.getInstance().getGameTime()) {
            // gotta wait
            this._nextShotTime = LL.GameController.getInstance().getGameTime() + this._player.shootingWaitPeriod;

            if (isNaN(this._player.shootingAngle)) return;

            this._player.shoot();
        } else {
            //stop shooting
        }
    },
    setView: function (position) {
        var winSize = cc.Director.getInstance().getWinSize();

        var x = Math.max(position.x, winSize.width / 2);
        var y = Math.max(position.y, winSize.height / 2);
        x = Math.min(x, (this._backTileMapWidth) - winSize.width / 2);
        y = Math.min(y, (this._backTileMapHeight) - winSize.height / 2);
        var actualPosition = cc.p(x, y);

        var centerOfView = cc.p(winSize.width / 2, winSize.height / 2);
        var viewPoint = cc.pSub(centerOfView, actualPosition);
        this._backTileMap.setPosition(viewPoint);
    },
    checkIsCollide: function () {
        var selChild, bulletChild;
        //check collide
        var i = 0;
        for (i = 0; i < LL.CONTAINER.ENEMIES.length; i++) {
            selChild = LL.CONTAINER.ENEMIES[i];
            for (var j = 0; j < LL.CONTAINER.PLAYER_BULLETS.length; j++) {
                bulletChild = LL.CONTAINER.PLAYER_BULLETS[j];
                if (this.collide(selChild, bulletChild)) {
                    bulletChild.hurt();
                    selChild.hurt();
                }
                if (!cc.rectIntersectsRect(this.screenRect, bulletChild.getBoundingBox())) {
                    bulletChild.destroy();
                }
            }
            if (this.collide(selChild, this._player)) {
                if (this._player.active) {
                    selChild.hurt();
                    this._player.hurt();
                }
            }
            if (!cc.rectIntersectsRect(this.screenRect, selChild.getBoundingBox())) {
                selChild.destroy();
            }
        }

        for (i = 0; i < LL.CONTAINER.ENEMY_BULLETS.length; i++) {
            selChild = LL.CONTAINER.ENEMY_BULLETS[i];
            if (this.collide(selChild, this._player)) {
                if (this._player.active) {
                    selChild.hurt();
                    this._player.hurt();
                }
            }
            if (!cc.rectIntersectsRect(this.screenRect, selChild.getBoundingBox())) {
                selChild.destroy();
            }
        }
    },
    removeInactiveUnit: function (dt) {
        var selChild, layerChildren = this.getChildren();
        for (var i in layerChildren) {
            selChild = layerChildren[i];
            if (selChild) {
                if (typeof selChild.update == 'function') {
                    selChild.update(dt);
                    var tag = selChild.getTag();
                    if ((tag == LL.UNIT_TAG.PLAYER) || (tag == LL.UNIT_TAG.PLAYER_BULLET) ||
                        (tag == LL.UNIT_TAG.ENEMY) || (tag == LL.UNIT_TAG.ENMEY_BULLET)) {
                        if (selChild && !selChild.active) {
                            selChild.destroy();
                        }
                    }
                }
            }
        }
    },
    checkIsReborn: function () {
        if (LL.LIFE > 0 && !this._player.active) {
            // ship
            this._player = new Player();
            this.addChild(this._player, this._player.zOrder, LL.UNIT_TAG.PLAYER);
        }
        else if (LL.LIFE <= 0 && !this._player.active) {
            this._state = STATE_GAMEOVER;
            // XXX: needed for JS bindings.
            this._player = null;
            this.runAction(cc.Sequence.create(
                cc.DelayTime.create(0.2),
                cc.CallFunc.create(this, this.onGameOver)));
        }
    },
    updateUI: function () {
        if (this._tmpScore < LL.SCORE) {
            this._tmpScore += 5;
        }
        this._lbLife.setString(LL.LIFE);
        this.lbScore.setString("Score: " + this._tmpScore);
    },
    collide: function (a, b) {
        var aRect = a.collideRect();
        var bRect = b.collideRect();
        if (cc.rectIntersectsRect(aRect, bRect)) {
            return true;
        }
    },
    initBackground: function () {
        // bg
        /*this._backSky = cc.Sprite.create(s_image_background_01);
        this._backSky.setAnchorPoint(cc.p(0, 0));
        this._backSkyHeight = this._backSky.getContentSize().height;
        this.addChild(this._backSky, -10);
        */
        //tilemap
        this._backTileMap = cc.TMXTiledMap.create(s_level_01);
        this.addChild(this._backTileMap, -9);
        this._backTileMapHeight = this._backTileMap.getMapSize().height * this._backTileMap.getTileSize().height;
        this._backTileMapWidth = this._backTileMap.getMapSize().width * this._backTileMap.getTileSize().width;

        //start scrolling
        /*this._backSkyHeight -= 48;
        this._backSky.runAction(cc.MoveBy.create(3, cc.p(0, -48)));*/
        //this._backTileMapHeight -= 200;
        //this._backTileMap.runAction(cc.MoveBy.create(3, cc.p(0, -200)));

        // this.schedule(this.movingBackground, 3);
    },
    movingBackground: function () {
        this._backSky.runAction(cc.MoveBy.create(3, cc.p(0, -48)));
        this._backSkyHeight -= 48;
        this._backTileMap.runAction(cc.MoveBy.create(3, cc.p(0, -200)));
        this._backTileMapHeight -= 200;

        if (this._backSkyHeight <= winSize.height) {
            if (!this._isBackSkyReload) {
                this._backSkyRe = cc.Sprite.create(s_image_background_01);
                this._backSkyRe.setAnchorPoint(cc.p(0, 0));
                this.addChild(this._backSkyRe, -10);
                this._backSkyRe.setPosition(cc.p(0, winSize.height));
                this._isBackSkyReload = true;
            }
            this._backSkyRe.runAction(cc.MoveBy.create(3, cc.p(0, -48)));
        }
        if (this._backSkyHeight <= 0) {
            this._backSkyHeight = this._backSky.getContentSize().height;
            this.removeChild(this._backSky, true);
            this._backSky = this._backSkyRe;
            this._backSkyRe = null;
            this._isBackSkyReload = false;
        }

        if (this._backTileMapHeight <= winSize.height) {
            if (!this._isBackTileReload) {
                this._backTileMapRe = cc.TMXTiledMap.create(s_level_01);
                this.addChild(this._backTileMapRe, -9);
                this._backTileMapRe.setPosition(cc.p(0, winSize.height));
                this._isBackTileReload = true;
                var t = this._backTileMapRe.objectGroupNamed("objects");
            }
            this._backTileMapRe.runAction(cc.MoveBy.create(3, cc.p(0, -200)));
        }
        if (this._backTileMapHeight <= 0) {
            this._backTileMapHeight = this._backTileMapRe.getMapSize().height * this._backTileMapRe.getTileSize().height;
            this.removeChild(this._backTileMap, true);
            this._backTileMap = this._backTileMapRe;
            this._backTileMapRe = null;
            this._isBackTileReload = false;
        }
    },
    onGameOver: function () {
        var scene = cc.Scene.create();
        scene.addChild(GameOver.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    }
});

GameLayer.create = function () {
    var sg = new GameLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameLayer.create();
    scene.addChild(layer, 1);
    return scene;
};
