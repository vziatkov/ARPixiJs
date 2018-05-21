export const createMarkerDetector = (videoWidth, videoHeight, pathFileParams) => new Promise((resolve, reject) => {
    const detector = new ARController(videoWidth, videoHeight, pathFileParams);
    detector.onload = () => {
        resolve(detector);
    };
});

export const setupMarkerDetector = (detector, pixiApp, video, markerPath) => new Promise((resolve, reject) => {
    detector.loadMarker(markerPath, (marker) => {
        const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        const detect = () => {
            detector.process(video);
                requestAnimationFrame(detect);
            };
            requestAnimationFrame(detect);
            resolve();
        });
    let lastDetect = 0;
        detector.addEventListener('getMarker', (ev) => {
            if(ev.data.marker.idPatt === 0 && ev.data.marker.id === 0 && ev.data.marker.idMatrix === 0) {
                const points = ev.data.marker.vertex;
                pixiApp.updateViewPT(points[0], points[1], points[2], points[3]);
                lastDetect = Date.now();
            }
            else {
                // If marker not visible half second then hide view
                const timeNotVisibleMarker = (Date.now() - lastDetect) / 1000;
                if ( timeNotVisibleMarker > .5 ) {
                    pixiApp.hideView();
                }
            }
        });
});