export const createVideo = (videoWidth, videoHeight) => new Promise((resolve, reject) => {
    var video = document.getElementById("videoElement");
    video.width = videoWidth;
    video.height = videoHeight;
    var containerVideo = document.getElementById("userVideo");

    // Prefer camera resolution nearest to 1280x720.
    const constraints = { audio: false, video: {
        width: videoWidth,
        height: videoHeight,
        aspectRatio: videoHeight / videoWidth
    }};
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            video.srcObject = mediaStream;
            video.onloadedmetadata = (e) => {
                video.play();
                resolve(video);
            };
        });
});