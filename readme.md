# What this about

You are familiar with generics.
Generics give you the way to express first-level polymorphic functions.

```typescript
function map<TElement>(
    collection: Array<TElement>,
    selector: (element: TElement) => TNewElement
) : Array<TNewElement> {
    return collection.map(selector);
}
```

What if we want function `map` to work not only with Arrays? What if we want it to accept `Array`, and `Set` and other collections?

```typescript
function map<TCollection, TElement>(
    collection: TCollection<TElement>,
    selector: (element: TElement) => TNewElement
) : TCollection<TNewElement> {
    const outputCollection = [];
    for (const item of collection) {
        outputCollection.push(selector(item));
    }

    return outputCollection;
}
```

Unfortunately, this is not possible… Without tricks. So let me tell you the trick

# Basic idea

Let's build a type map.

```typescript
// hkt.ts

export interface TypeIdToTypeMap<A> { }
```

Each time when we want to add a new type, we will use module augmentation

```typescript
// array.ts (can be declared in an outside module)

export const ArrayTypeID = Symbol('Array');
export type ArrayTypeID = typeof ArrayTypeID;

declare module './hkt' { // or (`package-name/hkt`)
    interface TypeIdToTypeMap<A> {
        readonly [ArrayTypeID]: Array<A>;
    }
}
```

Now, let's provide a way to build a high-order type.

```typescript
// hkt.ts

export type TypeIds = keyof TypeIdToTypeMap<any>

export type MakeType<TypeId extends TypeIds, TypeArg1>
    = TypeIdToTypeMap<TypeArg1>[TypeId];
```

And now let's try to use it:

```typescript
// This is fine
let numbers: MakeType<ArrayTypeID, number> = [1,2,3];

// But this has compilation error:
//    Type 'number' is not assignable to type 'string'
let strings: MakeType<ArrayTypeID, string> = [1,2,3];
```

# Basic usage

Now, please note that our `map` collection should have an idea of how to construct Array and how to add elements to it.

```typescript
// shared.ts
export interface CollectionDescription<TTypeId extends TypeIds> {
    make: <TElement>() => MakeType<TTypeId, TElement>;

    add: <TElement>(
        collection: MakeType<TTypeId, TElement>,
        value: TElement
    ) => void;

    getIterator: <TElement>(): Iterator<TElement>
}
```

```typescript
// array.ts
export const ArrayDescription: CollectionDescription<ArrayTypeID> = {
    make: () => [],

    add: (collection, value) => collection.push(value),

    getIterator: collection => collection.[Symbol.iterator]
};
```

Now we can build the function `map`. Let's see how it will be used:

```typescript
const mappedArray = map(
    ArrayDescription,
    [1, 2, 3],
    value => Math.floor(value / 2).toString()
);

console.log(mappedArray); // ['0', '1', '1']

const mappedSet = map(
    SetDescription,
    [1, 2, 3],
    value => Math.floor(value / 2).toString()
);

console.log(mappedSet); // Set(['0', '1'])
```

Unfortunattely, we can't get rid of passing `ArrayDescription` / `SetDescription` into `map`.
(Just a thought: we can use typescript transformer which will perform that work for us)

# Advanced idea

Now let's try to get rid of `getIterator` in `CollectionDescription`. All collections already implement `Iterable<TElement>`. What we need is to constraint collection type to extend `Iterable<TElement>`

In order to do that we will build specialized hkt.ts.
Firstly, we build `TypeIdToProbableCollectionTypeMap`

```typescript
// collections.hkt.ts
export interface TypeIdToProbableCollectionTypeMap<TElement> { }
```

We will augment this type in other files:
```typescript
// array.ts
declare module '.collections.hkt' {  // or (`package-name/collections.hkt`)
    interface TypeIdToProbableCollectionTypeMap<A> {
        readonly [ArrayTypeID]: Array<A>;
    }
}
```

Now we gonna build a new type-map. For each type defined in type-map `TypeIdToProbableCollectionTypeMap`.
   1. If type extends `Iterable<TElement>`, preserve it
   2. If not, replace it with the error message

```typescript
type TypeIdToCollectionTypeMap<TElement> = {
    [TypeId in keyof TypeIdToProbableCollectionTypeMap<TElement>]
    : ErrorIfNotFulfillsConstraint<
        TypeIdToProbableCollectionTypeMap<TElement>[TypeId],
        Iterable<TElement>,
        'Should implement [Symbol.iterator](): IterableIterator<TElement>'
    >
}
```

And ofc we need to provide specialized version of `TypeIds` and `MakeType`:

```typescript
export type CollectionTypeIds = keyof TypeIdToCollectionTypeMap<any>

export type MakeCollectionType<TypeId extends CollectionTypeIds, TElement>
    = TypeIdToCollectionTypeMap<TElement>[TypeId]
```

# Limitations

This doesn't work when types have different type constraints.
For example, we can't build a function that works both with `Set<>` and `WeakSet<>`.
Because `Set<T extends any>` and `WeakSet<T extends object>`

# Source of idea

I found implementation here: [fp-ts / guides / write type class instance](https://gcanti.github.io/fp-ts/guides/HKT.html). They refer this idea to paper [Lightweight higher-kinded polymorphism (pdf)](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf) which shows how to build this in OCaml