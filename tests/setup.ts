import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend vitest's expect with testing-library's matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
