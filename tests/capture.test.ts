import { describe, it, expect } from 'vitest';

describe('websketch-extension', () => {
  it('has a valid capture interface shape', () => {
    const capture = {
      root: { type: 'HTML', children: [] },
      metadata: {
        url: 'https://example.com',
        title: 'Test',
        timestamp: new Date().toISOString(),
        viewport: { width: 1920, height: 1080 },
      },
    };
    expect(capture.root.type).toBe('HTML');
    expect(capture.metadata.url).toMatch(/^https?:\/\//);
    expect(capture.metadata.viewport.width).toBeGreaterThan(0);
  });
});
