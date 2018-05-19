export const createMarkerDetector = (videoWidth, videoHeight, pathFileParams) => new Promise((resolve, reject) => {
    const detector = new ARController(videoWidth, videoHeight, pathFileParams);
    detector.onload = () => {
        resolve(detector);
    };
});
let interval = null;
export const setupMarkerDetector = (detector, pixiApp, video, markerPath) => new Promise((resolve, reject) => {
    if(interval !== null) {
        return;
    }
    detector.loadMarker(markerPath, (marker) => {
        const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        const detect =  () => {
            detector.process(video);
                requestAnimationFrame(detect);
            };
            requestAnimationFrame(detect);
            resolve();
        });
        detector.addEventListener('getMarker', (ev) => {
            if(ev.data.marker.idPatt === 0 && ev.data.marker.id === 0 && ev.data.marker.idMatrix === 0) {
                const points = ev.data.marker.vertex;
                pixiApp.updateView(points[0], points[1], points[2], points[3]);
            }
        });
});

export const clearExistDetector = () => {
    clearInterval(interval);
    interval = null;
}