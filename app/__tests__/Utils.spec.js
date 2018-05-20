import { getCoefficientResize } from "../src/gameSlot/Utils";

describe("Utils/getCoefficientResize", () => {
    const defaultSlotWidth = 400;
    const defaultSlotHeight = 300;
    const defaultHeightCoverPercent = 1;

    it("should return correct scale coefficient for slots", () => {
        const phoneWidth = 100;
        const phoneHeight = 100;

        const coefficientResize = getCoefficientResize(
            defaultHeightCoverPercent,
            defaultSlotWidth,
            defaultSlotHeight,
            phoneWidth,
            phoneHeight,
        );

        const slotWidthAferResize = coefficientResize * defaultSlotWidth;
        const slotHeightAfterResize =
            coefficientResize * defaultSlotHeight;
        expect(slotWidthAferResize).toEqual(80);
        expect(slotHeightAfterResize).toEqual(60);
        expect(coefficientResize).toEqual(0.2);
    });
});
