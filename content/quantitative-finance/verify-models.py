"""Check the exact teaching examples; no market returns are simulated."""
import math
from pathlib import Path

assert math.isclose(math.prod([1.02, 1.01, 1.03, 1.02]), 1.08232812)
assert math.isclose(math.prod([1, .99, .97, .98]), .941094)
assert math.isclose((1.001 ** 10 - 1) * 100, 1.004512021)
assert math.isclose((.999 ** 10 - 1) * 100, -.995511979)
assert math.isclose((.1 + 0 - 1) / 3, -.3)
assert [(i, i + 2) for i in range(5) if i + 2 >= 5] == [(3, 5), (4, 6)]
assert math.isclose(math.sqrt(.02), .1414213562)
for filename, count in [('foundations.md', 5), ('research-cases.md', 6)]:
    parts = Path(__file__).with_name(filename).read_text(encoding='utf-8').split('---DOCUMENT---')
    assert len(parts) == count
    assert all(part.strip().startswith('# ') for part in parts)
print('PASS: document structure and numeric teaching examples')
