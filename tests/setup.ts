/**
 * Vitest global setup — runs once before each test file.
 *
 * Accounting and game logic tests use the Node environment (no DOM).
 * Add shared mocks here if a module needs browser APIs.
 */

import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
});
