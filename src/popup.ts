/**
 * Popup script - UI for triggering captures
 */

interface CaptureResponse {
  success: boolean;
  capture?: Record<string, unknown>;
  error?: string;
}

const captureButton = document.getElementById('capture-btn') as HTMLButtonElement;
const statusElement = document.getElementById('status') as HTMLDivElement;
const outputElement = document.getElementById('output') as HTMLPreElement;

captureButton.addEventListener('click', async () => {
  captureButton.disabled = true;
  statusElement.textContent = 'Capturing...';
  outputElement.textContent = '';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.id) {
      throw new Error('No active tab found');
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'CAPTURE_PAGE' }) as CaptureResponse;

    if (response.success && response.capture) {
      statusElement.textContent = 'Capture successful!';
      statusElement.className = 'status success';
      outputElement.textContent = JSON.stringify(response.capture, null, 2);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(JSON.stringify(response.capture));
      statusElement.textContent += ' (Copied to clipboard)';
    } else {
      throw new Error(response.error || 'Capture failed');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    statusElement.textContent = `Error: ${errorMessage}`;
    statusElement.className = 'status error';
  } finally {
    captureButton.disabled = false;
  }
});
