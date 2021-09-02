import { makeDescription } from "../core";

export class CustomSet<T> {
    private internalSet = new Set<T>();
    constructor(values?: readonly T[] | null) {
        this.internalSet = new Set(values);
    }

    add(value: T) {
        this.internalSet.add(value);
    }

    [Symbol.iterator]() {
        return this.internalSet.values();
    }
}

export const CustomSetTypeId = Symbol('ConstrainedSet');

declare module '../core/collectionTypes' {
    interface TypeIdToProbableCollectionTypeMap<TElement> {
        readonly [CustomSetTypeId]: CustomSet<TElement>;
    }
}

export const CustomSetDescription = makeDescription({
    typeId: CustomSetTypeId,
    make: <T>() => new CustomSet<T>(),
    add: (collection, value) => collection.add(value)
});