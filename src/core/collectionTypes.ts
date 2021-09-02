export interface TypeIdToProbableCollectionTypeMap<TElement> { }

type TypeIdToCollectionTypeMap<TElement> = {
    [TypeId in keyof TypeIdToProbableCollectionTypeMap<TElement>]
    : ErrorIfNotFulfillsConstraint<
        TypeIdToProbableCollectionTypeMap<TElement>[TypeId],
        Iterable<TElement>,
        'Should implement [Symbol.iterator](): IterableIterator<TElement>'
    >
}

export type CollectionTypeIds = keyof TypeIdToCollectionTypeMap<any>

export type MakeCollectionType<TypeId extends CollectionTypeIds, TElement>
    = TypeIdToCollectionTypeMap<TElement>[TypeId]

export type GetCollectionElementType<
    TypeId extends CollectionTypeIds,
    Type extends TypeIdToCollectionTypeMap<any>[TypeId]
    >
    = Type extends TypeIdToCollectionTypeMap<infer TElement>[TypeId]
    ? TElement
    : never;

type ErrorIfNotFulfillsConstraint<T, TConstraint, TError extends string>
    = T extends TConstraint
    ? T
    : TError;


