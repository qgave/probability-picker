# Probability Picker
A library that helps obtain a value based on probability.

## Installation

```bash
npm install probability-picker
```

## Usage

The `probabilityPicker` function will return `a`, `b`, or `c`. The probability of each one is defined as a value in the object.
    
```javascript
import probabilityPicker from 'probability-picker';

const value = probabilityPicker({
    a: 10,
    b: 70,
    c: 20,
}); 
```

## License

[MIT](LICENSE)