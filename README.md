# bigint-utils 

Some extra functions to work with modular arithmetics along with secure random numbers and probable prime (Miller-Rabin primality test) generation/testing using native JS (stage 3) implementation of BigInt. It can be used with Node.js (>=10.4.0) and [Web Browsers supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility).

_The operations supported on BigInts are not constant time. BigInt can be therefore **[unsuitable for use in cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html)**_

Many platforms provide native support for cryptography, such as [webcrypto](https://w3c.github.io/webcrypto/Overview.html) or [node crypto](https://nodejs.org/dist/latest/docs/api/crypto.html).

## Installation
bigint-utils is distributed as both an ES6 and a CJS module.

The ES6 module is built for any [web browser supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility). The module only uses native javascript implementations and no polyfills had been applied.

The CJS module is built as a standard node module.

bigint-utils can be imported to your project with `npm`:
```bash
npm install bigint-utils
```

For web browsers, you can also [download the bundle from GitHub](https://raw.githubusercontent.com/juanelas/bigint-utils/master/dist/bigint-utils-latest.browser.mod.min.js).

## Usage example

With node js:
```javascript
const bigintUtils = require('bigint-utils');

// Stage 3 BigInts with value 666 can be declared as BigInt('666')
// or the shorter new no-so-linter-friendly syntax 666n
let a = BigInt('5');
let b = BigInt('2');
let n = BigInt('19');

console.log(bigintModArith.modPow(a, b, n)); // prints 6

console.log(bigintModArith.modInv(BigInt('2'), BigInt('5'))); // prints 3

console.log(bigintModArith.modInv(BigInt('3'), BigInt('5'))); // prints 2

// Generation of a probable prime of 2048 bits
const prime = await bigintUtils.prime(2048);

// Testing if a prime is a probable prime (Miller-Rabin)
if ( await bigintUtils.isProbablyPrime(prime) )
    // code if is prime

// Get a cryptographically secure random number between 1 and 2**256 bits.
const rnd = bigintUtils.randBetween(BigInt(2)**256);

```

From a browser, you can just load the module in a html page as:
```html
  <script type="module">
    import * as bigintUtils from 'bigint-utils-latest.browser.mod.min.js';

    let a = BigInt('5');
    let b = BigInt('2');
    let n = BigInt('19');

    console.log(bigintModArith.modPow(a, b, n)); // prints 6

    console.log(bigintModArith.modInv(BigInt('2'), BigInt('5'))); // prints 3

    console.log(bigintModArith.modInv(BigInt('3'), BigInt('5'))); // prints 2

    (async function () {
      // Generation of a probable prime of 2018 bits
      const p = await bigintSecrets.prime(2048);

      // Testing if a prime is a probable prime (Miller-Rabin)
      const isPrime = await bigintSecrets.isProbablyPrime(p);
      alert(p.toString() + '\nIs prime?\n' + isPrime);

      // Get a cryptographically secure random number between 1 and 2**256 bits.
      const rnd = await bigintSecrets.randBetween(BigInt(2)**256);
      alert(rnd);
    })();
  </script>
```

# bigint-utils JS Doc

## Constants

<dl>
<dt><a href="#abs">abs</a> ⇒ <code>bigint</code></dt>
<dd><p>Absolute value. abs(a)==a if a&gt;=0. abs(a)==-a if a&lt;0</p>
</dd>
<dt><a href="#gcd">gcd</a> ⇒ <code>bigint</code></dt>
<dd><p>Greatest-common divisor of two integers based on the iterative binary algorithm.</p>
</dd>
<dt><a href="#lcm">lcm</a> ⇒ <code>bigint</code></dt>
<dd><p>The least common multiple computed as abs(a*b)/gcd(a,b)</p>
</dd>
<dt><a href="#toZn">toZn</a> ⇒ <code>bigint</code></dt>
<dd><p>Finds the smallest positive element that is congruent to a in modulo n</p>
</dd>
<dt><a href="#eGcd">eGcd</a> ⇒ <code><a href="#egcdReturn">egcdReturn</a></code></dt>
<dd><p>An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm. 
Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).</p>
</dd>
<dt><a href="#modInv">modInv</a> ⇒ <code>bigint</code></dt>
<dd><p>Modular inverse.</p>
</dd>
<dt><a href="#modPow">modPow</a> ⇒ <code>bigint</code></dt>
<dd><p>Modular exponentiation a**b mod n</p>
</dd>
<dt><a href="#randBytes">randBytes</a> ⇒ <code>Promise</code></dt>
<dd><p>Secure random bytes for both node and browsers. Browser implementation uses WebWorkers in order to not lock the main process</p>
</dd>
<dt><a href="#randBetween">randBetween</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns a cryptographically secure random integer between [min,max]</p>
</dd>
<dt><a href="#isProbablyPrime">isProbablyPrime</a> ⇒ <code>Promise</code></dt>
<dd><p>The test first tries if any of the first 250 small primes are a factor of the input number and then passes several iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)</p>
</dd>
<dt><a href="#prime">prime</a> ⇒ <code>Promise</code></dt>
<dd><p>A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#egcdReturn">egcdReturn</a> : <code>Object</code></dt>
<dd><p>A triple (g, x, y), such that ax + by = g = gcd(a, b).</p>
</dd>
</dl>

