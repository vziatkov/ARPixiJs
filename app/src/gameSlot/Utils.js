export const windowWidth = () => window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

export const windowHeight = () => window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

export const getCoefficientResize = (curScaleCoeff,
    currentWidth = 0,
    currentHeight = 0,
    availableWidth = windowWidth(),
    availableHeight = windowHeight(),
) => (currentWidth * curScaleCoeff <= availableWidth && currentHeight * curScaleCoeff <= availableHeight ?
        normalizeNumber(curScaleCoeff) :
        getCoefficientResize(curScaleCoeff - 0.1, currentWidth, currentHeight, availableWidth, availableHeight));

export const displayAssetFactory = (img, displayWidth, displayHeight, topOffset, leftOffset) => ({
    displayWidth,
    displayHeight,
    img,
    topOffset,
    leftOffset,
});

export const normalizeNumber = value => Math.round(value * 1e2) / 1e2;

export const randomNum = max => Math.floor(Math.random() * max);

export const smoothOriginalImage = (displayObject) => {
    const countSteps = Math.ceil(Math.log(displayObject.img.width / displayObject.displayWidth) / Math.log(2));
    if (countSteps <= 0) {
        return displayObject.img;
    }
    const canvasResize = document.createElement("canvas");
    resizeCanvasImage(displayObject.img, canvasResize, displayObject.displayWidth, displayObject.displayHeight);
    return canvasResize;
};

/**
* See {@link https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality}
*/
const resizeCanvasImage = (img, canvas, maxWidth, maxHeight) => {
    const imgWidth = img.width;
    const imgHeight = img.height;
    const canvasContext = canvas.getContext("2d");
    const canvasCopy = document.createElement("canvas");
    const copyContext = canvasCopy.getContext("2d");
    const canvasCopy2 = document.createElement("canvas");
    const copyContext2 = canvasCopy2.getContext("2d");
    const rounds = 2;
    let { ratio, ratio1, ratio2 } = 1;
    ratio1 = maxWidth / imgWidth;
    ratio2 = maxHeight / imgHeight;
    if (ratio1 < ratio2) {
        ratio = ratio1;
    } else {
        ratio = ratio2;
    }
    canvasCopy.width = imgWidth;
    canvasCopy.height = imgHeight;
    copyContext.drawImage(img, 0, 0);
    canvasCopy2.width = imgWidth;
    canvasCopy2.height = imgHeight;
    copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);

    const roundRatio = ratio * rounds;
    for (let i = 1; i <= rounds; i += 1) {
        canvasCopy.width = imgWidth * roundRatio / i;
        canvasCopy.height = imgHeight * roundRatio / i;
        copyContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy.width, canvasCopy.height);
        canvasCopy2.width = imgWidth * roundRatio / i;
        canvasCopy2.height = imgHeight * roundRatio / i;
        copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);
    }
    canvas.width = imgWidth * roundRatio / rounds; // eslint-disable-line no-param-reassign
    canvas.height = imgHeight * roundRatio / rounds; // eslint-disable-line no-param-reassign
    canvasContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvas.width, canvas.height);
};
