export const createVideo = (videoWidth, videoHeight) => new Promise((resolve, reject) => {
    var video = document.getElementById("videoElement");
    video.width = videoWidth;
    video.height = videoHeight;

    const constraints = { audio: false, video: {
        width: videoWidth,
        height: videoHeight,
        aspectRatio: videoHeight / videoWidth
    }};
    /**
     * TODO add navigator.permissions.query or move to https.
     * Check why it is working only for localhost
     */
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            if ("srcObject" in video) {
                video.srcObject = stream;
            } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
            }
            video.onloadedmetadata = (e) => {
                video.play();
                resolve(video);
            };
        }).catch(function(err) {
        alert(err.name + ": " + err.message);
        resolve(null);
    });

});

navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

/*
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}