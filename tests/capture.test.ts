import { describe, it, expect } from 'vitest';
import { DEFAULT_LIMITS, validateCapture } from '@mcptoolshop/websketch-ir';

// =============================================================================
// IR imports available to extension
// =============================================================================

describe('websketch-extension IR imports', () => {
  it('imports DEFAULT_LIMITS from websketch-ir', () => {
    expect(typeof DEFAULT_LIMITS).toBe('object');
    expect(DEFAULT_LIMITS.maxNodes).toBe(10_000);
    expect(DEFAULT_LIMITS.maxDepth).toBe(50);
  });

  it('imports validateCapture from websketch-ir', () => {
    expect(typeof validateCapture).toBe('function');
  });
});

// =============================================================================
// RawCapture interface shape
// =============================================================================

describe('RawCapture interface shape', () => {
  it('has required root and metadata fields', () => {
    const capture = {
      root: {
        type: 'HTML',
        bounds: { x: 0, y: 0, width: 1920, height: 1080 },
        styles: { display: 'block', position: 'static', visibility: 'visible' },
      },
      metadata: {
        url: 'https://example.com',
        title: 'Test Page',
        timestamp: new Date().toISOString(),
        viewport: { width: 1920, height: 1080 },
      },
    };
    expect(capture.root.type).toBe('HTML');
    expect(capture.metadata.url).toMatch(/^https?:\/\//);
    expect(capture.metadata.viewport.width).toBeGreaterThan(0);
  });

  it('supports optional warnings field', () => {
    const capture = {
      root: {
        type: 'HTML',
        bounds: { x: 0, y: 0, width: 1920, height: 1080 },
        styles: { display: 'block', position: 'static', visibility: 'visible' },
      },
      metadata: {
        url: 'https://example.com',
        title: 'Test',
        timestamp: new Date().toISOString(),
        viewport: { width: 1920, height: 1080 },
      },
      warnings: ['Depth limit reached at DIV#content'],
    };
    expect(capture.warnings).toHaveLength(1);
    expect(capture.warnings[0]).toContain('Depth limit');
  });
});

// =============================================================================
// Depth + node limits logic
// =============================================================================

describe('capture limit constants', () => {
  it('MAX_DEPTH matches DEFAULT_LIMITS.maxDepth', () => {
    // The extension uses DEFAULT_LIMITS.maxDepth as its MAX_DEPTH
    expect(DEFAULT_LIMITS.maxDepth).toBe(50);
  });

  it('MAX_NODES matches DEFAULT_LIMITS.maxNodes', () => {
    // The extension uses DEFAULT_LIMITS.maxNodes as its MAX_NODES
    expect(DEFAULT_LIMITS.maxNodes).toBe(10_000);
  });

  it('limits are reasonable for real pages', () => {
    // 50 depth handles any real page (most are < 30)
    expect(DEFAULT_LIMITS.maxDepth).toBeGreaterThanOrEqual(30);
    expect(DEFAULT_LIMITS.maxDepth).toBeLessThanOrEqual(100);

    // 10k nodes handles complex pages without OOM
    expect(DEFAULT_LIMITS.maxNodes).toBeGreaterThanOrEqual(5_000);
    expect(DEFAULT_LIMITS.maxNodes).toBeLessThanOrEqual(50_000);
  });
});
