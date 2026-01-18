# probability-picker

A small, type-safe utility for random selection based on weighted probabilities. It handles simple maps, nested objects, and selection without replacement.

## Installation

```bash
npm i probability-picker
```

## Basic Usage

The `picker` function takes an object where keys are your options and values are their weights.

```typescript
import { picker } from 'probability-picker';

const drop = picker({
  common: 80,
  rare: 15,
  legendary: 5
}).one();
```

## Advanced Features

### Picking multiple items
Use `.take(n)` to get an array of results.

```typescript
const items = picker({ grass: 95, clover: 5 }).take(5);
// returns something like ['grass', 'grass', 'clover', 'grass', 'grass']
```

### Luck Modifier
The `luck()` method adjusts probabilities using an exponential curve. A luck value > 1 increases the weight of all items (favoring rarer ones relatively), while < 1 does the opposite.

```typescript
const loot = picker({ sword: 1, gold: 99 })
  .luck(5)
  .one();
```

### Nested Maps
If a value is another object, the picker will recursively select until it hits a leaf node (a string key).

```typescript
const map = {
  weapons: {
    sword: 10,
    axe: 5
  },
  consumables: 85
};

const result = picker(map).one(); // returns 'sword', 'axe', or 'consumables'
```

### The "Bag" System
If you need to pick items without repeating them until the set is exhausted, use `bag`.

```typescript
import { bag } from 'probability-picker';

const deck = bag({ Ace: 1, King: 1, Queen: 1 });

console.log(deck.next()); // 'King'
console.log(deck.next()); // 'Ace' (won't repeat until the deck is empty)
```

## License
MIT