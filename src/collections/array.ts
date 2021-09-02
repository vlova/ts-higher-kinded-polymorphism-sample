import { makeDescription } from "../core";

export const ArrayTypeID = Symbol('Array');

declare module '../core/collectionTypes' {
    interface TypeIdToProbableCollectionTypeMap<TElement> {
        readonly [ArrayTypeID]: Array<TElement>;
    }
}

export const ArrayDescription = makeDescription({
    typeId: ArrayTypeID,
    make: () => [],
    add: (collection, value) => collection.push(value)
});