# Probability Picker
A lightweight library for selecting random values based on weighted probabilities.

## Installation

```bash
npm i probability-picker
```

## Usage

The `probabilityPicker` function will return `a`, `b`, or `c`. The probability of each one is defined as a value in the object.
    
```javascript
import picker from 'probability-picker';

const value = picker({
    a: 10,
    b: 70,
    c: 20,
}); 
```

## License

[MIT](LICENSE)