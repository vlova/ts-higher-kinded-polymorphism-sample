import { MakeCollectionType, CollectionTypeIds } from "./collectionTypes";

export interface CollectionDescription<TCollectionTypeId extends CollectionTypeIds> {
    typeId: TCollectionTypeId;
    make: <TValue>() => MakeCollectionType<TCollectionTypeId, TValue>;
    add: <TValue>(collection: MakeCollectionType<TCollectionTypeId, TValue>, value: TValue) => void;
}

export function makeDescription<TTypeId extends CollectionTypeIds>(
    desc: CollectionDescription<TTypeId>
) {
    return desc;
}