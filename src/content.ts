/**
 * Content script - Captures the current page as WebSketch IR
 */

import type { Capture } from '@websketch/ir';

interface Message {
  type: string;
  data?: any;
}

// Listen for capture requests from popup
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
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

/**
 * Capture the current page as WebSketch IR
 */
function capturePage(): Capture {
  const root = captureElement(document.documentElement);
  
  return {
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
}

/**
 * Recursively capture an element and its children
 */
function captureElement(element: Element): any {
  const computedStyle = window.getComputedStyle(element);
  
  // Basic element info
  const node: any = {
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

  // Capture children
  const children: any[] = [];
  for (const child of element.children) {
    if (child instanceof Element) {
      children.push(captureElement(child));
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
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent?.trim() || '';
    }
  }
  return text || undefined;
}

console.log('WebSketch content script loaded');
