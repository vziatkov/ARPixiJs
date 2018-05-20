import * as PIXI from "PIXIJS";
import * as a from "PIXIProjection";
const b = a;

export class PixiApp{
    private app;
    private squares = [];
    private quad;
    private created = false;
    private containerSprite;
    private slots;

    constructor(width, height, transparent){
        this.app = new PIXI.Application(width, height, {transparent});
        const myCanvas = document.getElementById("slots");
        const textureCanvas = PIXI.Texture.fromCanvas(myCanvas);
        textureCanvas.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.slots = new PIXI.projection.Sprite2s(textureCanvas);
        const textureBackground = PIXI.Texture.WHITE;
        textureBackground.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.containerSprite = new PIXI.projection.Sprite2s(textureBackground);
        this.containerSprite.anchor.set(0.5);
        this.slots.anchor.set(0.5);
        this.slots.width = 10;
        this.slots.height = 10;
        this.containerSprite.width = width;
        this.containerSprite.height = height;
        this.app.stage.addChild(this.containerSprite);
        this.updateView([40, 100], [50, 50], [100, 60], [90, 110]);
        this.containerSprite.addChild(this.slots);
        const drawDiv = document.getElementById('augmentedReality');
        drawDiv.style.position = "absolute";
        drawDiv.style.top = "0";
        drawDiv.appendChild(this.app.view);
        this.app.ticker.add((deltaTime) => this.redraw(deltaTime));
        this.hideView();
    }

    private redraw(deltaTime){
        this.containerSprite.texture.update();
        this.slots.texture.update();
    }

    public updateView(point1, point2, point3, point4) {
        if(!this.created){
            this.squares = new Array();
            this.squares.push(this.createSquare(point1[0], point1[1], 0xffCCff));
            this.squares.push(this.createSquare(point2[0], point2[1], 0xff0000));
            this.squares.push(this.createSquare(point3[0], point3[1], 0xffff00));
            this.squares.push(this.createSquare(point4[0], point4[1], 0xCC00FF));
            this.quad = this.squares.map((s) => { return s.position });
            this.squares.forEach((s) => this.app.stage.addChild(s));
            this.app.ticker.add( (delta) => {
                this.containerSprite.proj.mapBilinearSprite(this.containerSprite, this.quad);
            });
            this.squares.forEach((s) => this.addInteraction(s));
            this.addInteraction(this.containerSprite);
            this.created = true;
            return;
        }
        this.squares[0].position.set(point1[0], point1[1]);
        this.squares[1].position.set(point2[0], point2[1]);
        this.squares[2].position.set(point3[0], point3[1]);
        this.squares[3].position.set(point4[0], point4[1]);
        this.containerSprite.visible = true;
    }

    public updateViewPT(point1, point2, point3, point4) {
        if(!this.created){
            this.squares = new Array();
            this.squares.push(this.createPoints(point1[0], point1[1]));
            this.squares.push(this.createPoints(point2[0], point2[1]));
            this.squares.push(this.createPoints(point3[0], point3[1]));
            this.squares.push(this.createPoints(point4[0], point4[1]));
            this.quad = this.squares.map((s) => { return s });
            this.app.ticker.add( (delta) => {
                this.containerSprite.proj.mapBilinearSprite(this.containerSprite, this.quad);
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

    private createSquare(x, y, tint) {
        var square = new PIXI.Sprite(PIXI.Texture.WHITE);
        square.tint = tint;
        square.factor = 1;
        square.anchor.set(0.5);
        square.position.set(x, y);
        return square;
    }

    private createPoints(x, y) {
        var pt = new PIXI.Point(x, y);
        return pt;
    }

// === INTERACTION CODE  ===

    private snap(obj) {
        obj.position.set(Math.min(Math.max(obj.position.x, 0), this.app.screen.width),
            Math.min(Math.max(obj.position.y, 0), this.app.screen.height));
    }

    private addInteraction(obj) {
        obj.interactive = true;
        obj
            .on('pointerdown', (e) => this.onDragStart(e))
            .on('pointerup', (e) => this.onDragEnd(e))
            .on('pointerupoutside', (e) => this.onDragEnd(e))
            .on('pointermove', (e) => this.onDragMove(e));
    }

    private onDragStart(event) {
        var obj = event.currentTarget;
        obj.dragData = event.data;
        obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
        obj.dragObjStart = new PIXI.Point();
        obj.dragObjStart.copy(obj.position);
        obj.dragGlobalStart = new PIXI.Point();
        obj.dragGlobalStart.copy(event.data.global);
        event.stopPropagation();
    }

    private onDragEnd(event) {
        var obj = event.currentTarget;
        this.snap(obj);
        obj.dragData = null;
        // set the interaction data to null
        event.stopPropagation();
    }

    private onDragMove(event) {
        var obj = event.currentTarget;
        var data = obj.dragData; // it can be different pointer!
            if(!data){ return };
            var dragPointerEnd = data.getLocalPosition(obj.parent);
            // DRAG
            obj.position.set(
                obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
                obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y)
            );
        }

}