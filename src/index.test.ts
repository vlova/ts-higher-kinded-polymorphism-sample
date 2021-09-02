import { expect } from "chai";
import { ArrayDescription, map, SetDescription, CustomSet, CustomSetDescription } from ".";


describe('HKT', () => {
    it('Map Array', () => {
        const outputCollection = map(ArrayDescription, [1, 2, 3], value => Math.floor(value / 2).toString());
        expect(outputCollection).to.be.deep.equal(['0', '1', '1']);
    })

    it('Map Set', () => {
        const outputCollection = map(SetDescription, new Set([1, 2, 3]), value => Math.floor(value / 2).toString());
        expect(outputCollection).to.be.deep.equal(new Set(['0', '1']));
    })

    it('Custom Set', () => {
        const outputCollection = map(CustomSetDescription, new CustomSet([1, 2, 3]), value => Math.floor(value / 2));
        expect(outputCollection).to.be.deep.equal(new CustomSet([0, 1]));
    })
});