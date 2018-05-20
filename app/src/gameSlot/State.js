import { getCoefficientResize, displayAssetFactory, randomNum, normalizeNumber, windowWidth, windowHeight } from "./Utils";
import { httpGet } from "./Transport";

export const GameStages = Object.freeze({
    LOADING: Symbol("loading"),
    READY: Symbol("ready"),
    ANIMATING: Symbol("animating"),
    RESULT_RECEIVED: Symbol("resultReceived"),
    FREE_SPIN: Symbol("freeSpin"),
    CONNECTION_ERROR: Symbol("connectionError"),
});

const defaultState = {
    game: {
        configState: {
            countReels: 3,
            durationRotation: 5000,
            reelAnimationSymbols: [],
            reelMaxHeight: 0.6,
            reelTopOffset: 0.3,
            reelSymbols: ["Symbol_0.png", "Symbol_1.png", "Symbol_2.png", "Symbol_3.png", "Symbol_4.png", "Symbol_5.png"],
            spinButtonTopOffset: 0.8,
            spinButtonMaxHeight: 0.2,
            slotWidth: windowWidth(),
            slotHeight: windowHeight(),
            speedAnimation: 1000,
            spinButtonImage: "button.png",
            winMessageTopOffset: 0,
            winMessageMaxHeight: 0.2,
            isAugmentedReality: true,
        },
        displayState: {
            reelDisplayHeight: 0,
            reelDisplayWidth: 0,
            reelDisplayTopOffset: 0,
            slotDisplayWidth: 0,
            slotDisplayHeight: 0,
            winMessageDisplayTopOffset: 0,
            winMessageDisplayHeight: 0,
        },
        animationIntervals: [],
        // TODO approach with callBacks should be updated to promises
        // eslint-disable-next-line no-console
        callBackRedrawReels: state => console.log("redefine callBackRedrawReels"), // eslint-disable-line no-unused-vars
        // eslint-disable-next-line no-console
        callBackRoundEnd: state => console.log("redefine callBackRoundEnd"), // eslint-disable-line no-unused-vars
        gameStage: GameStages.LOADING,
        displaySymbolsAssets: [],
        reelsSymbolsState: [],
        spinButtonAsset: {},
        receivedResult: {
            result: null,
            winMessage: "",
            isFreeSpin: false,
        },
    },
};

const currentState = { ...defaultState };

export const state = () => ({
    configState: { ...currentState.game.configState, reelAnimationSymbols: [...currentState.game.configState.reelAnimationSymbols] },
    displayState: { ...currentState.game.displayState },
    animationIntervals: [...currentState.game.animationIntervals],
    callBackRedrawReels: currentState.game.callBackRedrawReels,
    callBackRoundEnd: currentState.game.callBackRoundEnd,
    displaySymbolsAssets: [...currentState.game.displaySymbolsAssets],
    gameStage: currentState.game.gameStage,
    reelsSymbolsState: [...currentState.game.reelsSymbolsState],
    receivedResult: { ...currentState.game.receivedResult },
    spinButtonAsset: { ...currentState.game.spinButtonAsset },
});

export const applyLoadedSettings = (configState) => {
    if (configState !== null) {
        currentState.game.configState = { ...currentState.game.configState, ...configState };
    }
};

/**
 * Calculate location and size items in slot
 */
export const applySlotSizeState = () => {
    const { configState } = currentState.game;
    const scaleSlots = getCoefficientResize(1, configState.slotWidth, configState.slotHeight);
    const slotWidth = configState.slotWidth * scaleSlots;
    const slotHeight = configState.slotHeight * scaleSlots;
    currentState.game.displayState = { ...currentState.game.displayState,
        ...{
            slotDisplayWidth: slotWidth,
            slotDisplayHeight: slotHeight,
            reelDisplayWidth: normalizeNumber(slotWidth / configState.countReels),
            reelDisplayTopOffset: normalizeNumber(slotHeight * configState.reelTopOffset),
            reelDisplayHeight: normalizeNumber(slotHeight * configState.reelMaxHeight),
            winMessageDisplayTopOffset: normalizeNumber(slotHeight * configState.winMessageTopOffset),
            winMessageDisplayHeight: normalizeNumber(slotHeight * configState.winMessageMaxHeight),
        },
    };
};

/**
 * Create displayObjects from images. Setup correct size, offset.
 * Parse image name http://somepath/somepath/Image_0.png - will be parsed and numbers between _ and . will apply like symbol num
 * @param symbolsImages array of images which was loaded during preloading.
 *
 */
