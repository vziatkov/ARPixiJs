// eslint-disable-next-line import/prefer-default-export
export const createSound = soundPath => new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener("canplaythrough", () => resolve(audio), false);
    audio.addEventListener("error", e => reject(e), false);
    audio.src = soundPath;
    // TODO investigate why in xcode doesn't fire canplaythrough and error events
    setTimeout(() => resolve(null), 3000);
});
