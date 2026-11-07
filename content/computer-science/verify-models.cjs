// Reproducible toy-model results. No hardware benchmark or network load generation.
const assert = require('node:assert/strict');
const trace = [1,2,3,4,1,2,5,1,2,3,4,5];
function faults(policy, capacity) {
  const memory = []; let count = 0;
  for (const page of trace) {
    const index = memory.indexOf(page);
    if (index < 0) { count++; if (memory.length === capacity) memory.shift(); memory.push(page); }
    else if (policy === 'LRU') { memory.splice(index,1); memory.push(page); }
  }
  return count;
}
assert.deepEqual([faults('FIFO',3),faults('FIFO',4),faults('LRU',3),faults('LRU',4)],[9,10,10,8]);
const leaves = Math.ceil(1e6 / 128), internal = Math.ceil(leaves / 128);
assert.deepEqual([leaves,internal,Math.ceil(internal/128)],[7813,62,1]);
assert.equal(1e9 * 0.08 / 8,10e6);
assert.ok(Math.abs(65536 * 8 / 0.08 / 1e6 - 6.5536) < 1e-9);
assert.ok(Math.abs(1 / (0.2 + 0.8 / 8) - 10/3) < 1e-9);
assert.equal(1000 * 0.2,200);
console.log('PASS: page replacement counts, index-page model, TCP BDP/window bound, Amdahl speedup and in-flight model');
