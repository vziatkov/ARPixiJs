import { loadImage, httpGet } from "./gameSlot/Transport";
import { preloading, drawSpinButton, displayScene, drawReels, updateClickListener, roundEnd } from "./gameSlot/View";
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

import { PixiApp } from "./augmentedReality/PixiApp";
import { createMarkerDetector, setupMarkerDetector } from "./augmentedReality/MarkerDetector";
import { createVideo } from "./augmentedReality/Video";


const logError = (error, details = "") => {
    // eslint-disable-next-line no-console
    console.log(error);
    // eslint-disable-next-line no-console
    console.log(details);
};

const setupGame = async () => {
    const symbolsImages = [];
    preloading(false);
    applyLoadedSettings(await httpGet("/resources/settings.json").then(response => (response.status === 200 ? response.json() : null)));
    applySlotSizeState();
    applySymbolsToReel();
    await Promise.all(state().configState.reelSymbols.map(imageName => loadImage(`/resources/${imageName}`)
        .then(img => symbolsImages.push(img))).concat(loadImage(`/resources/${state().configState.spinButtonImage}`)
            .then((img) => {
                applySpinButton(img);
            }),
        ),
    );
    applySymbolsAssets(symbolsImages);
    displayScene(state());
    drawSpinButton(state());
    drawReels(state());
    if(state().configState.isAugmentedReality) {
        const video = await createVideo(state().configState.slotWidth, state().configState.slotHeight);
        const pixiApp = new PixiApp(state().configState.slotWidth, state().configState.slotHeight, true);
        await createMarkerDetector(state().configState.slotWidth, state().configState.slotHeight, 'resources/camera_para.dat')
            .then((markerDetector) => {
                setupMarkerDetector(markerDetector, pixiApp, video, "./resources/marker32.pat");
            });
    }
    preloading(true, state().configState.isAugmentedReality);
    applyCallBackRedrawReels(drawReels);
    applyCallBackRoundEnd(roundEnd);
    applyGameStage(GameStages.READY);
    updateClickListener(true);
};
setupGame().catch(e => logError(e, "setup error"));
