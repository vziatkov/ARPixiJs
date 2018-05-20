import { state, applyGameStage, GameStages } from "./State";
import { smoothOriginalImage } from "./Utils";
import * as style from "./Views.css";
// TODO investigate why doesn't work
console.log(style);

const scene = document.getElementById("slots");
const preload = document.getElementById("preload");
const userVideo = document.getElementById("userVideo");
const ctx = scene ? scene.getContext("2d") : {};

const internalData = {
    isAugmentedReality: false,
};
export const preloading = (isPreloadComplete, isAugmentedReality = false) => {
    scene.style.display = isPreloadComplete && !isAugmentedReality ? "block" : "none";
    preload.style.display = isPreloadComplete ? "none" : "block";
    userVideo.style.display = isPreloadComplete && isAugmentedReality ? "block" : "none";
    internalData.isAugmentedReality = isAugmentedReality;
};

export const displayScene = (gameState) => {
    scene.style.backgroundColor = "#177eed";
    scene.width = gameState.displayState.slotDisplayWidth;
    scene.height = gameState.displayState.slotDisplayHeight;
};

export const drawSpinButton = (gameState) => {
    const spinButtonAsset = gameState.spinButtonAsset;
    const smoothImage = smoothOriginalImage(spinButtonAsset);
    ctx.drawImage(
        smoothImage,
        spinButtonAsset.leftOffset,
        spinButtonAsset.topOffset,
        spinButtonAsset.displayWidth,
        spinButtonAsset.displayHeight,
    );
};

export const drawReels = (gameState) => {
    const config = gameState.configState;
    for (let reelIndex = 0; reelIndex < config.countReels; reelIndex += 1) {
        drawReel(reelIndex);
    }
};

export const drawReel = (reelIndex) => {
    requestAnimationFrame(() => {
        const displayState = state().displayState;
        const displayAssets = state().displaySymbolsAssets;
        const sym = state().reelsSymbolsState[reelIndex];
        ctx.clearRect(
            displayState.reelDisplayWidth * reelIndex,
            displayState.reelDisplayTopOffset,
            displayState.reelDisplayWidth,
            displayState.reelDisplayHeight,
        );
        const smoothImage = smoothOriginalImage(displayAssets[reelIndex][sym]);
        ctx.drawImage(
            smoothImage,
            displayAssets[reelIndex][sym].leftOffset,
            displayAssets[reelIndex][sym].topOffset,
            displayAssets[reelIndex][sym].displayWidth,
            displayAssets[reelIndex][sym].displayHeight,
        );
    });
};

export const drawGameWin = (gameState) => {
    const displayState = gameState.displayState;
    const txt = gameState.receivedResult.winMessage;
    ctx.font = `${displayState.winMessageDisplayHeight}px Arial`;
    const textWidth = ctx.measureText(txt).width;
    /**
     * See {@link https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas}
     */
    const lettersHeightHack = displayState.winMessageDisplayHeight * 0.2;
    ctx.clearRect(
        0,
        displayState.winMessageDisplayTopOffset,
        displayState.slotDisplayWidth,
        displayState.winMessageDisplayHeight + displayState.winMessageDisplayTopOffset + lettersHeightHack,
    );
    ctx.fillText(txt, displayState.slotDisplayWidth / 2 - textWidth / 2,
        displayState.winMessageDisplayTopOffset + displayState.winMessageDisplayHeight);
};

export const roundEnd = (gameState) => {
    drawGameWin(gameState);
    if (gameState.gameStage === GameStages.READY) {
        updateClickListener(true);
    } else if (gameState.gameStage === GameStages.FREE_SPIN) {
        setTimeout(() => {
            applyGameStage(GameStages.ANIMATING);
            updateClickListener(false);
            drawGameWin(state());
        }, 2000);
    }
};

export const updateClickListener = (isEnable) => {
    if (isEnable) {
        scene.addEventListener("click", onClickHandler, false);
        scene.addEventListener("mousemove", onMouseMove, false);
    } else {
        scene.removeEventListener("click", onClickHandler);
        scene.removeEventListener("mousemove", onMouseMove);
        scene.style.cursor = "default";
    }
};

const onMouseMove = (e) => {
    if (isOverButton(e, state().spinButtonAsset)) {
        scene.style.cursor = "pointer";
    } else {
        scene.style.cursor = "default";
    }
};

const onClickHandler = (e) => {
    if (isOverButton(e, state().spinButtonAsset)) {
        applyGameStage(GameStages.ANIMATING);
        updateClickListener(false);
        drawGameWin(state());
    }
};

const isOverButton = (e, spinButton) => (e.layerX > spinButton.leftOffset
    && e.layerX < spinButton.leftOffset + spinButton.displayWidth
    && e.layerY > spinButton.topOffset && e.layerY < spinButton.topOffset + spinButton.displayHeight
);
