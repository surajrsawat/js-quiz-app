import type { CodingQuestion, McqQuestion, QuizQuestion, QuizTopic } from '@quiz-types/quiz';

type RawQuestion = Omit<McqQuestion, 'topic'> | Omit<CodingQuestion, 'topic'>;

const rawQuestions: RawQuestion[] = [
  // MCQ Questions
  {
    id: 1,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'In JavaScript, applying the typeof operator to the value null produces a surprising result that is widely regarded as a historical bug in the language. What string does typeof null return?',
    options: ['null', 'undefined', 'object', 'string'],
    answer: 'object',
    explanation:
      'typeof null returns "object" due to a legacy bug from JavaScript\'s original implementation. In the early engine, values were stored as tagged pointers and the null pointer shared the object tag (000), so typeof mistakenly returned "object". This behavior has been preserved to avoid breaking existing code.',
  },
  {
    id: 2,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'You have an array and need to remove its last element while also retrieving that removed element in one step. Which built-in Array method mutates the original array by removing and returning its last item?',
    options: ['shift()', 'pop()', 'slice()', 'concat()'],
    answer: 'pop()',
    explanation:
      'Array.prototype.pop() removes the last element from an array in place and returns it. It is the counterpart to push(). shift() removes the first element, slice() returns a shallow copy without mutating, and concat() merges arrays.',
  },
  {
    id: 3,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'JavaScript uses IEEE 754 double-precision floating-point arithmetic, which cannot represent every decimal fraction exactly. Given this, what does the expression 0.1 + 0.2 === 0.3 evaluate to at runtime?',
    options: ['true', 'false', 'NaN', 'throws'],
    answer: 'false',
    explanation:
      '0.1 + 0.2 actually produces 0.30000000000000004 in JavaScript because neither 0.1 nor 0.2 can be represented exactly in binary floating-point. Therefore the strict equality check against 0.3 returns false. Use Number.EPSILON-based comparison or toFixed() when precision matters.',
  },
  {
    id: 4,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'Unlike var, which is hoisted to the function scope, some declaration keywords create variables that are confined to the nearest enclosing block (e.g., inside an if statement or loop body). Which keyword declares a block-scoped variable?',
    options: ['var', 'let', 'delete', 'with'],
    answer: 'let',
    explanation:
      'let declares a block-scoped variable. It is accessible only within the block {} in which it is defined, unlike var which is function-scoped. let is also subject to the Temporal Dead Zone, meaning it cannot be accessed before its declaration in the block.',
  },
  {
    id: 5,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'JavaScript offers two equality operators: loose (==) and strict (===). The strict equality operator skips type coercion entirely and performs a more reliable comparison. What does === compare between two operands?',
    options: ['Value only', 'Type only', 'Value and type', 'Reference only'],
    answer: 'Value and type',
    explanation:
      'The strict equality operator (===) checks both the value and the type of its operands without any type coercion. For example, 1 === "1" is false because number is not equal to string. Use === over == to avoid unexpected coercion bugs.',
  },
  {
    id: 6,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'When you declare a variable without assigning it, or when a function is called without a return statement, JavaScript uses a special primitive value. What string does typeof return when applied to that primitive value, undefined?',
    options: ['undefined', 'null', 'object', 'boolean'],
    answer: 'undefined',
    explanation:
      'typeof undefined returns the string "undefined". This is one of the few typeof checks that is safe even for undeclared variables — typeof undeclaredVar will return "undefined" rather than throwing a ReferenceError.',
  },
  {
    id: 7,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'You have an array of user objects and want to extract only those who are active, producing a new array without modifying the original. Which built-in Array method creates a new array containing only elements for which the callback returns true?',
    options: ['map()', 'filter()', 'forEach()', 'some()'],
    answer: 'filter()',
    explanation:
      'Array.prototype.filter() iterates over each element, calls the provided callback, and builds a new array from elements where the callback returns a truthy value. It does not mutate the original array. map() transforms elements, forEach() has no return value, and some() returns a boolean.',
  },
  {
    id: 8,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'Because typeof [] returns "object" and not "array", JavaScript provides a dedicated static method to reliably check whether a value is an actual Array. What does Array.isArray([]) return when passed an empty array literal?',
    options: ['true', 'false', 'undefined', '0'],
    answer: 'true',
    explanation:
      'Array.isArray([]) returns true. This is the recommended way to check for arrays because typeof [] gives "object", which is ambiguous. Array.isArray() works correctly even across iframe boundaries where instanceof Array may fail.',
  },
  {
    id: 9,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'JavaScript has a set of values that are considered "falsy" — they coerce to false in a boolean context. When you explicitly convert the number 0 to a boolean using the Boolean() function, what does it return?',
    options: ['true', 'false', '0', 'null'],
    answer: 'false',
    explanation:
      'Boolean(0) returns false because 0 is one of JavaScript\'s six falsy values: false, 0, "" (empty string), null, undefined, and NaN. The Boolean() function applies the same coercion as an if statement or the !! double-negation pattern.',
  },
  {
    id: 10,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'When your application receives data from a REST API, the response body typically arrives as a JSON-formatted string. Which built-in JavaScript method converts a valid JSON string into a corresponding JavaScript value or object?',
    options: ['JSON.parse', 'JSON.stringify', 'parseJSON', 'JSON.value'],
    answer: 'JSON.parse',
    explanation:
      'JSON.parse() converts a JSON string into a JavaScript value. For example, JSON.parse(\'{"name":"Alice"}\') returns the object { name: "Alice" }. The reverse operation — converting a JS value to a JSON string — is done with JSON.stringify().',
  },
  {
    id: 11,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'NaN (Not a Number) is the result of invalid numeric operations such as 0/0 or parseInt("abc"). It has a unique property that distinguishes it from every other value in JavaScript. What does the expression NaN === NaN evaluate to?',
    options: ['true', 'false', 'throws', 'null'],
    answer: 'false',
    explanation:
      'NaN === NaN returns false. NaN is the only value in JavaScript that is not equal to itself under either == or ===. To reliably check for NaN, use Number.isNaN() (preferred) or the global isNaN() function.',
  },
  {
    id: 12,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'In JavaScript, functions are first-class values that can be passed around and inspected. When you apply the typeof operator to a function declaration or function expression, what string does it return?',
    options: ['function', 'object', 'method', 'callable'],
    answer: 'function',
    explanation:
      'typeof function(){} returns "function". Although functions are technically objects in JavaScript (they inherit from Function.prototype), the typeof operator has a special case that returns "function" for callable objects. This helps distinguish functions from plain objects.',
  },
  {
    id: 13,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'JavaScript\'s + operator doubles as both addition and string concatenation. When one operand is a number and the other is a string, JavaScript applies implicit type coercion. What is the result of evaluating the expression 2 + "2"?',
    options: ['4', '22', 'NaN', 'TypeError'],
    answer: '22',
    explanation:
      '2 + "2" produces the string "22" because when either operand of + is a string, JavaScript converts the other operand to a string and concatenates them. To perform numeric addition, ensure both operands are numbers: 2 + Number("2") gives 4.',
  },
  {
    id: 14,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'When searching for an element in an array or a substring in a string using indexOf(), the method may not find a match. What sentinel value does indexOf() return to signal that the target was not found?',
    options: ['-1', '0', 'null', 'undefined'],
    answer: '-1',
    explanation:
      'indexOf() returns -1 when the searched value is not found. Returning 0 would be ambiguous because it is a valid index. Always check for the -1 return value before using the index result; many bugs arise from treating a missing-item return as falsy (since 0 is also falsy).',
  },
  {
    id: 15,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'The double negation operator (!!) is a concise idiom for coercing any value to its boolean equivalent — the same result as wrapping it in Boolean(). Because null is a falsy value, what does !!null evaluate to?',
    options: ['true', 'false', 'null', 'undefined'],
    answer: 'false',
    explanation:
      '!!null evaluates to false. The first ! converts null to true (because null is falsy, its negation is truthy), and the second ! negates that truthy value back to false. This is equivalent to Boolean(null) === false.',
  },
  {
    id: 16,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'Sometimes you need a loop to always execute its body at least once — for example, presenting a menu until the user makes a valid choice — regardless of whether the condition is initially true. Which JavaScript looping construct guarantees at least one execution before checking its condition?',
    options: ['for', 'while', 'do...while', 'for...of'],
    answer: 'do...while',
    explanation:
      'The do...while loop executes its body first and then evaluates the condition. This guarantees at least one execution. In contrast, for and while loops evaluate the condition before the first iteration, so they may never execute the body at all.',
  },
  {
    id: 17,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'You need to insert one or more elements at the beginning of an existing array — for instance, prepending a header record to a data list. Which built-in Array method adds elements to the start of the array and returns the array\'s new length?',
    options: ['push()', 'unshift()', 'shift()', 'splice()'],
    answer: 'unshift()',
    explanation:
      'Array.prototype.unshift() inserts one or more elements at the beginning of the array, shifts existing elements to higher indices, and returns the new length. push() adds to the end, shift() removes from the beginning, and splice() can insert at any position.',
  },
  {
    id: 18,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'JavaScript strings expose a length property that reflects how many UTF-16 code units make up the string. For ASCII characters, one character equals one code unit. What does the expression "hello".length return?',
    options: ['4', '5', '6', 'undefined'],
    answer: '5',
    explanation:
      '"hello".length returns 5 because the string contains five characters: h, e, l, l, o. Note that for characters outside the Basic Multilingual Plane (e.g., emoji), length may return a value higher than the visual character count because those characters are represented as surrogate pairs (two code units).',
  },
  {
    id: 19,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'JavaScript\'s abstract equality operator (==) applies type coercion rules defined in the specification. One well-known special case is the comparison between null and undefined without coercing either to a number or boolean. What does null == undefined return?',
    options: ['true', 'false', 'TypeError', 'NaN'],
    answer: 'true',
    explanation:
      'null == undefined returns true by design in the ECMAScript specification. This is one of the few cases where == is considered acceptable: null and undefined are only loosely equal to each other and to nothing else (except themselves). null === undefined is false.',
  },
  {
    id: 20,
    type: 'mcq',
    difficulty: 'Easy',
    question:
      'Arrays in JavaScript are objects, but developers often expect typeof to distinguish them. Applying typeof to an array literal produces a result that surprises many newcomers. What does typeof [] return?',
    options: ['array', 'object', 'list', 'undefined'],
    answer: 'object',
    explanation:
      'typeof [] returns "object" because arrays are objects in JavaScript. There is no "array" type string returned by typeof. Use Array.isArray() to reliably detect arrays, or check the constructor property as a fallback.',
  },
  {
    id: 21,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'The typeof operator always returns a string. Knowing this, consider the nested expression typeof typeof 1: typeof 1 first evaluates to a string, and then typeof is applied to that string. What is the final result?',
    options: ['number', 'string', 'undefined', 'object'],
    answer: 'string',
    explanation:
      'typeof 1 evaluates to the string "number". Applying typeof again to any string always yields "string". So typeof typeof 1 === typeof "number" === "string". This illustrates that typeof always returns one of a fixed set of string values.',
  },
  {
    id: 22,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Variables declared with let and const are hoisted to the top of their block but are not initialized until the declaration is reached — the period in between is called the Temporal Dead Zone. What happens when you try to read a let variable before its declaration?',
    options: ['undefined', 'null', 'ReferenceError', 'SyntaxError'],
    answer: 'ReferenceError',
    explanation:
      'Accessing a let (or const) variable before its declaration in the same block throws a ReferenceError: "Cannot access \'variable\' before initialization". This is in contrast to var, which is hoisted and initialized to undefined, so accessing it early silently returns undefined instead of throwing.',
  },
  {
    id: 23,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Object.freeze() is used to make an object immutable. However, its effect has an important limitation regarding nested objects. Which of the following best describes what Object.freeze(obj) actually does to an object?',
    options: ['Deep freeze', 'Shallow freeze own props', 'Deletes props', 'Converts to JSON'],
    answer: 'Shallow freeze own props',
    explanation:
      'Object.freeze() performs a shallow freeze: it prevents adding, deleting, or modifying the own enumerable properties of the object. However, if a property\'s value is itself an object, that nested object is NOT frozen. To freeze an object deeply, you must recursively freeze all nested objects.',
  },
  {
    id: 24,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'JavaScript coerces values when the + operator is used on non-numeric types. When both operands are empty array literals, each converts to an empty string during the addition. What does the expression [] + [] evaluate to?',
    options: ['[]', '""', '0', 'NaN'],
    answer: '""',
    explanation:
      '[] + [] evaluates to "" (empty string). Each empty array is coerced to a string via its toString() method, which returns "" for an empty array. Concatenating two empty strings gives another empty string.',
  },
  {
    id: 25,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'When using the + operator with an empty array and an empty object literal, JavaScript coerces both to strings. The empty array becomes "" while the plain object becomes "[object Object]". What does [] + {} evaluate to?',
    options: ['"[object Object]"', '"{}"', 'TypeError', 'NaN'],
    answer: '"[object Object]"',
    explanation:
      '[] + {} evaluates to "[object Object]". [] is coerced to "" and {} is coerced to "[object Object]" (via its toString() method from Object.prototype). Concatenating them gives "[object Object]". Note: {} + [] at the start of a statement can produce 0 because {} is parsed as an empty block, not an object literal.',
  },
  {
    id: 26,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'The Temporal Dead Zone (TDZ) is the window of time between when a block\'s scope is entered and when a variable\'s declaration is evaluated — during which accessing that variable throws an error. Which variable declaration keywords are subject to the TDZ?',
    options: ['var', 'let and const', 'function', 'import only'],
    answer: 'let and const',
    explanation:
      'Both let and const are subject to the Temporal Dead Zone. They are hoisted (the engine knows about them at scope creation) but not initialized until their declaration line is reached. var is also hoisted but initialized to undefined immediately, so it has no TDZ. Function declarations are fully hoisted with their definition.',
  },
  {
    id: 27,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'When you access a property on a plain JavaScript object using dot notation or bracket notation, and that property does not exist as an own property or anywhere in the prototype chain, JavaScript does not throw an error. What value is returned?',
    options: ['null', 'undefined', 'ReferenceError', 'false'],
    answer: 'undefined',
    explanation:
      'Accessing a non-existent property on an object returns undefined — JavaScript never throws for a missing property lookup (though it will throw if you then try to access a property on that undefined result). This differs from undeclared variable access, which does throw a ReferenceError.',
  },
  {
    id: 28,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Promise.all() accepts an array of promises and is commonly used to run multiple async operations in parallel. However, it has a specific behavior when at least one of the input promises rejects. What does Promise.all() do in that case?',
    options: ['Resolve partial', 'Reject immediately', 'Ignore reject', 'Retry automatically'],
    answer: 'Reject immediately',
    explanation:
      'Promise.all() rejects immediately as soon as any one of the input promises rejects, with the rejection reason of the first rejected promise. The other pending promises continue to run, but their results are ignored. Use Promise.allSettled() if you need the outcomes of all promises regardless of rejection.',
  },
  {
    id: 29,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'The object spread syntax ({...a, ...b}) is commonly used to merge objects. When both source objects contain a property with the same key name, one of the values will win. Which value is kept in the resulting merged object?',
    options: ['First', 'Last', 'Both', 'Throws'],
    answer: 'Last',
    explanation:
      'When spreading objects with duplicate keys, the last spread wins. In { ...a, ...b }, if both a and b have a property "x", the value from b overwrites the value from a. This makes {...defaults, ...overrides} a common pattern to apply user overrides on top of default settings.',
  },
  {
    id: 30,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Arrow functions were introduced in ES2015 and differ from regular function expressions in several important ways, especially regarding how they handle the this keyword. How is this determined inside an arrow function?',
    options: ['Dynamic', 'Lexical', 'Always window', 'Always null'],
    answer: 'Lexical',
    explanation:
      'Arrow functions capture this lexically — they inherit this from the enclosing scope at the time of their definition, not from how they are called. This makes arrow functions ideal for callbacks inside class methods, where you want to preserve the class instance\'s this rather than having it rebound by the caller.',
  },
  {
    id: 31,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Object.keys() is often used to enumerate an object\'s properties for iteration or transformation. To avoid unexpected behavior, it is important to understand exactly which properties it returns. What does Object.keys() include in its result?',
    options: ['Own enumerable string keys', 'Inherited keys', 'Symbol keys only', 'Values'],
    answer: 'Own enumerable string keys',
    explanation:
      'Object.keys() returns an array of only the object\'s own enumerable string-keyed properties. It does not include inherited properties from the prototype chain, non-enumerable properties, or Symbol-keyed properties. Use Object.getOwnPropertyNames() to include non-enumerable string keys, or Object.getOwnPropertySymbols() for Symbol keys.',
  },
  {
    id: 32,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'In the browser DOM, events propagate through the element hierarchy in a defined order. Bubbling is one phase of event propagation. A click on a deeply nested button, for example, will trigger event listeners on its ancestors as well. In which direction does event bubbling travel?',
    options: ['Parent to child', 'Child to parent', 'None', 'Random'],
    answer: 'Child to parent',
    explanation:
      'Event bubbling travels from the target element upward through its ancestors toward the document root (child to parent). This is the default behavior for most DOM events. The capturing phase travels in the opposite direction (parent to child). You can stop bubbling with event.stopPropagation().',
  },
  {
    id: 33,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Regular functions have their own arguments object containing all passed arguments. Arrow functions, however, do not create their own arguments binding. When you reference the identifier arguments inside an arrow function body, what does it resolve to?',
    options: ['Own arguments', 'Uses outer scope arguments', 'Always empty', 'Always throws'],
    answer: 'Uses outer scope arguments',
    explanation:
      'Arrow functions do not have their own arguments object. When arguments is referenced inside an arrow function, it looks up the scope chain and finds the arguments object of the nearest enclosing non-arrow function. If there is no such function, accessing arguments throws a ReferenceError. Use rest parameters (...args) for a reliable alternative.',
  },
  {
    id: 34,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Closures are one of the most fundamental and powerful concepts in JavaScript, enabling patterns such as data privacy, factory functions, and partial application. Which of the following most accurately describes what a closure is?',
    options: ['Promise chain', 'Function plus lexical scope', 'Class instance', 'Generator'],
    answer: 'Function plus lexical scope',
    explanation:
      'A closure is formed when a function retains a reference to its surrounding lexical scope — the variables that were in scope when the function was defined — even after that outer scope has finished executing. This allows the inner function to "close over" and continue accessing those variables, enabling powerful patterns like module encapsulation and private state.',
  },
  {
    id: 35,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Function.prototype.call() and Function.prototype.apply() are both methods for invoking a function with a specified this value. They differ only in how extra arguments are passed (individually vs. as an array). What fundamental capability do both methods share?',
    options: ['Bind permanently', 'Invoke with explicit this', 'Clone functions', 'Freeze this'],
    answer: 'Invoke with explicit this',
    explanation:
      'Both call() and apply() immediately invoke the function with an explicitly provided this value. call() passes additional arguments individually (fn.call(ctx, a, b)), while apply() takes them as an array (fn.apply(ctx, [a, b])). Neither creates a permanent binding — for that, use bind(), which returns a new function.',
  },
  {
    id: 36,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'NaN is a special value that represents the result of invalid or undefined numeric operations. Despite its name suggesting "Not a Number", applying the typeof operator to NaN yields a somewhat ironic result. What does typeof NaN return?',
    options: ['nan', 'number', 'undefined', 'object'],
    answer: 'number',
    explanation:
      'typeof NaN returns "number". Despite standing for "Not a Number", NaN is of the number type according to the IEEE 754 standard and JavaScript\'s type system. This is why Number.isNaN() exists — to distinguish NaN specifically from other non-numeric values, unlike the global isNaN() which coerces its argument first.',
  },
  {
    id: 37,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'The in operator is used to test for the presence of a property on an object. Unlike hasOwnProperty(), which only checks the object itself, the in operator has broader reach. What exactly does the in operator check when used on a plain object?',
    options: ['Own keys only', 'Property in object/prototype', 'Value in array only', 'Enumerable only'],
    answer: 'Property in object/prototype',
    explanation:
      '"key" in obj returns true if the property exists anywhere on the object or its prototype chain, including inherited properties. For example, "toString" in {} returns true because toString is inherited from Object.prototype. Use obj.hasOwnProperty("key") or Object.hasOwn(obj, "key") to check only own properties.',
  },
  {
    id: 38,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'The delete operator can be applied to object properties to remove them entirely. Its behavior depends on the property\'s configurability attribute. What does delete obj.key typically do when applied to a standard, configurable own property of a plain object?',
    options: ['Sets null', 'Removes configurable property', 'Deletes variable', 'Always errors'],
    answer: 'Removes configurable property',
    explanation:
      'delete obj.key removes the configurable own property from the object and returns true. The property no longer exists on the object afterward. Non-configurable properties (e.g., those created with Object.defineProperty and configurable: false, or properties on frozen objects) cannot be deleted — delete silently fails in sloppy mode and throws in strict mode.',
  },
  {
    id: 39,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'The for...in loop is a convenient way to iterate over an object, but its behavior is frequently misunderstood. It is important to know exactly what it iterates over to avoid unexpected bugs, especially with inherited properties. What does for...in iterate over?',
    options: ['Values', 'Enumerable keys', 'Map entries', 'Indices only'],
    answer: 'Enumerable keys',
    explanation:
      'for...in iterates over all enumerable string keys of an object, including those inherited through the prototype chain. This can produce unexpected results if an object inherits enumerable properties. Use Object.keys() for own-only keys, or check with hasOwnProperty() / Object.hasOwn() inside the loop.',
  },
  {
    id: 40,
    type: 'mcq',
    difficulty: 'Medium',
    question:
      'Optional chaining (?.) is a modern JavaScript operator that allows you to safely traverse deep object paths without manually checking every level for null or undefined. When the chained path encounters a nullish value (null or undefined), what does the expression return instead of throwing?',
    options: ['Throws', 'undefined', 'null', 'false'],
    answer: 'undefined',
    explanation:
      'When optional chaining (?.) encounters null or undefined in the chain, it short-circuits and returns undefined rather than throwing a TypeError. For example, user?.address?.city returns undefined if user or address is nullish. This eliminates the need for verbose null-guard chains like user && user.address && user.address.city.',
  },
  {
    id: 41,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Symbols are a primitive type introduced in ES2015, commonly used as object property keys to avoid naming collisions. Their main advantage over string keys is a core characteristic they possess by design. Why are Symbols particularly useful as object property keys?',
    options: ['JSON serializable', 'Unique', 'Enumerable by default', 'Mutable'],
    answer: 'Unique',
    explanation:
      'Every Symbol() call creates a guaranteed unique value — no two symbols are ever equal, even if created with the same description. This uniqueness makes them ideal as metadata keys on objects (e.g., well-known Symbols like Symbol.iterator) without risk of accidentally overwriting another library\'s keys. Note that Symbols are not serialized by JSON.stringify().',
  },
  {
    id: 42,
    type: 'mcq',
    difficulty: 'High',
    question:
      'WeakMap is a special Map-like collection that holds its keys weakly, meaning they do not prevent garbage collection of the key objects. This weak-reference behavior imposes a restriction on what can be used as keys. What type must WeakMap keys be?',
    options: ['Strings', 'Numbers', 'Objects', 'Any primitive'],
    answer: 'Objects',
    explanation:
      'WeakMap keys must be objects (or registered Symbols in newer specs). Primitive values like strings and numbers cannot be WeakMap keys because they are not garbage-collected as objects are. This restriction enables the weak-reference semantic: when the key object has no other strong references, both the key and its associated value can be garbage-collected.',
  },
  {
    id: 43,
    type: 'mcq',
    difficulty: 'High',
    question:
      'JavaScript\'s event loop processes tasks from multiple queues with different priorities. After the current synchronous call stack is empty, the engine does not immediately pick up the next macrotask (like a setTimeout callback). What does it process first?',
    options: ['Macrotasks', 'Microtasks', 'Render', 'I/O'],
    answer: 'Microtasks',
    explanation:
      'After the call stack empties, the JavaScript engine drains the entire microtask queue before picking up the next macrotask. Microtasks include Promise callbacks (.then/.catch/.finally) and queueMicrotask(). This means a chain of resolved promises will all run before any setTimeout callback, even a setTimeout(fn, 0).',
  },
  {
    id: 44,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Generator functions are special functions that can pause their execution mid-way using the yield keyword, allowing callers to pull values on demand — enabling lazy evaluation, infinite sequences, and custom iterators. What is the correct syntax to declare a generator function?',
    options: ['function*', 'generator()', 'yield fn', 'gen =>'],
    answer: 'function*',
    explanation:
      'Generator functions are declared with the function* syntax (an asterisk after the function keyword). When called, they return a Generator object which conforms to both the Iterator and Iterable protocols. Each call to .next() on the generator resumes execution until the next yield expression.',
  },
  {
    id: 45,
    type: 'mcq',
    difficulty: 'High',
    question:
      'The Proxy object allows you to create a wrapper around another object (the "target") and customize how fundamental operations — like property access, assignment, enumeration, and function invocation — behave on that object. What is the primary capability Proxy provides?',
    options: ['Deep clone', 'Intercept object operations', 'Type cast', 'Freeze objects'],
    answer: 'Intercept object operations',
    explanation:
      'A Proxy intercepts and redefines fundamental object operations through "traps" — handler functions for operations like get (property read), set (property write), has (in operator), deleteProperty, and more. This powers advanced patterns like validation, observable state, and virtual properties, and is the mechanism behind Vue 3\'s reactivity system.',
  },
  {
    id: 46,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Calling the Array constructor with a single numeric argument behaves very differently from calling it with multiple arguments or using an array literal. This is a common source of bugs. What does new Array(3) actually create?',
    options: ['[3]', 'three empty slots', 'three zeros', 'error'],
    answer: 'three empty slots',
    explanation:
      'new Array(3) creates a sparse array with a length of 3 but no actual element values — three "empty slots". These slots behave differently from explicitly set undefined values: many array methods (map, filter, forEach) skip empty slots entirely. Use Array.from({ length: 3 }, () => 0) to create an array of three zeros reliably.',
  },
  {
    id: 47,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Object.create() allows you to create a new object with a specified prototype. Passing null as the prototype argument creates an object that is completely bare — it does not inherit anything. What is unique about an object created with Object.create(null)?',
    options: ['Object.prototype', 'No prototype', 'Array prototype', 'Sealed prototype'],
    answer: 'No prototype',
    explanation:
      'Object.create(null) creates a "pure dictionary" object with no prototype at all — not even Object.prototype. This means it lacks methods like toString(), hasOwnProperty(), and valueOf(). Such objects are useful as safe hash maps since they are immune to prototype pollution and won\'t conflict with inherited property names.',
  },
  {
    id: 48,
    type: 'mcq',
    difficulty: 'High',
    question:
      'The instanceof operator tests whether a constructor\'s prototype appears somewhere in the prototype chain of an object. This means it reflects class hierarchy, not just the immediate constructor. What mechanism does instanceof use to determine its result?',
    options: ['Name string', 'Prototype chain', 'Keys', 'Value equality'],
    answer: 'Prototype chain',
    explanation:
      'instanceof walks the prototype chain of the left-hand value and checks whether the .prototype property of the right-hand constructor appears anywhere in that chain. For example, [] instanceof Array is true because Array.prototype is in the prototype chain of arrays. Note: instanceof can be unreliable across different realms (e.g., iframes).',
  },
  {
    id: 49,
    type: 'mcq',
    difficulty: 'High',
    question:
      'JavaScript uses prototypal inheritance — when you access a property on an object, the engine searches for it in a chain of linked objects. Understanding where this search starts is key to predicting property resolution behavior. Where does JavaScript start looking when you access a property on an object?',
    options: ['Prototype chain', 'Own object', 'Global object', 'Random'],
    answer: 'Own object',
    explanation:
      'Property lookup begins on the object itself (own properties). If the property is not found there, JavaScript follows the [[Prototype]] link to the next object in the chain, and continues until the property is found or the chain ends at null. Own properties shadow inherited ones, which is the basis for method overriding in prototype-based inheritance.',
  },
  {
    id: 50,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Every property in JavaScript has a set of metadata attributes — called a property descriptor — that control its behavior, such as whether it can be written, enumerated, or deleted. Object.getOwnPropertyDescriptor() lets you inspect these attributes. What does it return?',
    options: ['Value only', 'Descriptor metadata', 'All descriptors', 'Prototype descriptor'],
    answer: 'Descriptor metadata',
    explanation:
      'Object.getOwnPropertyDescriptor(obj, "key") returns a descriptor object containing attributes such as value, writable, enumerable, and configurable for data properties, or get and set for accessor properties. It only inspects a single named property and only own properties — it returns undefined for inherited or missing properties.',
  },
  {
    id: 51,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Tagged template literals are an advanced form of template literals where a tag function is called with the template\'s parts and interpolated values. They are used in libraries like styled-components and GraphQL clients. What capability do tagged template literals provide?',
    options: ['Disable interpolation', 'Process template with tag fn', 'Create classes', 'Parse JSON'],
    answer: 'Process template with tag fn',
    explanation:
      'A tagged template literal calls a function (the tag) with the raw string parts and the evaluated interpolated values as separate arguments, giving you full control over how the final string is constructed. The tag function can sanitize inputs, translate strings, apply CSS, or even return a non-string value. For example: gql`query { user }` in GraphQL clients.',
  },
  {
    id: 52,
    type: 'mcq',
    difficulty: 'High',
    question:
      'When running multiple async operations in parallel, you may want the outcome of every operation regardless of whether some fail. Unlike Promise.all(), which short-circuits on the first rejection, Promise.allSettled() has different failure-handling semantics. What does Promise.allSettled() do?',
    options: ['Reject fast', 'Waits all and returns statuses', 'Runs sequentially', 'Cancels pending'],
    answer: 'Waits all and returns statuses',
    explanation:
      'Promise.allSettled() waits for all input promises to settle (either fulfill or reject) and then resolves with an array of descriptor objects — each having a status of "fulfilled" or "rejected", plus the value or reason. This is ideal when you need results from all operations even if some fail, such as running a batch of API requests.',
  },
  {
    id: 53,
    type: 'mcq',
    difficulty: 'High',
    question:
      'In non-strict (sloppy) mode, a regular function called without an explicit receiver defaults this to the global object (window in browsers). Strict mode changes this behavior to prevent accidental global object mutation. What is the value of this inside a plain function called in strict mode without an explicit receiver?',
    options: ['window', 'global', 'undefined', 'function'],
    answer: 'undefined',
    explanation:
      'In strict mode, the value of this for a plain function call (not a method call, new, or call/apply/bind) is undefined rather than the global object. This prevents bugs where a method inadvertently modifies the global scope when called without a receiver. Arrow functions are unaffected since they always inherit this lexically.',
  },
  {
    id: 54,
    type: 'mcq',
    difficulty: 'High',
    question:
      'The Reflect object, introduced in ES2015 alongside Proxy, provides a collection of static methods that mirror and formalize the internal object operations of the JavaScript engine. What kind of capability does the Reflect API provide to developers?',
    options: ['DOM helpers', 'Function-based object operations', 'Date parser', 'Timer controls'],
    answer: 'Function-based object operations',
    explanation:
      'The Reflect API provides function-form alternatives to operators and internal JavaScript object operations — e.g., Reflect.get(), Reflect.set(), Reflect.has(), Reflect.deleteProperty(), and Reflect.apply(). It complements the Proxy API by giving a clean way to forward intercepted operations to the default behavior within Proxy traps.',
  },
  {
    id: 55,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Object.seal() locks an object so that no new properties can be added and no existing properties can be removed or have their configurability changed. However, it does not make all properties immutable. What operations are still permitted on a sealed object\'s existing properties?',
    options: ['Add props', 'Remove props', 'Update existing writable props', 'Change prototype'],
    answer: 'Update existing writable props',
    explanation:
      'Object.seal() prevents adding new properties, deleting existing ones, and changing property descriptors. However, existing properties that were already writable can still be assigned new values. This is the key distinction between Object.seal() (allows value updates) and Object.freeze() (prevents value updates as well).',
  },
  {
    id: 56,
    type: 'mcq',
    difficulty: 'High',
    question:
      'A Promise has a well-defined lifecycle: it starts in the "pending" state and eventually transitions to either "fulfilled" or "rejected" — collectively called "settled". Once settled, its state and value are permanently fixed. How many times can a promise transition from pending to a settled state?',
    options: ['Many times', 'Once from pending to settled', 'On each then', 'Only in async fn'],
    answer: 'Once from pending to settled',
    explanation:
      'A Promise can only settle once — it transitions from "pending" to either "fulfilled" or "rejected" exactly once, and that state and value are immutable thereafter. Any further calls to resolve or reject on the same promise executor are silently ignored. This immutability is central to the trustworthiness of Promises for async coordination.',
  },
  {
    id: 57,
    type: 'mcq',
    difficulty: 'High',
    question:
      'A common misconception is that setTimeout(fn, 0) schedules fn to run immediately after the current code. In reality, 0ms just means "as soon as possible" in the macrotask queue. Considering JavaScript\'s event loop, when does setTimeout(fn, 0) actually execute fn?',
    options: ['Immediate sync run', 'Queued macrotask after microtasks', 'Before promises', 'Exactly 0ms run'],
    answer: 'Queued macrotask after microtasks',
    explanation:
      'setTimeout(fn, 0) queues fn as a macrotask. The event loop first completes all synchronous code, then drains the entire microtask queue (which includes all resolved Promise callbacks), and only then picks up the next macrotask from the queue. So Promise.resolve().then(...) will always run before a setTimeout(fn, 0) scheduled in the same turn.',
  },
  {
    id: 58,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Because NaN is not equal to itself under both == and ===, testing for NaN requires a special approach. A built-in utility in JavaScript handles this edge case correctly by using the SameValue algorithm, which considers NaN equal to NaN and -0 not equal to +0. Which method is it?',
    options: ['==', '===', 'Object.is', 'Both == and ==='],
    answer: 'Object.is',
    explanation:
      'Object.is(NaN, NaN) returns true, correctly identifying that both values are NaN. Object.is() uses the SameValue algorithm, which differs from === in exactly two cases: Object.is(NaN, NaN) is true (=== gives false), and Object.is(+0, -0) is false (=== gives true). Number.isNaN() is another reliable option for specifically detecting NaN.',
  },
  {
    id: 59,
    type: 'mcq',
    difficulty: 'High',
    question:
      'Promise.prototype.finally() is used to run cleanup code (like hiding a loading spinner) regardless of whether the promise was fulfilled or rejected. Unlike .then() and .catch(), the finally callback has a specific restriction on what it receives. What arguments does the finally callback get?',
    options: ['Resolved value', 'Rejected reason', 'No args', 'Both'],
    answer: 'No args',
    explanation:
      'The callback passed to .finally() receives no arguments — it cannot tell whether the promise was fulfilled or rejected, nor does it receive the value/reason. This is intentional: finally() is meant for side-effects only (cleanup, teardown). The promise chain transparently passes the original settled value or rejection reason through to subsequent .then()/.catch() handlers.',
  },
  {
    id: 60,
    type: 'mcq',
    difficulty: 'High',
    question:
      'The ECMAScript specification uses the term "thenable" to describe objects that can participate in promise chaining — even if they are not native Promise instances. The async system uses duck typing to recognize them. How is a thenable defined?',
    options: ['Promise instance only', 'Any object with then method', 'Any async function', 'Any generator'],
    answer: 'Any object with then method',
    explanation:
      'A thenable is any object (or function) that has a .then() method. When a native Promise encounters a thenable in a resolution (e.g., returning a thenable from .then()), it adopts the thenable\'s behavior by calling its .then() method. This enables interoperability between different Promise implementations and older libraries that predate native Promises.',
  },

  // Coding Questions
  {
    id: 61,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function reverseString(str) that accepts a string and returns a new string with all its characters in reverse order. For example, reverseString("hello") should return "olleh". Avoid using any built-in reverse() method directly on strings.',
    starterCode: 'function reverseString(str) {\n  return str;\n}',
    expectedAnswer: 'function reverseString(str) {\n  return str.split(\'\').reverse().join(\'\');\n}',
    explanation:
      'Split the string into an array of individual characters using split(\'\'), reverse the array in place using reverse(), then join the characters back into a string with join(\'\').',
  },
  {
    id: 62,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function flattenOne(arr) that takes a nested array and flattens it by exactly one level of depth. For example, flattenOne([1, [2, 3], [4, [5]]]) should return [1, 2, 3, 4, [5]] — inner arrays are unwrapped once, but deeper nesting is preserved.',
    starterCode: 'function flattenOne(arr) {\n  return arr;\n}',
    expectedAnswer: 'function flattenOne(arr) {\n  return arr.reduce((acc, item) => acc.concat(item), []);\n}',
    explanation:
      'Use Array.prototype.reduce() to accumulate items. For each item, concat() it onto the accumulator — concat() automatically unwraps one level of array nesting, so nested arrays are spread into the result while deeper nesting remains intact.',
  },
  {
    id: 63,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a debounce(fn, delay) higher-order function that returns a debounced version of fn. The debounced function should postpone calling fn until delay milliseconds have elapsed since the last invocation. This technique is essential for limiting the rate of expensive operations triggered by rapid user input, such as search-as-you-type or window resize handlers.',
    starterCode: 'function debounce(fn, delay) {\n  return fn;\n}',
    expectedAnswer: 'function debounce(fn, delay) {\n  let timerId;\n  return function debounced(...args) {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}',
    explanation:
      'Maintain a timerId in the closure. Each call clears the previous timer and schedules a fresh one for delay ms. fn is only invoked when the timer fires without being cancelled, i.e., when no new calls have arrived within the delay window.',
  },
  {
    id: 64,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function isPalindrome(str) that returns true if the given string reads the same forwards and backwards (case-insensitive), and false otherwise. For example, isPalindrome("Racecar") should return true, while isPalindrome("hello") should return false.',
    starterCode: 'function isPalindrome(str) {\n  return false;\n}',
    expectedAnswer: 'function isPalindrome(str) {\n  const normalized = str.toLowerCase();\n  return normalized === normalized.split(\'\').reverse().join(\'\');\n}',
    explanation:
      'Normalize the string to lowercase to handle case-insensitive comparison. Then reverse it using split/reverse/join and compare the reversed version to the original. If they are equal, the string is a palindrome.',
  },
  {
    id: 65,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function sumArray(arr) that accepts an array of numbers and returns their total sum. For example, sumArray([1, 2, 3, 4]) should return 10 and sumArray([]) should return 0. Aim for a concise, functional approach using a single array method.',
    starterCode: 'function sumArray(arr) {\n  return 0;\n}',
    expectedAnswer: 'function sumArray(arr) {\n  return arr.reduce((sum, n) => sum + n, 0);\n}',
    explanation:
      'Use Array.prototype.reduce() starting with an initial accumulator of 0. For each element n, add it to the running sum. Providing 0 as the initial value ensures the function correctly returns 0 for an empty array.',
  },
  {
    id: 66,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function countOccurrences(arr, value) that counts how many times value appears in the array arr, using strict equality. For example, countOccurrences([1, 2, 2, 3, 2], 2) should return 3.',
    starterCode: 'function countOccurrences(arr, value) {\n  return 0;\n}',
    expectedAnswer: 'function countOccurrences(arr, value) {\n  return arr.reduce((count, item) => count + (item === value ? 1 : 0), 0);\n}',
    explanation:
      'Use reduce() with an initial count of 0. For each item, increment the count by 1 if item strictly equals value, otherwise add 0. This handles all value types correctly, including NaN (though NaN !== NaN, so this uses strict equality).',
  },
  {
    id: 67,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function capitalizeWords(str) that takes a sentence string and returns a new string where the first letter of every space-separated word is capitalized, with the remaining characters of each word left unchanged. For example, capitalizeWords("hello world") should return "Hello World".',
    starterCode: 'function capitalizeWords(str) {\n  return str;\n}',
    expectedAnswer: 'function capitalizeWords(str) {\n  return str.split(\' \').map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word)).join(\' \');\n}',
    explanation:
      'Split the string on spaces, map each word to a version where the first character is uppercased (using toUpperCase()) and the rest is preserved (using slice(1)), then join with spaces. The empty-word guard handles multiple consecutive spaces.',
  },
  {
    id: 68,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function removeDuplicates(arr) that returns a new array with all duplicate values removed, preserving the original order of first appearances. For example, removeDuplicates([1, 2, 2, 3, 1, 4]) should return [1, 2, 3, 4]. The original array should not be mutated.',
    starterCode: 'function removeDuplicates(arr) {\n  return arr;\n}',
    expectedAnswer: 'function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}',
    explanation:
      'A Set automatically rejects duplicate values and preserves insertion order. Spreading the Set into a new array ([...new Set(arr)]) gives a deduplicated array in the original order. This is the most concise solution, though a filter-with-indexOf approach is also valid.',
  },
  {
    id: 69,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function findMax(arr) that returns the largest number in the given array without using Math.max or spread syntax. For example, findMax([3, 1, 4, 1, 5, 9, 2, 6]) should return 9. Handle the case where you iterate through the entire array.',
    starterCode: 'function findMax(arr) {\n  return 0;\n}',
    expectedAnswer: 'function findMax(arr) {\n  return arr.reduce((max, n) => (n > max ? n : max), -Infinity);\n}',
    explanation:
      'Use reduce() with -Infinity as the initial maximum. For each element n, keep whichever is larger — the running max or n. Starting at -Infinity ensures any real number in the array will be picked, including all negative numbers.',
  },
  {
    id: 70,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function range(start, end) that returns an array of consecutive integers from start to end, both inclusive. For example, range(2, 5) should return [2, 3, 4, 5] and range(1, 1) should return [1].',
    starterCode: 'function range(start, end) {\n  return [];\n}',
    expectedAnswer: 'function range(start, end) {\n  const out = [];\n  for (let i = start; i <= end; i += 1) out.push(i);\n  return out;\n}',
    explanation:
      'Use a for loop starting at start and incrementing by 1 on each iteration until i exceeds end. Push each value into an output array. An alternative is Array.from({ length: end - start + 1 }, (_, i) => start + i).',
  },
  {
    id: 71,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function filterFalsy(arr) that returns a new array with all falsy values removed. Falsy values in JavaScript are: false, 0, "" (empty string), null, undefined, and NaN. For example, filterFalsy([0, 1, false, 2, "", 3, null]) should return [1, 2, 3].',
    starterCode: 'function filterFalsy(arr) {\n  return arr;\n}',
    expectedAnswer: 'function filterFalsy(arr) {\n  return arr.filter(Boolean);\n}',
    explanation:
      'Passing the Boolean constructor as the filter callback is a concise idiom: filter() calls Boolean(item) for each element, which coerces falsy values to false and truthy values to true. Only truthy elements are kept in the resulting array.',
  },
  {
    id: 72,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function truncate(str, maxLen) that shortens a string for display. If str\'s length is within maxLen characters, return it as-is. If it exceeds maxLen, return the first maxLen characters followed by "...". For example, truncate("Hello world", 5) should return "Hello...".',
    starterCode: 'function truncate(str, maxLen) {\n  return str;\n}',
    expectedAnswer: 'function truncate(str, maxLen) {\n  return str.length <= maxLen ? str : str.slice(0, maxLen) + \'...\';\n}',
    explanation:
      'Check whether the string\'s length exceeds maxLen. If not, return it unchanged. If so, use slice(0, maxLen) to take the first maxLen characters and concatenate "..." to signal the truncation. This is a common pattern in UI text rendering.',
  },
  {
    id: 73,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function isEvenBitwise(n) that determines whether a given integer is even using a bitwise operation instead of the modulo operator (%). The least significant bit of an even number is always 0. For example, isEvenBitwise(4) should return true and isEvenBitwise(7) should return false.',
    starterCode: 'function isEvenBitwise(n) {\n  return false;\n}',
    expectedAnswer: 'function isEvenBitwise(n) {\n  return (n & 1) === 0;\n}',
    explanation:
      'The bitwise AND operator (&) compares corresponding bits. Any even number in binary has 0 as its least significant bit. Performing n & 1 isolates that bit: if it is 0, the number is even; if it is 1, the number is odd. This is marginally faster than the modulo approach and a classic bit-manipulation pattern.',
  },
  {
    id: 74,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function toCamelCase(input) that converts a kebab-case string (words separated by hyphens) into camelCase. For example, toCamelCase("hello-world") should return "helloWorld" and toCamelCase("my-component-name") should return "myComponentName".',
    starterCode: 'function toCamelCase(input) {\n  return input;\n}',
    expectedAnswer: 'function toCamelCase(input) {\n  return input.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());\n}',
    explanation:
      'Use String.prototype.replace() with a regular expression that matches a hyphen followed by a lowercase letter (/-([a-z])/g). The replacement callback receives the matched character after the hyphen as a captured group and returns it uppercased, effectively converting kebab-case segments into camelCase.',
  },
  {
    id: 75,
    type: 'coding',
    difficulty: 'Easy',
    question:
      'Implement a function countVowels(str) that counts the total number of vowel characters (a, e, i, o, u) in the given string, treating uppercase and lowercase as equivalent. For example, countVowels("Hello World") should return 3 (e, o, o).',
    starterCode: 'function countVowels(str) {\n  return 0;\n}',
    expectedAnswer: 'function countVowels(str) {\n  return (str.match(/[aeiou]/gi) || []).length;\n}',
    explanation:
      'Use String.prototype.match() with a regular expression /[aeiou]/gi — the character class [aeiou] matches any vowel, the g flag finds all matches, and the i flag makes the match case-insensitive. match() returns null when there are no matches, so falling back to [] ensures .length returns 0 rather than throwing.',
  },
  {
    id: 76,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a throttle(fn, limit) higher-order function that ensures fn is invoked at most once per limit milliseconds, no matter how frequently the returned throttled function is called. This is commonly used for scroll and resize handlers to prevent performance issues from too-frequent updates.',
    starterCode: 'function throttle(fn, limit) {\n  return fn;\n}',
    expectedAnswer: 'function throttle(fn, limit) {\n  let waiting = false;\n  return function throttled(...args) {\n    if (waiting) return;\n    waiting = true;\n    fn.apply(this, args);\n    setTimeout(() => { waiting = false; }, limit);\n  };\n}',
    explanation:
      'A boolean flag (waiting) acts as a gate. When fn is invoked, the flag is set to true and a timer is started for limit ms. Any calls during that window are ignored. After the timer fires, the flag resets, allowing fn to be called again. Unlike debounce, throttle guarantees regular periodic invocations.',
  },
  {
    id: 77,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function deepClone(value) that creates a fully independent deep copy of a plain object or array, including all nested objects and arrays at every level. The clone must share no object references with the original, so mutating the clone should not affect the original and vice versa.',
    starterCode: 'function deepClone(value) {\n  return value;\n}',
    expectedAnswer: 'function deepClone(value) {\n  if (value === null || typeof value !== "object") return value;\n  if (Array.isArray(value)) return value.map(deepClone);\n  const out = {};\n  for (const key of Object.keys(value)) out[key] = deepClone(value[key]);\n  return out;\n}',
    explanation:
      'Handle primitives and null first — they are immutable so returning them directly is safe. For arrays, map each element through deepClone recursively. For plain objects, iterate own keys and recursively deep-clone each value into a new object. This handles arbitrary nesting but intentionally excludes special objects like Date, Map, or Set.',
  },
  {
    id: 78,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function memoize(fn) that returns a memoized version of a single-argument function fn. The memoized wrapper should cache the return value for each unique argument, so that calling it with the same argument again returns the cached result without re-executing fn. This is useful for expensive pure computations like recursive Fibonacci.',
    starterCode: 'function memoize(fn) {\n  return fn;\n}',
    expectedAnswer: 'function memoize(fn) {\n  const cache = new Map();\n  return function memoized(arg) {\n    if (cache.has(arg)) return cache.get(arg);\n    const result = fn.call(this, arg);\n    cache.set(arg, result);\n    return result;\n  };\n}',
    explanation:
      'A Map is used as the cache because it correctly handles any key type, including objects. On each call, check if the cache already contains the argument as a key. If so, return the cached value. Otherwise, compute the result, store it in the cache, and return it. The Map preserves reference equality for object keys.',
  },
  {
    id: 79,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a curry(fn) higher-order function that transforms a multi-argument function into a curried form. The curried function should collect arguments across multiple calls and invoke fn only once enough arguments (matching fn.length) have been provided. For example, curry((a, b, c) => a + b + c)(1)(2)(3) should return 6.',
    starterCode: 'function curry(fn) {\n  return fn;\n}',
    expectedAnswer: 'function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...rest) => curried.apply(this, args.concat(rest));\n  };\n}',
    explanation:
      'The curried function checks if enough arguments have accumulated (args.length >= fn.length). If so, it calls fn with all arguments. Otherwise, it returns a new function that concatenates the new arguments with the ones already collected and recurses. fn.length reflects the number of declared parameters.',
  },
  {
    id: 80,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a pipe(...fns) utility that accepts a series of single-argument functions and returns a new function that applies each function from left to right, feeding the output of each as the input to the next. For example, pipe(x => x * 2, x => x + 1)(3) should return 7 (double first, then add one).',
    starterCode: 'function pipe(...fns) {\n  return (x) => x;\n}',
    expectedAnswer: 'function pipe(...fns) {\n  return (input) => fns.reduce((value, fn) => fn(value), input);\n}',
    explanation:
      'Collect all functions into the fns rest parameter. Return a function that takes an initial input and reduces over fns from left to right — each function receives the output of the previous one. pipe() is the left-to-right counterpart of compose() and maps naturally to data transformation pipelines.',
  },
  {
    id: 81,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function groupBy(arr, key) that groups an array of objects by the value of a shared property. It should return a plain object where each key is a unique property value and the corresponding value is an array of all objects with that property value. For example, groupBy([{type:"a"},{type:"b"},{type:"a"}], "type") should return { a: [{type:"a"},{type:"a"}], b: [{type:"b"}] }.',
    starterCode: 'function groupBy(arr, key) {\n  return {};\n}',
    expectedAnswer: 'function groupBy(arr, key) {\n  return arr.reduce((acc, item) => {\n    const k = item[key];\n    acc[k] = acc[k] || [];\n    acc[k].push(item);\n    return acc;\n  }, {});\n}',
    explanation:
      'Use reduce() with an empty object as the accumulator. For each item, read the grouping key value (item[key]). Initialize the bucket as an empty array if it does not yet exist, then push the item into it. This produces a grouped object in a single linear pass.',
  },
  {
    id: 82,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function chunk(arr, size) that splits an array into consecutive sub-arrays ("chunks") of the given size. The last chunk may be smaller than size if the array length is not divisible evenly. For example, chunk([1, 2, 3, 4, 5], 2) should return [[1, 2], [3, 4], [5]].',
    starterCode: 'function chunk(arr, size) {\n  return [];\n}',
    expectedAnswer: 'function chunk(arr, size) {\n  const out = [];\n  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));\n  return out;\n}',
    explanation:
      'Iterate through the array with a step of size. On each iteration, use slice(i, i + size) to extract a chunk of up to size elements and push it into the output array. slice() safely handles the final partial chunk when fewer than size elements remain.',
  },
  {
    id: 83,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function intersection(arr1, arr2) that returns a new array containing only the unique values that appear in both input arrays, preserving the order of first appearances from arr1. For example, intersection([1, 2, 3, 2], [2, 3, 4]) should return [2, 3].',
    starterCode: 'function intersection(arr1, arr2) {\n  return [];\n}',
    expectedAnswer: 'function intersection(arr1, arr2) {\n  const set = new Set(arr2);\n  return [...new Set(arr1)].filter((x) => set.has(x));\n}',
    explanation:
      'Convert arr2 to a Set for O(1) membership lookups. Deduplicate arr1 with another Set to avoid duplicate results, then filter those unique values to only those also present in arr2\'s Set. This gives an efficient O(n + m) implementation.',
  },
  {
    id: 84,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function once(fn) that returns a wrapper function which calls fn at most once. The first call executes fn and caches its return value. All subsequent calls ignore any arguments and return the cached result without re-invoking fn. This pattern is common for one-time initialization logic.',
    starterCode: 'function once(fn) {\n  return fn;\n}',
    expectedAnswer: 'function once(fn) {\n  let called = false;\n  let result;\n  return function wrapped(...args) {\n    if (called) return result;\n    called = true;\n    result = fn.apply(this, args);\n    return result;\n  };\n}',
    explanation:
      'Two variables in the closure track state: a boolean called (whether fn has been invoked) and result (the cached return value). On the first call, called is set to true and fn is executed. On all subsequent calls, the early return immediately provides the cached result, preventing fn from running again.',
  },
  {
    id: 85,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function pick(obj, keys) that creates a new object containing only the properties from obj whose keys appear in the keys array. Properties listed in keys but not present on obj should be silently omitted. For example, pick({ a: 1, b: 2, c: 3 }, ["a", "c"]) should return { a: 1, c: 3 }.',
    starterCode: 'function pick(obj, keys) {\n  return {};\n}',
    expectedAnswer: 'function pick(obj, keys) {\n  return keys.reduce((acc, key) => {\n    if (key in obj) acc[key] = obj[key];\n    return acc;\n  }, {});\n}',
    explanation:
      'Use reduce() over the desired keys array, building a new accumulator object. For each key, use the in operator to confirm the property exists on obj (including inherited properties) before copying it. The result contains only the requested keys that are actually present.',
  },
  {
    id: 86,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function omit(obj, keys) that creates a new object by copying all own properties from obj except those whose keys appear in the keys array. For example, omit({ a: 1, b: 2, c: 3 }, ["b"]) should return { a: 1, c: 3 }. The original object should not be mutated.',
    starterCode: 'function omit(obj, keys) {\n  return obj;\n}',
    expectedAnswer: 'function omit(obj, keys) {\n  const excluded = new Set(keys);\n  return Object.keys(obj).reduce((acc, key) => {\n    if (!excluded.has(key)) acc[key] = obj[key];\n    return acc;\n  }, {});\n}',
    explanation:
      'Convert the keys array to a Set for O(1) lookup efficiency. Iterate over obj\'s own enumerable keys using Object.keys(), copying each one into the accumulator unless it appears in the exclusion Set. This is the complement of pick().',
  },
  {
    id: 87,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a function zip(arr1, arr2) that pairs elements from two arrays by their index, producing an array of two-element tuples. If the arrays have different lengths, stop at the shorter one. For example, zip([1, 2, 3], ["a", "b"]) should return [[1, "a"], [2, "b"]].',
    starterCode: 'function zip(arr1, arr2) {\n  return [];\n}',
    expectedAnswer: 'function zip(arr1, arr2) {\n  const len = Math.min(arr1.length, arr2.length);\n  const out = [];\n  for (let i = 0; i < len; i += 1) out.push([arr1[i], arr2[i]]);\n  return out;\n}',
    explanation:
      'Determine the iteration length as the minimum of the two array lengths using Math.min(), so no index goes out of bounds. Loop up to that length, pairing the element from each array at the same index into a two-element array, then push each pair into the output.',
  },
  {
    id: 88,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a function sleep(ms) that returns a Promise which resolves automatically after ms milliseconds. This is a foundational async utility used in testing, rate-limiting, and async/await-based delays without blocking the main thread. For example: await sleep(1000) pauses execution for one second.',
    starterCode: 'function sleep(ms) {\n  return Promise.resolve();\n}',
    expectedAnswer: 'function sleep(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}',
    explanation:
      'Wrap setTimeout in a Promise constructor. Pass the resolve callback directly to setTimeout as the timer handler — after ms milliseconds, setTimeout calls resolve() with no argument, fulfilling the promise. This is idiomatic async delay in JavaScript and works naturally with await.',
  },
  {
    id: 89,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a compose(...fns) utility that accepts a series of single-argument functions and returns a new function that applies them from right to left — the rightmost function is applied first. For example, compose(x => x * 2, x => x + 1)(3) should return 8 (add one first, giving 4, then double, giving 8).',
    starterCode: 'function compose(...fns) {\n  return (x) => x;\n}',
    expectedAnswer: 'function compose(...fns) {\n  return (input) => fns.reduceRight((value, fn) => fn(value), input);\n}',
    explanation:
      'Use Array.prototype.reduceRight() to iterate over the functions array from right to left. The initial value is the input, and each step applies the next (rightward) function to the accumulated result. compose() is the mathematical convention and the right-to-left mirror of pipe().',
  },
  {
    id: 90,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a function deepFlatten(arr) that recursively flattens an arbitrarily nested array into a single flat array, regardless of how deep the nesting goes. For example, deepFlatten([1, [2, [3, [4]]]]) should return [1, 2, 3, 4].',
    starterCode: 'function deepFlatten(arr) {\n  return arr;\n}',
    expectedAnswer: 'function deepFlatten(arr) {\n  return arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? deepFlatten(item) : item), []);\n}',
    explanation:
      'Use reduce() to build the flat output. For each item, check if it is an array with Array.isArray(). If so, recursively call deepFlatten() on it before concatenating (spreading its contents). If not, concatenate the item directly. The recursion bottoms out when all elements are non-arrays.',
  },
  {
    id: 91,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a classNames(...args) function that constructs a CSS class string from a variable number of arguments. Arguments can be strings (included as-is), arrays of strings, or objects (where a key is included only if its value is truthy). Falsy arguments should be ignored. This mirrors the popular clsx/classnames library used widely in React projects.',
    starterCode: 'function classNames(...args) {\n  return "";\n}',
    expectedAnswer: 'function classNames(...args) {\n  return args.flatMap((item) => {\n    if (!item) return [];\n    if (typeof item === "string") return [item];\n    if (Array.isArray(item)) return item;\n    return Object.keys(item).filter((key) => item[key]);\n  }).join(" " );\n}',
    explanation:
      'Use flatMap() to process each argument into an array of class-name strings. Falsy values contribute an empty array (ignored). Strings contribute themselves. Arrays are passed through. Objects contribute only their keys that have truthy values. All contributions are flattened and joined with a space.',
  },
  {
    id: 92,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement a promisify(nodeFn) utility that wraps a Node.js-style callback function — one whose last argument is a callback of the form (err, value) => void — into a function that returns a Promise. This pattern is essential when integrating legacy Node.js callback APIs with modern async/await code.',
    starterCode: 'function promisify(nodeFn) {\n  return function (...args) {};\n}',
    expectedAnswer: 'function promisify(nodeFn) {\n  return function (...args) {\n    return new Promise((resolve, reject) => {\n      nodeFn.call(this, ...args, (err, value) => {\n        if (err) reject(err);\n        else resolve(value);\n      });\n    });\n  };\n}',
    explanation:
      'Return a wrapper function that, when called, creates and returns a new Promise. Inside the Promise executor, call the original nodeFn with the same arguments plus an appended Node.js-style callback. In that callback, reject with the error if one is present, or resolve with the value otherwise.',
  },
  {
    id: 93,
    type: 'coding',
    difficulty: 'Medium',
    question:
      'Implement an EventEmitter class with three methods: on(event, handler) to subscribe to a named event, off(event, handler) to remove a specific handler for a named event, and emit(event, payload) to invoke all currently registered handlers for a named event with the given payload. This publish-subscribe pattern underpins Node.js\'s EventEmitter and many frontend frameworks.',
    starterCode: 'class EventEmitter {\n  on(event, handler) {}\n  off(event, handler) {}\n  emit(event, payload) {}\n}',
    expectedAnswer: 'class EventEmitter {\n  constructor() {\n    this.events = new Map();\n  }\n  on(event, handler) {\n    const list = this.events.get(event) || [];\n    list.push(handler);\n    this.events.set(event, list);\n  }\n  off(event, handler) {\n    const list = (this.events.get(event) || []).filter((h) => h !== handler);\n    this.events.set(event, list);\n  }\n  emit(event, payload) {\n    (this.events.get(event) || []).forEach((h) => h(payload));\n  }\n}',
    explanation:
      'Store event handlers in a Map keyed by event name. on() appends a handler to the event\'s list (creating it if necessary). off() filters out the specific handler by reference equality. emit() iterates all handlers for the event and calls each with the payload. A copy of the list on emit prevents issues if handlers mutate the list during iteration.',
  },
  {
    id: 94,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a function promiseAll(promises) that replicates the behavior of Promise.all(). It should return a Promise that resolves with an array of all resolved values in the original order when every input promise resolves, or rejects immediately with the reason of the first promise that rejects. An empty input array should resolve to an empty array.',
    starterCode: 'function promiseAll(promises) {\n  return Promise.resolve([]);\n}',
    expectedAnswer: 'function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (promises.length === 0) return resolve([]);\n    const out = [];\n    let done = 0;\n    promises.forEach((p, i) => {\n      Promise.resolve(p).then((v) => {\n        out[i] = v;\n        done += 1;\n        if (done === promises.length) resolve(out);\n      }, reject);\n    });\n  });\n}',
    explanation:
      'Create a result array indexed by position to maintain order. Track how many promises have resolved with a counter (done). Each resolution places its value at the correct index and increments the counter. When done equals the total count, resolve with the result array. Any rejection immediately rejects the outer promise via the second argument to .then().',
  },
  {
    id: 95,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a function promiseRace(promises) that replicates the behavior of Promise.race(). It should return a Promise that settles (resolves or rejects) as soon as the first input promise settles, reflecting that first outcome. All other promises continue running but their results are discarded.',
    starterCode: 'function promiseRace(promises) {\n  return Promise.resolve();\n}',
    expectedAnswer: 'function promiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    promises.forEach((p) => Promise.resolve(p).then(resolve, reject));\n  });\n}',
    explanation:
      'Attach resolve and reject to every input promise. Whichever promise settles first will call resolve or reject on the outer Promise. After the first settlement, further calls to resolve or reject are silently ignored (a Promise can only settle once), so only the first outcome is observed.',
  },
  {
    id: 96,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a function myBind(fn, thisArg, ...preset) that replicates the behavior of Function.prototype.bind(). It should return a new function that, when called, invokes fn with this permanently set to thisArg and any preset arguments prepended before any additional arguments provided at call time.',
    starterCode: 'function myBind(fn, thisArg, ...preset) {\n  return fn;\n}',
    expectedAnswer: 'function myBind(fn, thisArg, ...preset) {\n  return function bound(...rest) {\n    return fn.apply(thisArg, [...preset, ...rest]);\n  };\n}',
    explanation:
      'Return a new function (bound) that closes over thisArg and preset. When called, it uses fn.apply() to invoke fn with thisArg as this, passing the preset arguments followed by any additional arguments (...rest). Unlike call/apply, bind() does not invoke the function immediately — it returns a bound function for later use.',
  },
  {
    id: 97,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a function myNew(Ctor, ...args) that replicates the behavior of JavaScript\'s new operator. It should: (1) create a new object whose [[Prototype]] is set to Ctor.prototype, (2) invoke Ctor with that new object as this, passing all args, and (3) return the constructor\'s return value if it is an object or function, otherwise return the newly created object.',
    starterCode: 'function myNew(Ctor, ...args) {\n  return {};\n}',
    expectedAnswer: 'function myNew(Ctor, ...args) {\n  const instance = Object.create(Ctor.prototype);\n  const returned = Ctor.apply(instance, args);\n  return returned && (typeof returned === "object" || typeof returned === "function") ? returned : instance;\n}',
    explanation:
      'Object.create(Ctor.prototype) sets up the correct prototype chain. Ctor is then called with instance as this so it can initialize properties. The constructor can optionally return a different object; the new operator only uses that return value if it is an object or function. Otherwise, the newly created instance is used.',
  },
  {
    id: 98,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement an LRUCache class with a fixed capacity and two O(1) methods: get(key) which returns the cached value or -1 if not present (and marks the key as most recently used), and put(key, value) which inserts or updates the entry and marks it as most recently used, evicting the least-recently-used entry when the cache is full.',
    starterCode: 'class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}',
    expectedAnswer: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const value = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, value);\n    return value;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const oldest = this.map.keys().next().value;\n      this.map.delete(oldest);\n    }\n  }\n}',
    explanation:
      'JavaScript\'s Map preserves insertion order, making it an elegant LRU backing store. To mark a key as recently used, delete it and re-insert it so it appears last in iteration order. The oldest (least recently used) entry is always the first key in the Map. When capacity is exceeded, retrieve and delete that first key.',
  },
  {
    id: 99,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement a function deepMerge(target, source) that recursively merges two plain objects. When both target and source contain a key whose value is a plain (non-array) object, those nested objects should be merged recursively. For all other cases (primitives, arrays, or mismatched types), the source value should overwrite the target value.',
    starterCode: 'function deepMerge(target, source) {\n  return target;\n}',
    expectedAnswer: 'function deepMerge(target, source) {\n  const out = { ...target };\n  for (const key of Object.keys(source)) {\n    const a = out[key];\n    const b = source[key];\n    if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {\n      out[key] = deepMerge(a, b);\n    } else {\n      out[key] = b;\n    }\n  }\n  return out;\n}',
    explanation:
      'Start by shallow-copying target into out to avoid mutation. For each key in source, check whether both the existing value and the incoming value are plain objects (non-null, non-array objects). If so, recursively deep-merge them. Otherwise, let the source value win. Arrays are intentionally replaced rather than merged, which is the most common and predictable behavior.',
  },
  {
    id: 100,
    type: 'coding',
    difficulty: 'High',
    question:
      'Implement an async function retry(fn, times) that calls the async function fn up to times attempts. If fn resolves successfully, return its value immediately. If fn throws, catch the error and retry. If all attempts are exhausted without a successful result, throw the last error encountered. This pattern is essential for resilient API requests and I/O operations that may fail transiently.',
    starterCode: 'async function retry(fn, times) {\n  return fn();\n}',
    expectedAnswer: 'async function retry(fn, times) {\n  let lastError;\n  for (let i = 0; i < times; i += 1) {\n    try {\n      return await fn();\n    } catch (error) {\n      lastError = error;\n    }\n  }\n  throw lastError;\n}',
    explanation:
      'Loop up to times iterations. Inside a try/catch, await fn(). A successful resolve exits the loop with a return, short-circuiting all remaining attempts. A thrown error is caught and stored as lastError; the loop continues to the next attempt. After all attempts fail, throw lastError so the caller can handle the final failure.',
  },
];

const resolveTopic = (questionId: number): QuizTopic => {
  if (questionId <= 20) {
    return 'JavaScript Basics';
  }

  if (questionId <= 40) {
    return 'Language Mechanics';
  }

  if (questionId <= 60) {
    return 'Advanced JavaScript';
  }

  if (questionId <= 80) {
    return 'Data Structures';
  }

  return 'Algorithms';
};

const questions: QuizQuestion[] = rawQuestions.map((question) => ({
  ...question,
  topic: resolveTopic(question.id),
}));

const normalizeQuestion = (text: string) =>
  text.trim().toLowerCase().replaceAll(/\s+/g, ' ');

const ids = new Set<number>();
const normalizedQuestions = new Set<string>();

for (const item of questions) {
  if (ids.has(item.id)) {
    throw new Error(`Duplicate question id found: ${item.id}`);
  }
  ids.add(item.id);

  const normalized = normalizeQuestion(item.question);
  if (normalizedQuestions.has(normalized)) {
    throw new Error(`Duplicate question text found: ${item.question}`);
  }
  normalizedQuestions.add(normalized);
}

export default questions;
