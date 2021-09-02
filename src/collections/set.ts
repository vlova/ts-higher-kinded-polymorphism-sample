import { makeDescription } from "../core";

export const SetTypeID = 'Set';

declare module '../core/collectionTypes' {
    interface TypeIdToProbableCollectionTypeMap<TElement> {
        readonly [SetTypeID]: Set<TElement>;
    }
}

export const SetDescription = makeDescription({
    typeId: SetTypeID,
    make: <T>() => new Set<T>(),
    add: (collection, value) => collection.add(value)
});