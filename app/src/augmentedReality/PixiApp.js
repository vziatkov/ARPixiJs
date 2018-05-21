// eslint-disable-next-line
import * as PIXI from "PIXIJS";
// eslint-disable-next-line
import * as a from "PIXIProjection";
/**
 * TODO apply PIXIprojection, define other way
 */
// eslint-disable-next-line
const b = a;

const internalData = {
    pixiStage: null,
    squares: [],
    created: false,
    containerSprite: null,
    slots: null,
};

export const createPIXI = (width, height, transparent, clickHandler) => {
    internalData.pixiStage = new PIXI.Application(width, height, { transparent });
    const myCanvas = document.getElementById("slots");
    const drawDiv = document.getElementById("augmentedReality");
    const textureCanvas = PIXI.Texture.fromCanvas(myCanvas);
    textureCanvas.scaleMode = PIXI.SCALE_MODES.NEAREST;
    internalData.slots = new PIXI.projection.Sprite2s(textureCanvas);
    const textureBackground = PIXI.Texture.WHITE;
    textureBackground.scaleMode = PIXI.SCALE_MODES.NEAREST;
    internalData.containerSprite = new PIXI.projection.Sprite2s(textureBackground);
    internalData.containerSprite.tint = 0x177eed;
    internalData.containerSprite.anchor.set(0.5);
    internalData.slots.anchor.set(0.5);
    /**
     * TODO define why scale wrong by default
     */
    internalData.slots.width = 10;
    internalData.slots.height = 10;
    internalData.containerSprite.width = width;
    internalData.containerSprite.height = height;
    internalData.pixiStage.stage.addChild(internalData.containerSprite);
    internalData.containerSprite.addChild(internalData.slots);
    /**
     * TODO move to css files
     */
    drawDiv.style.position = "absolute";
    drawDiv.style.top = "0";
    drawDiv.appendChild(internalData.pixiStage.view);
    internalData.pixiStage.ticker.add(() => redraw());
    hideView();
    initClickListeners(internalData.slots, clickHandler);
};

/**
 * redraw projection. This call by MarkerDetector
 * @param point1
 * @param point2
 * @param point3
 * @param point4
 */
export const updateViewPT = (point1, point2, point3, point4) => {
    if (!point1 || !point2 || !point3 || !point4) {
        hideView();
        return;
    }
    if (!internalData.created) {
        internalData.squares = [];
        internalData.squares.push(createPoints(point3[0], point3[1]));
        internalData.squares.push(createPoints(point4[0], point4[1]));
        internalData.squares.push(createPoints(point1[0], point1[1]));
        internalData.squares.push(createPoints(point2[0], point2[1]));
        internalData.pixiStage.ticker.add(() => {
            internalData.containerSprite.proj.mapBilinearSprite(internalData.containerSprite, internalData.squares);
        });
        internalData.created = true;
        return;
    }
    internalData.squares[0].set(point3[0], point3[1]);
    internalData.squares[1].set(point4[0], point4[1]);
    internalData.squares[2].set(point1[0], point1[1]);
    internalData.squares[3].set(point2[0], point2[1]);
    internalData.containerSprite.visible = true;
};

const hideView = () => {
    internalData.containerSprite.visible = false;
};

const createPoints = (x, y) => new PIXI.Point(x, y);

const initClickListeners = (sprite, callback) => {
    // eslint-disable-next-line
    sprite.interactive = true;
    sprite.on("pointerdown", () => callback());
};

const redraw = () => {
    internalData.containerSprite.texture.update();
    internalData.slots.texture.update();
};
