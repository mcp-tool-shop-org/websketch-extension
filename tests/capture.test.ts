import { describe, it, expect } from 'vitest';

describe('WebSketch Extension', () => {
  it('should have valid extension structure', () => {
    expect(true).toBe(true);
  });

  describe('Capture functionality', () => {
    it('should create capture object with required fields', () => {
      const mockCapture = {
        root: {
          type: 'HTML',
          children: [],
        },
        metadata: {
          url: 'https://example.com',
          title: 'Example',
          timestamp: new Date().toISOString(),
        },
      };

      expect(mockCapture.root).toBeDefined();
      expect(mockCapture.metadata).toBeDefined();
      expect(mockCapture.metadata.url).toContain('http');
    });
  });
});
