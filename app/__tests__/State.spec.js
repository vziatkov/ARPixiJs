// TODO extend test coverage
describe("GameState", () => {
    afterEach(() => {
        jest.resetModules();
    });
    it("state should have default values", () => {
        // eslint-disable-next-line global-require
        const { state } = require("../src/gameSlot/State");
        Object.entries(state()).forEach((item) => {
            expect(item[1]).toBeDefined();
        });
    });
    it("extenral config should be applyed", () => {
        // eslint-disable-next-line global-require
        const { applyLoadedSettings, state } = require("../src/gameSlot/State");
        const expectSettings = {
            countReels: 2,
            durationRotation: 1,
            reelAnimationSymbols: [[1, 2], [1, 2, 3]],
            reelMaxHeight: 0.1,
            reelTopOffset: 0.2,
            reelSymbols: ["1ad", "2ads", "3ads", "4ad", "5ad", "6ads"],
            slotWidth: 1,
            slotHeight: 2,
            speedAnimation: 100,
            spinButtonImage: "asd",
            spinButtonMaxHeight: 0.3,
            spinButtonTopOffset: 0.11,
            winMessageTopOffset: 0.5,
            winMessageMaxHeight: 0.1,
        };
        applyLoadedSettings(expectSettings);
        expect(state().configState).toMatchObject(expectSettings);
    });
    it("reels should have correct calculated display state", () => {
        // eslint-disable-next-line global-require
        const { state, applySlotSizeState } = require("../src/gameSlot/State");
        applySlotSizeState();
        const { reelDisplayHeight, reelDisplayTopOffset, slotDisplayHeight } = state().displayState;
        const totalHeight = reelDisplayHeight + reelDisplayTopOffset;
        expect(totalHeight < slotDisplayHeight).toBeTruthy();
    });
});
