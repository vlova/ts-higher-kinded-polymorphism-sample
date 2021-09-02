import { CollectionDescription } from "../core";
import { GetCollectionElementType, MakeCollectionType, CollectionTypeIds } from "../core/collectionTypes";

export function map<
    TCollectionTypeId extends CollectionTypeIds,
    TInputValue extends GetCollectionElementType<TCollectionTypeId, TInputCollection>,
    TInputCollection extends MakeCollectionType<TCollectionTypeId, TInputValue>,
    TOutputValue
>(
    collectionDescription: CollectionDescription<TCollectionTypeId>,
    inputCollection: TInputCollection,
    selector: (value: TInputValue) => TOutputValue,
) {
    const outputCollection = collectionDescription.make<TOutputValue>();
    for (const value of inputCollection) {
        collectionDescription.add(outputCollection, selector(value));
    }

    return outputCollection;
}