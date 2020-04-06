var bigintCryptoUtils=function(exports){"use strict";const _ZERO=BigInt(0);const _ONE=BigInt(1);const _TWO=BigInt(2);function abs(a){a=BigInt(a);return a>=_ZERO?a:-a}function bitLength(a){a=BigInt(a);if(a===_ONE){return 1}let bits=1;do{bits++}while((a>>=_ONE)>_ONE);return bits}function eGcd(a,b){a=BigInt(a);b=BigInt(b);if(a<=_ZERO|b<=_ZERO){return NaN}let x=_ZERO;let y=_ONE;let u=_ONE;let v=_ZERO;while(a!==_ZERO){const q=b/a;const r=b%a;const m=x-u*q;const n=y-v*q;b=a;a=r;x=u;y=v;u=m;v=n}return{b:b,x:x,y:y}}function gcd(a,b){a=abs(a);b=abs(b);if(a===_ZERO){return b}else if(b===_ZERO){return a}let shift=_ZERO;while(!((a|b)&_ONE)){a>>=_ONE;b>>=_ONE;shift++}while(!(a&_ONE))a>>=_ONE;do{while(!(b&_ONE))b>>=_ONE;if(a>b){const x=a;a=b;b=x}b-=a}while(b);return a<<shift}async function isProbablyPrime(w,iterations=16){if(typeof w==="number"){w=BigInt(w)}{return new Promise((resolve,reject)=>{const worker=new Worker(_isProbablyPrimeWorkerUrl());worker.onmessage=event=>{worker.terminate();resolve(event.data.isPrime)};worker.onmessageerror=event=>{reject(event)};worker.postMessage({rnd:w,iterations:iterations,id:0})})}}function lcm(a,b){a=BigInt(a);b=BigInt(b);if(a===_ZERO&&b===_ZERO){return _ZERO}return abs(a*b)/gcd(a,b)}function max(a,b){a=BigInt(a);b=BigInt(b);return a>=b?a:b}function min(a,b){a=BigInt(a);b=BigInt(b);return a>=b?b:a}function modInv(a,n){const egcd=eGcd(toZn(a,n),n);if(egcd.b!==_ONE){return NaN}else{return toZn(egcd.x,n)}}function modPow(b,e,n){n=BigInt(n);if(n===_ZERO){return NaN}else if(n===_ONE){return _ZERO}b=toZn(b,n);e=BigInt(e);if(e<_ZERO){return modInv(modPow(b,abs(e),n),n)}let r=_ONE;while(e>0){if(e%_TWO===_ONE){r=r*b%n}e=e/_TWO;b=b**_TWO%n}return r}function prime(bitLength,iterations=16){if(bitLength<1){throw new RangeError(`bitLength MUST be > 0 and it is ${bitLength}`)}return new Promise(resolve=>{const workerList=[];const _onmessage=(msg,newWorker)=>{if(msg.isPrime){for(let j=0;j<workerList.length;j++){workerList[j].terminate()}while(workerList.length){workerList.pop()}resolve(msg.value)}else{const buf=randBits(bitLength,true);const rnd=fromBuffer(buf);try{newWorker.postMessage({rnd:rnd,iterations:iterations,id:msg.id})}catch(error){}}};{const workerURL=_isProbablyPrimeWorkerUrl();for(let i=0;i<self.navigator.hardwareConcurrency;i++){const newWorker=new Worker(workerURL);newWorker.onmessage=event=>_onmessage(event.data,newWorker);workerList.push(newWorker)}}for(let i=0;i<workerList.length;i++){const buf=randBits(bitLength,true);const rnd=fromBuffer(buf);workerList[i].postMessage({rnd:rnd,iterations:iterations,id:i})}})}function primeSync(bitLength,iterations=16){if(bitLength<1){throw new RangeError(`bitLength MUST be > 0 and it is ${bitLength}`)}let rnd=_ZERO;do{rnd=fromBuffer(randBytesSync(bitLength/8,true))}while(!_isProbablyPrime(rnd,iterations));return rnd}function randBetween(max,min=_ONE){if(max<=min)throw new Error("max must be > min");const interval=max-min;const bitLen=bitLength(interval);let rnd;do{const buf=randBits(bitLen);rnd=fromBuffer(buf)}while(rnd>interval);return rnd+min}function randBits(bitLength,forceLength=false){if(bitLength<1){throw new RangeError(`bitLength MUST be > 0 and it is ${bitLength}`)}const byteLength=Math.ceil(bitLength/8);const rndBytes=randBytesSync(byteLength,false);const bitLengthMod8=bitLength%8;if(bitLengthMod8){rndBytes[0]=rndBytes[0]&2**bitLengthMod8-1}if(forceLength){const mask=bitLengthMod8?2**(bitLengthMod8-1):128;rndBytes[0]=rndBytes[0]|mask}return rndBytes}function randBytes(byteLength,forceLength=false){if(byteLength<1){throw new RangeError(`byteLength MUST be > 0 and it is ${byteLength}`)}let buf;{return new Promise((function(resolve){buf=new Uint8Array(byteLength);self.crypto.getRandomValues(buf);if(forceLength){buf[0]=buf[0]|128}resolve(buf)}))}}function randBytesSync(byteLength,forceLength=false){if(byteLength<1){throw new RangeError(`byteLength MUST be > 0 and it is ${byteLength}`)}let buf;{buf=new Uint8Array(byteLength);self.crypto.getRandomValues(buf)}if(forceLength){buf[0]=buf[0]|128}return buf}function toZn(a,n){n=BigInt(n);if(n<=0){return NaN}a=BigInt(a)%n;return a<0?a+n:a}function fromBuffer(buf){let ret=_ZERO;for(const i of buf.values()){const bi=BigInt(i);ret=(ret<<BigInt(8))+bi}return ret}function _isProbablyPrimeWorkerUrl(){let workerCode=`'use strict';const _ZERO = BigInt(0);const _ONE = BigInt(1);const _TWO = BigInt(2);const eGcd = ${eGcd.toString()};const modInv = ${modInv.toString()};const modPow = ${modPow.toString()};const toZn = ${toZn.toString()};const randBits = ${randBits.toString()};const randBytesSync = ${randBytesSync.toString()};const randBetween = ${randBetween.toString()};const isProbablyPrime = ${_isProbablyPrime.toString()};${bitLength.toString()}${fromBuffer.toString()}`;const onmessage=async function(event){const isPrime=await isProbablyPrime(event.data.rnd,event.data.iterations);postMessage({isPrime:isPrime,value:event.data.rnd,id:event.data.id})};workerCode+=`onmessage = ${onmessage.toString()};`;return _workerUrl(workerCode)}function _workerUrl(workerCode){workerCode=`(() => {${workerCode}})()`;const _blob=new Blob([workerCode],{type:"text/javascript"});return window.URL.createObjectURL(_blob)}function _isProbablyPrime(w,iterations=16){if(w===_TWO){return true}else if((w&_ONE)===_ZERO||w===_ONE){return false}const firstPrimes=[3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021,1031,1033,1039,1049,1051,1061,1063,1069,1087,1091,1093,1097,1103,1109,1117,1123,1129,1151,1153,1163,1171,1181,1187,1193,1201,1213,1217,1223,1229,1231,1237,1249,1259,1277,1279,1283,1289,1291,1297,1301,1303,1307,1319,1321,1327,1361,1367,1373,1381,1399,1409,1423,1427,1429,1433,1439,1447,1451,1453,1459,1471,1481,1483,1487,1489,1493,1499,1511,1523,1531,1543,1549,1553,1559,1567,1571,1579,1583,1597];for(let i=0;i<firstPrimes.length&&BigInt(firstPrimes[i])<=w;i++){const p=BigInt(firstPrimes[i]);if(w===p){return true}else if(w%p===_ZERO){return false}}let a=_ZERO;let d=w-_ONE;while(d%_TWO===_ZERO){d/=_TWO;++a}const m=(w-_ONE)/_TWO**a;loop:do{const b=randBetween(w-_ONE,_TWO);let z=modPow(b,m,w);if(z===_ONE||z===w-_ONE){continue}for(let j=1;j<a;j++){z=modPow(z,_TWO,w);if(z===w-_ONE){continue loop}if(z===_ONE){break}}return false}while(--iterations);return true}exports.abs=abs;exports.bitLength=bitLength;exports.eGcd=eGcd;exports.gcd=gcd;exports.isProbablyPrime=isProbablyPrime;exports.lcm=lcm;exports.max=max;exports.min=min;exports.modInv=modInv;exports.modPow=modPow;exports.prime=prime;exports.primeSync=primeSync;exports.randBetween=randBetween;exports.randBits=randBits;exports.randBytes=randBytes;exports.randBytesSync=randBytesSync;exports.toZn=toZn;return exports}({});