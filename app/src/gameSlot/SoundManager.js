export const createSound = (soundPath) => new Promise((resolve, reject) => {
    const audio = new Audio(soundPath);
    audio.addEventListener('canplaythrough', () => resolve(audio), false);
    audio.addEventListener('error', () => resolve(null), false);
});