import { loadImage, httpGet } from "./gameSlot/Transport";
import { preloading, drawSpinButton, displayScene, drawReels, updateClickListener, roundEnd, onClickHandler } from "./gameSlot/View";
import {
    applyLoadedSettings,
    state,
    applySlotSizeState,
    applySymbolsAssets,
    applySpinButton,
    applySymbolsToReel,
    applyCallBackRedrawReels,
    applyGameStage,
    GameStages,
    applyCallBackRoundEnd,
} from "./gameSlot/State";
import { createSound } from "./gameSlot/SoundManager";

import { createPIXI, updateViewPT } from "./augmentedReality/PixiApp";
import { createMarkerDetector, setupMarkerDetector } from "./augmentedReality/MarkerDetector";
import { createVideo } from "./augmentedReality/Video";

const files = {
    gameSetting: "/resources/settings.json",
    imagePath: (imageName) => `/resources/${imageName}`,
    cameraData: "resources/camera_para.dat",
    markerPath: "./resources/marker32.pat",
    soundPath: "resources/soundClick.mp3",
};


const logError = (error, details = "") => {
    // eslint-disable-next-line no-console
    console.log(error);
    // eslint-disable-next-line no-console
    console.log(details);
};

const setupGame = async () => {
    const symbolsImages = [];
    preloading(false);
    applyLoadedSettings(await httpGet(files.gameSetting).then(response => (response.status === 200 ? response.json() : null)));
    applySlotSizeState();
    applySymbolsToReel();
    await Promise.all(state().configState.reelSymbols.map(imageName => loadImage(files.imagePath(imageName))
        .then(img => symbolsImages.push(img))).concat(loadImage(files.imagePath(state().configState.spinButtonImage))
            .then((img) => {
                applySpinButton(img);
            }),
        ),
    );
    applySymbolsAssets(symbolsImages);
    displayScene(state());
    drawSpinButton(state());
    drawReels(state());
    let isARSetupped = false;
    if(state().configState.isAugmentedReality) {
        await createVideo(state().configState.slotWidth, state().configState.slotHeight).then(async (setupVideo) => {
            createPIXI(state().configState.slotWidth, state().configState.slotHeight, true, onClickHandler);
            await createMarkerDetector(state().configState.slotWidth, state().configState.slotHeight, files.cameraData)
                .then((markerDetector) => {
                    setupMarkerDetector(markerDetector, updateViewPT, setupVideo, files.markerPath);
                });
            isARSetupped = true;
        }).catch(e => alert(e));
    };
    const soundClick = await createSound(files.soundPath).catch(e => alert(e));
    preloading(true, isARSetupped, soundClick);
    applyCallBackRedrawReels(drawReels);
    applyCallBackRoundEnd(roundEnd);
    applyGameStage(GameStages.READY);
    updateClickListener(true);
};
setupGame().catch(e => logError(e, "setup error"));
