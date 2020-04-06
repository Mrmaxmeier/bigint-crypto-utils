[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# bigint-crypto-utils

Utils for working with cryptography using native JS ([ES-2020](https://tc39.es/ecma262/#sec-bigint-objects)) implementation of BigInt. It includes some extra functions to work with modular arithmetic along with secure random numbers and a fast strong probable prime generator/tester (parallelized multi-threaded Miller-Rabin primality test). It can be used by any [Web Browser or webview supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) and with Node.js (>=10.4.0). In the latter case, for multi-threaded primality tests, you should use Node.js v11 or newer or enable at runtime with `node --experimental-worker` with Node.js version >= 10.5.0 and < 11.

> The operations supported on BigInts are not constant time. BigInt can be therefore **[unsuitable for use in cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html).** Many platforms provide native support for cryptography, such as [Web Cryptography API](https://w3c.github.io/webcrypto/) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html).

## Installation

bigint-crypto-utils is distributed for [web browsers and/or webviews supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) as an ES6 module or an IIFE file; and for Node.js (>=10.4.0), as a CJS module.

bigint-crypto-utils can be imported to your project with `npm`:

```bash
npm install bigint-crypto-utils
```

NPM installation defaults to the minified ES6 module for browsers and the CJS one for Node.js.

For web browsers, you can also directly download the [IIFE file](https://raw.githubusercontent.com/juanelas/bigint-crypto-utils/master/lib/index.browser.bundle.js) or the [ES6 module](https://raw.githubusercontent.com/juanelas/bigint-crypto-utils/master/lib/index.browser.bundle.mod.js) from GitHub.

## Usage examples

### Node.js:

```javascript
const bigintCryptoUtils = require("bigint-crypto-utils");

/* Stage 3 BigInts with value 666 can be declared as BigInt('666')
or the shorter new no-so-linter-friendly syntax 666n.
Notice that you can also pass a number, e.g. BigInt(666), but it is not
recommended since values over 2**53 - 1 won't be safe but no warning will
be raised.
*/
let a = BigInt("5");
let b = BigInt("2");
let n = BigInt("19");

console.log(bigintCryptoUtils.modPow(a, b, n)); // prints 6

console.log(bigintCryptoUtils.modInv(BigInt("2"), BigInt("5"))); // prints 3

console.log(bigintCryptoUtils.modInv(BigInt("3"), BigInt("5"))); // prints 2

// Generation of a probable prime of 2048 bits
const prime = await bigintCryptoUtils.prime(2048);

// Testing if a prime is a probable prime (Miller-Rabin)
if (await bigintCryptoUtils.isProbablyPrime(prime))
  // code if is prime

  // Get a cryptographically secure random number between 1 and 2**256 bits.
  const rnd = bigintCryptoUtils.randBetween(BigInt(2) ** BigInt(256));
```

### Javascript native from a browser

You can just load the module in a html page as:

```html
<script type="module">
  import * as bigintCryptoUtils from "<path to the downloaded index.browser.bundle.mod.js>";

  let a = BigInt("5");
  let b = BigInt("2");
  let n = BigInt("19");

  console.log(bigintCryptoUtils.modPow(a, b, n)); // prints 6

  console.log(bigintCryptoUtils.modInv(BigInt("2"), BigInt("5"))); // prints 3

  console.log(bigintCryptoUtils.modInv(BigInt("3"), BigInt("5"))); // prints 2

  (async function() {
    // Generation of a probable prime of 2018 bits
    const p = await bigintCryptoUtils.prime(2048);

    // Testing if a prime is a probable prime (Miller-Rabin)
    const isPrime = await bigintCryptoUtils.isProbablyPrime(p);
    alert(p.toString() + "\nIs prime?\n" + isPrime);

    // Get a cryptographically secure random number between 1 and 2**256 bits.
    const rnd = bigintCryptoUtils.randBetween(BigInt(2) ** BigInt(256));
    alert(rnd);
  })();
</script>
```

### TypeScript

BigInt is [ES-2020](https://tc39.es/ecma262/#sec-bigint-objects). In order to use it with TypeScript you should set `lib` (and probably also `target` and `module`) to `esnext` in `tsconfig.json`.

## bigint-crypto-utils JS Doc

{{>main}}