export const applySymbolsAssets = (symbolsImages) => {
    const displaySymbolsAssets = [];
    const gameState = state();
    const displayState = gameState.displayState;
    const config = gameState.configState;
    for (let reelIndex = 0; reelIndex < config.countReels; reelIndex += 1) {
        displaySymbolsAssets[reelIndex] = [];
        symbolsImages.forEach((img) => {
            const indexSymbol = img.src.match(/.+_(\d+)\.png/)[1];
            const scale = getCoefficientResize(1, img.width, img.height, displayState.reelDisplayWidth, displayState.reelDisplayHeight);
            const displayWidth = img.width * scale;
            const displayHeight = img.height * scale;
            const topOffset = displayState.reelDisplayTopOffset + displayState.reelDisplayHeight / 2 - displayHeight / 2;
            const leftOffset = reelIndex * displayState.reelDisplayWidth + (displayState.reelDisplayWidth - displayWidth) / 2;
            displaySymbolsAssets[reelIndex][indexSymbol] = displayAssetFactory(img, displayWidth, displayHeight, topOffset, leftOffset);
        });
    }
    currentState.game.displaySymbolsAssets = displaySymbolsAssets;
};

/**
 * Setup "spin" button. Create displayObject
 * @param img instance of Image.
 */
export const applySpinButton = (img) => {
    const gameState = state();
    const displayState = gameState.displayState;
    const config = gameState.configState;
    const scale = getCoefficientResize(
        1,
        img.width,
        img.height,
        displayState.slotDisplayWidth,
        displayState.slotDisplayHeight * config.spinButtonMaxHeight,
    );
    const displayWidth = img.width * scale;
    const displayHeight = img.height * scale;
    const spinButtonAsset = displayAssetFactory(
        img,
        displayWidth,
        displayHeight,
        displayState.slotDisplayHeight * config.spinButtonTopOffset,
        (displayState.slotDisplayWidth - displayWidth) / 2,
    );

    currentState.game.spinButtonAsset = spinButtonAsset;
};

/**
 * Generate number of symbol which should be drawn on reel
 * @param isResultGame - false apply random symbol, true apply symbol from receivedResult section
 */
export const applySymbolsToReel = (isResultGame = false) => {
    const gameState = state();
    const config = gameState.configState;
    const reelsSymbols = [];
    for (let reelIndex = 0; reelIndex < config.countReels; reelIndex += 1) {
        if (!isResultGame) {
            const reelAnimationSymbols = config.reelAnimationSymbols[reelIndex];
            while (true) {
                const randomSymbol = randomNum(reelAnimationSymbols.length);
                if (randomSymbol !== gameState.reelsSymbolsState[reelIndex]) {
                    reelsSymbols[reelIndex] = reelAnimationSymbols[randomNum(reelAnimationSymbols.length)];
                    break;
                }
            }
        } else {
            if (gameState.receivedResult.result === null) {
                return;
            }
            reelsSymbols[reelIndex] = gameState.receivedResult.result[reelIndex];
        }
    }
    currentState.game.reelsSymbolsState = reelsSymbols;
};

export const applyStopReelsAnimation = () => {
    const animationIntervals = state().animationIntervals;
    if (animationIntervals.length === 0) {
        return;
    }
    animationIntervals.forEach(intervalID => clearInterval(intervalID));
    currentState.game.animationIntervals = [];
};

export const applyGameStage = (gameStage) => {
    if (gameStage === GameStages.ANIMATING) {
        applyAnimationState();
        getGameResult();
    }
    currentState.game.gameStage = gameStage;
};

/**
 * TODO approach should be updated
 * @param callBack function which will be executed when reels should be redrawn
 */
export const applyCallBackRedrawReels = (callBack) => {
    currentState.game.callBackRedrawReels = callBack;
};

export const applyCallBackRoundEnd = (callBack) => {
    currentState.game.callBackRoundEnd = callBack;
};

/**
 * Generate symbols to reel with interval config.speedAnimation
 * Add timeout when animation should be stopped
 */
const applyAnimationState = () => {
    const gameState = state();
    const config = gameState.configState;
    if (gameState.animationIntervals.length > 0) {
        applyStopReelsAnimation();
    }
    for (let reelIndex = 0; reelIndex < config.countReels; reelIndex += 1) {
        currentState.game.animationIntervals.push(setInterval(() => {
            applySymbolsToReel();
            gameState.callBackRedrawReels(state());
        }, config.speedAnimation));
    }
    setTimeout(() => applyGameResultState(), gameState.configState.durationRotation);
};

/**
 * Apply to reels resulted symbols.
 * Apply text result, and correct gameStage
 */
const applyGameResultState = () => {
    const gameState = state();
    applyStopReelsAnimation();
    if (!gameState.receivedResult) {
        applyGameStage(GameStages.CONNECTION_ERROR);
        return;
    }
    applySymbolsToReel(true);
    applyGameStage(gameState.receivedResult.isFreeSpin ? GameStages.FREE_SPIN : GameStages.READY);
    gameState.callBackRedrawReels(state());
    gameState.callBackRoundEnd(state());
    currentState.game.receivedResult = { result: null, winMessage: "", isFreeSpin: false };
};

const getGameResult = async () => {
    try {
        currentState.game.receivedResult = await httpGet("/result").then(response => (
            response.status === 200 ? response.json() :
            { result: null, winMessage: "", isFreeSpin: false }),
        );
    } catch (error) {
        applyGameStage(GameStages.CONNECTION_ERROR);
    }
};