<a name="abs"></a>

## abs ⇒ <code>bigint</code>
Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0

**Kind**: global constant  
**Returns**: <code>bigint</code> - the absolute value of a  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 

<a name="gcd"></a>

## gcd ⇒ <code>bigint</code>
Greatest-common divisor of two integers based on the iterative binary algorithm.

**Kind**: global constant  
**Returns**: <code>bigint</code> - The greatest common divisor of a and b  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="lcm"></a>

## lcm ⇒ <code>bigint</code>
The least common multiple computed as abs(a*b)/gcd(a,b)

**Kind**: global constant  
**Returns**: <code>bigint</code> - The least common multiple of a and b  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="toZn"></a>

## toZn ⇒ <code>bigint</code>
Finds the smallest positive element that is congruent to a in modulo n

**Kind**: global constant  
**Returns**: <code>bigint</code> - The smallest positive representation of a in modulo n  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> \| <code>bigint</code> | An integer |
| n | <code>number</code> \| <code>bigint</code> | The modulo |

<a name="eGcd"></a>

## eGcd ⇒ [<code>egcdReturn</code>](#egcdReturn)
An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm. 
Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).

**Kind**: global constant  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="modInv"></a>

## modInv ⇒ <code>bigint</code>
Modular inverse.

**Kind**: global constant  
**Returns**: <code>bigint</code> - the inverse modulo n  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> \| <code>bigint</code> | The number to find an inverse for |
| n | <code>number</code> \| <code>bigint</code> | The modulo |

<a name="modPow"></a>

## modPow ⇒ <code>bigint</code>
Modular exponentiation a**b mod n

**Kind**: global constant  
**Returns**: <code>bigint</code> - a**b mod n  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> \| <code>bigint</code> | base |
| b | <code>number</code> \| <code>bigint</code> | exponent |
| n | <code>number</code> \| <code>bigint</code> | modulo |

<a name="randBytes"></a>

## randBytes ⇒ <code>Promise</code>
Secure random bytes for both node and browsers. Browser implementation uses WebWorkers in order to not lock the main process

**Kind**: global constant  
**Returns**: <code>Promise</code> - A promise that resolves to a Buffer/UInt8Array filled with cryptographically secure random bytes  

| Param | Type | Description |
| --- | --- | --- |
| byteLength | <code>number</code> | The desired number of random bytes |
| forceLength | <code>boolean</code> | If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1 |

<a name="randBetween"></a>

## randBetween ⇒ <code>Promise</code>
Returns a cryptographically secure random integer between [min,max]

**Kind**: global constant  
**Returns**: <code>Promise</code> - A promise that resolves to a cryptographically secure random bigint between [min,max]  

| Param | Type | Description |
| --- | --- | --- |
| max | <code>bigint</code> | Returned value will be <= max |
| min | <code>bigint</code> | Returned value will be >= min |

<a name="isProbablyPrime"></a>

## isProbablyPrime ⇒ <code>Promise</code>
The test first tries if any of the first 250 small primes are a factor of the input number and then passes several iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)

**Kind**: global constant  
**Returns**: <code>Promise</code> - A promise that resolve to a boolean that is either true (a probably prime number) or false (definitely composite)  

| Param | Type | Description |
| --- | --- | --- |
| w | <code>bigint</code> | An integer to be tested for primality |
| iterations | <code>number</code> | The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3 |

<a name="prime"></a>

## prime ⇒ <code>Promise</code>
A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator

**Kind**: global constant  
**Returns**: <code>Promise</code> - A promise that resolves to a bigint probable prime of bitLength bits  

| Param | Type | Description |
| --- | --- | --- |
| bitLength | <code>number</code> | The required bit length for the generated prime |
| iterations | <code>number</code> | The number of iterations for the Miller-Rabin Probabilistic Primality Test |

<a name="egcdReturn"></a>

## egcdReturn : <code>Object</code>
A triple (g, x, y), such that ax + by = g = gcd(a, b).

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| g | <code>bigint</code> | 
| x | <code>bigint</code> | 
| y | <code>bigint</code> | 


* * *
