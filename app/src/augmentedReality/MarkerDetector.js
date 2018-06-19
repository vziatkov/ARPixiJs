export const createMarkerDetector = (videoWidth, videoHeight, pathFileParams) => new Promise((resolve, reject) => {
    // eslint-disable-next-line
    const detector = new ARController(videoWidth, videoHeight, pathFileParams);
    detector.onload = () => {
        detector.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO);
        resolve(detector);
    };
    detector.onerror = e => reject(e);
});

export const setupMarkerDetector = (detector, updateViewPTHandler, video, markerPath) => new Promise((resolve, reject) => {
    detector.loadMarker(markerPath, () => {
        const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        const detect = () => {
            detector.process(video);
            requestAnimationFrame(detect);
        };
        requestAnimationFrame(detect);
        resolve();
    }, e => reject(e));
    let lastDetect = 0;
    detector.addEventListener("getMarker", (ev) => {
        if (ev.data.marker.idPatt === 0 && ev.data.marker.id === 0 && ev.data.marker.idMatrix === 0) {
            const points = ev.data.marker.vertex;
            updateViewPTHandler(points[0], points[1], points[2], points[3]);
            lastDetect = Date.now();
        } else {
            // If marker not visible half second then hide view
            const timeNotVisibleMarker = (Date.now() - lastDetect) / 1000;
            if (timeNotVisibleMarker > 0.5) {
                updateViewPTHandler();
            }
        }
    });
});
