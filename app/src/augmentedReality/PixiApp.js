import * as PIXI from "PIXIJS";
import * as a from "PIXIProjection";
/**
 * TODO apply PIXIprojection, define other way
 */
const b = a;

export class PixiApp {
    private app;
    private squares = [];
    private created = false;
    private containerSprite;
    private slots;

    constructor(width, height, transparent, clickHandler){
        this.app = new PIXI.Application(width, height, {transparent});
        const myCanvas = document.getElementById("slots");
        const drawDiv = document.getElementById('augmentedReality');
        const textureCanvas = PIXI.Texture.fromCanvas(myCanvas);
        textureCanvas.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.slots = new PIXI.projection.Sprite2s(textureCanvas);
        const textureBackground = PIXI.Texture.WHITE;
        textureBackground.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.containerSprite = new PIXI.projection.Sprite2s(textureBackground);
        this.containerSprite.tint = 0x177eed;
        this.containerSprite.anchor.set(0.5);
        this.slots.anchor.set(0.5);
        /**
         * TODO define why scale wrong by default
         */
        this.slots.width = 10;
        this.slots.height = 10;
        this.containerSprite.width = width;
        this.containerSprite.height = height;
        this.app.stage.addChild(this.containerSprite);
        this.containerSprite.addChild(this.slots);
        /**
         * TODO move to css files
         */
        drawDiv.style.position = "absolute";
        drawDiv.style.top = "0";
        drawDiv.appendChild(this.app.view);
        this.app.ticker.add((deltaTime) => this.redraw(deltaTime));
        this.hideView();
        this.initClickListeners(this.slots, clickHandler);
    }

    private redraw(deltaTime){
        this.containerSprite.texture.update();
        this.slots.texture.update();
    }

    /**
     * redraw projection. This call by MarkerDetector
     * @param point1
     * @param point2
     * @param point3
     * @param point4
     */
    public updateViewPT(point1, point2, point3, point4) {
        if(!this.created){
            this.squares = new Array();
            this.squares.push(this.createPoints(point1[0], point1[1]));
            this.squares.push(this.createPoints(point2[0], point2[1]));
            this.squares.push(this.createPoints(point3[0], point3[1]));
            this.squares.push(this.createPoints(point4[0], point4[1]));
            this.app.ticker.add( (delta) => {
                this.containerSprite.proj.mapBilinearSprite(this.containerSprite, this.squares);
            });
            this.created = true;
            return;
        }
        this.squares[0].set(point1[0], point1[1]);
        this.squares[1].set(point2[0], point2[1]);
        this.squares[2].set(point3[0], point3[1]);
        this.squares[3].set(point4[0], point4[1]);
        this.containerSprite.visible = true;
    }

    private hideView() {
        this.containerSprite.visible = false;
    }

    private createPoints = (x, y) => new PIXI.Point(x, y);

    private initClickListeners(sprite, callback) {
        sprite.interactive = true;
        sprite.on('pointerdown', (e) => callback());
    }
}