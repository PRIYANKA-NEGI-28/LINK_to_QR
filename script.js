/**
 * Link to QR Code Generator
 * Pure JavaScript with qrcodejs library
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const qrForm = document.getElementById('qr-form');
  const urlInput = document.getElementById('url-input');
  const inputClearBtn = document.getElementById('input-clear-btn');
  const generateBtn = document.getElementById('generate-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  
  const qrResultSection = document.getElementById('qr-result-section');
  const qrCodeContainer = document.getElementById('qrcode');
  const previewUrlText = document.getElementById('preview-url-text');
  const urlPreviewPill = document.getElementById('url-preview-pill');
  
  const downloadBtn = document.getElementById('download-btn');
  const copyBtn = document.getElementById('copy-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  let currentQrCodeInstance = null;
  let currentGeneratedUrl = '';
  let toastTimeout = null;

  /**
   * Format & validate URL
   * Accepts http(s)://, or domain names like google.com, localhost, etc.
   */
  function normalizeAndValidateUrl(inputStr) {
    const trimmed = inputStr.trim();
    if (!trimmed) {
      return { isValid: false, error: 'Please enter a URL to generate a QR code.' };
    }

    let urlToTest = trimmed;
    // If no protocol is specified, prepend https:// for testing and standard QR scanning
    if (!/^https?:\/\//i.test(urlToTest)) {
      urlToTest = 'https://' + urlToTest;
    }

    try {
      const parsedUrl = new URL(urlToTest);
      // Ensure there is a valid hostname with at least one dot or is localhost
      const hasValidHost = parsedUrl.hostname.includes('.') || parsedUrl.hostname === 'localhost';
      if (!hasValidHost) {
        return { isValid: false, error: 'Please enter a valid website address (e.g., https://example.com)' };
      }
      return { isValid: true, url: urlToTest };
    } catch (e) {
      return { isValid: false, error: 'Invalid URL format. Please check and try again.' };
    }
  }

  /**
   * Show error banner
   */
  function showError(msg) {
    errorText.textContent = msg;
    errorMessage.classList.add('visible');
    urlInput.focus();
  }

  /**
   * Hide error banner
   */
  function hideError() {
    errorMessage.classList.remove('visible');
  }

  /**
   * Show toast notification
   */
  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  /**
   * Generate QR Code
   */
  function generateQRCode(targetUrl) {
    hideError();

    // Clear previous QR code
    qrCodeContainer.innerHTML = '';

    // Generate new QR code using qrcodejs
    currentQrCodeInstance = new QRCode(qrCodeContainer, {
      text: targetUrl,
      width: 200,
      height: 200,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });

    currentGeneratedUrl = targetUrl;
    previewUrlText.textContent = targetUrl;
    urlPreviewPill.title = targetUrl;

    // Reveal result section with animation
    qrResultSection.classList.remove('hidden');

    // Smooth scroll into view on mobile
    if (window.innerWidth < 640) {
      qrResultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Download QR Code as PNG
   */
  function downloadQRCode() {
    // qrcodejs creates both a <canvas> and an <img> element
    const canvas = qrCodeContainer.querySelector('canvas');
    const img = qrCodeContainer.querySelector('img');

    let dataUrl = '';

    if (canvas) {
      // Create a padded, high-resolution canvas for a clean download
      const padding = 20;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width + padding * 2;
      exportCanvas.height = canvas.height + padding * 2;
      const ctx = exportCanvas.getContext('2d');

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Draw QR code centered
      ctx.drawImage(canvas, padding, padding);
      dataUrl = exportCanvas.toDataURL('image/png');
    } else if (img && img.src) {
      dataUrl = img.src;
    }

    if (!dataUrl) {
      showError('Unable to generate download image. Please try again.');
      return;
    }

    // Create a temporary link and trigger download
    const filename = `qrcode-${Date.now()}.png`;
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    showToast('QR Code downloaded successfully!');
  }

  /**
   * Copy Link to clipboard
   */
  async function copyLinkToClipboard() {
    if (!currentGeneratedUrl) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentGeneratedUrl);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = currentGeneratedUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // Visual feedback on button
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
      copyBtn.style.borderColor = 'var(--success)';
      copyBtn.style.color = 'var(--success)';
      showToast('Link copied to clipboard!');

      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> <span id="copy-btn-text">Copy Link</span>';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Failed to copy link.');
    }
  }

  /**
   * Reset / Clear everything
   */
  function resetAll() {
    urlInput.value = '';
    inputClearBtn.classList.remove('visible');
    hideError();
    qrResultSection.classList.add('hidden');
    qrCodeContainer.innerHTML = '';
    currentGeneratedUrl = '';
    currentQrCodeInstance = null;
    urlInput.focus();
  }

  // --- Event Listeners ---

  // Form Submission
  qrForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawValue = urlInput.value;
    const validation = normalizeAndValidateUrl(rawValue);

    if (!validation.isValid) {
      showError(validation.error);
      return;
    }

    // Update input field if normalized
    urlInput.value = validation.url;
    generateQRCode(validation.url);
  });

  // Input input tracking for clear button and error hiding
  urlInput.addEventListener('input', () => {
    if (urlInput.value.trim().length > 0) {
      inputClearBtn.classList.add('visible');
    } else {
      inputClearBtn.classList.remove('visible');
    }
    hideError();
  });

  // Quick clear text button inside input
  inputClearBtn.addEventListener('click', () => {
    urlInput.value = '';
    inputClearBtn.classList.remove('visible');
    hideError();
    urlInput.focus();
  });

  // Clear all button
  clearAllBtn.addEventListener('click', resetAll);

  // Download button
  downloadBtn.addEventListener('click', downloadQRCode);

  // Copy link button
  copyBtn.addEventListener('click', copyLinkToClipboard);
});
