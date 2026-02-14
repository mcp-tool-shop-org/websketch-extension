/**
 * Content script - Captures the current page as WebSketch IR
 *
 * Note: This produces a raw DOM capture (RawCapture), not a compiled
 * WebSketchCapture. Compilation to the IR grammar is a separate step.
 */

import { DEFAULT_LIMITS } from '@mcptoolshop/websketch-ir';

// =============================================================================
// Types
// =============================================================================

interface Message {
  type: string;
  data?: unknown;
}

/** Raw capture produced by the extension (pre-compilation). */
interface RawCapture {
  root: RawNode;
  metadata: {
    url: string;
    title: string;
    timestamp: string;
    viewport: { width: number; height: number };
  };
  warnings?: string[];
}

/** Raw DOM node capture. */
interface RawNode {
  type: string;
  id?: string;
  classes?: string[];
  text?: string;
  bounds: DOMRect;
  styles: {
    display: string;
    position: string;
    visibility: string;
  };
  children?: RawNode[];
}

// =============================================================================
// Limits
// =============================================================================

const MAX_DEPTH = DEFAULT_LIMITS.maxDepth;
const MAX_NODES = DEFAULT_LIMITS.maxNodes;

// =============================================================================
// Message Handler
// =============================================================================

// Listen for capture requests from popup
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === 'CAPTURE_PAGE') {
    try {
      const capture = capturePage();
      sendResponse({ success: true, capture });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      sendResponse({ success: false, error: errorMessage });
    }
    return true; // Keep channel open for async response
  }
});

// =============================================================================
// Capture
// =============================================================================

/**
 * Capture the current page as a raw DOM representation.
 */
function capturePage(): RawCapture {
  const state = { nodeCount: 0, warnings: [] as string[] };
  const root = captureElement(document.documentElement, 0, state);

  const capture: RawCapture = {
    root,
    metadata: {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    },
  };

  if (state.warnings.length > 0) {
    capture.warnings = state.warnings;
  }

  return capture;
}

/**
 * Recursively capture an element and its children.
 * Respects depth and node count limits.
 */
function captureElement(
  element: Element,
  depth: number,
  state: { nodeCount: number; warnings: string[] },
): RawNode {
  state.nodeCount++;

  const computedStyle = window.getComputedStyle(element);

  // Basic element info
  const node: RawNode = {
    type: element.tagName,
    id: element.id || undefined,
    classes: element.className ? element.className.split(' ').filter(Boolean) : undefined,
    text: getTextContent(element),
    bounds: element.getBoundingClientRect(),
    styles: {
      display: computedStyle.display,
      position: computedStyle.position,
      visibility: computedStyle.visibility,
    },
  };

  // Check limits before recursing into children
  if (depth >= MAX_DEPTH) {
    if (element.children.length > 0) {
      state.warnings.push(`Depth limit (${MAX_DEPTH}) reached at ${element.tagName}#${element.id || '?'} — ${element.children.length} children skipped`);
    }
    return node;
  }

  if (state.nodeCount >= MAX_NODES) {
    if (element.children.length > 0) {
      state.warnings.push(`Node limit (${MAX_NODES}) reached — remaining children skipped`);
    }
    return node;
  }

  // Capture children (indexed loop — HTMLCollection lacks [Symbol.iterator] in ES2022)
  const children: RawNode[] = [];
  for (let i = 0; i < element.children.length; i++) {
    if (state.nodeCount >= MAX_NODES) {
      state.warnings.push(`Node limit (${MAX_NODES}) reached — ${element.children.length - children.length} siblings skipped`);
      break;
    }
    const child = element.children[i];
    if (child instanceof Element) {
      children.push(captureElement(child, depth + 1, state));
    }
  }

  if (children.length > 0) {
    node.children = children;
  }

  return node;
}

/**
 * Get direct text content (not including children)
 */
function getTextContent(element: Element): string | undefined {
  let text = '';
  for (let i = 0; i < element.childNodes.length; i++) {
    const childNode = element.childNodes[i];
    if (childNode.nodeType === Node.TEXT_NODE) {
      text += childNode.textContent?.trim() || '';
    }
  }
  return text || undefined;
}

console.log('WebSketch content script loaded');
