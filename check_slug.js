import * as ns from 'slugify';
import defaultImport from 'slugify';

console.log('Namespace keys:', Object.keys(ns));
console.log('Default import type:', typeof defaultImport);
console.log('Default import is function?', typeof defaultImport === 'function');
console.log('Namespace default property?', typeof ns.default);
