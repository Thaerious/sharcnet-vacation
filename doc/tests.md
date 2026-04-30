# Tests

This project uses [Vitest](https://vitest.dev/) as the test runner.

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests once
npm test

# Run in watch mode (re-runs on file save)
npm run test:watch
```

Tests run with `TZ=UTC` to ensure date and weekday calculations are consistent
regardless of the host system's local timezone.

## Test Layout

```
tests/
└── unit/
    └── buildData.test.js    # Pure function tests for server/buildData.js
```

| File | What it covers |
|------|---------------|
| `tests/unit/buildData.test.js` | `internationalizeDates`, `expandDatesInRecord`, `humanizeDates`, `addURLsToData`, `addManagersToData` |

## Coverage

```bash
npx c8 npm test
```

`c8` is already installed as a dev dependency and instruments the process via V8's
built-in coverage. Results are printed to stdout; add `--reporter=html` for an HTML
report in `coverage/`.

## Writing New Tests

New test files go under `tests/unit/` (unit tests) or `tests/integration/` (tests that
touch the database or HTTP layer) and must end in `.test.js`. Vitest picks them up
automatically — no registration required.

A minimal test file:

```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../server/myModule.js';

describe('myFunction', () => {
    it('does the thing', () => {
        expect(myFunction('input')).toBe('expected output');
    });
});
```

Use `vi.useFakeTimers()` / `vi.setSystemTime()` when testing code that calls
`new Date()`, and `vi.mock()` to stub external dependencies (email, Google Calendar,
database) in unit tests.
