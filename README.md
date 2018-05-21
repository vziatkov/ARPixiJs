1) yarn
2) build and run development version - yarn start - in browser localhost:3000

Build production - yarn build:production (smaller bundle size)

Check code style - yarn lint

Run test - yarn test

General rules:
1) if wildSymbol is present on reels, next rotation will be start automatically
2) two same symbols trigger "small win"
3) three same symbols trigger "big win"

!! This version of application runs augmented reality only for localhost (it can be improved).

If augmented reality wasn't initialized then game will be launched in regular mode.

SETTINGS:

Client settings /dist/resources/settings.json:
    countReels - count displayable reels (should be the same with same server setting)
    durationRotation - min duration of rotation reels
    reelAnimationSymbols - which symbols images use for reels
    speedAnimation - speed rotation reeels
    reelMaxHeight, reelTopOffset, spinButtonMaxHeight, spinButtonTopOffset, winMessageTopOffset, winMessageMaxHeight - slot size settings
    isAugmentedReality - is try to set up augmented reality

Server settings /server/settings.json:
    reelsData - specify math. for result,
    freeSpinSymbol - which symbol is will be used like wild,
    smallWin - cound same symbols for small win,
    bigWin - count same symbols for big win

For testing augmented reality you will need image HiroPattern.png

TODO:
 1) Move to https that this works not only for localhost
 2) Check why mini-css-extract-plugin plugin doesn't work correctly. Move css from code to style files.
 3) Move to typeScript