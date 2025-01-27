// Get references to form elements
const form = document.getElementById('converterForm');
const fileInput = document.getElementById('fileInput');
const formatSelect = document.getElementById('formatSelect');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Ensure a file is selected
  if (!fileInput.files[0]) {
    showMessage('Please upload a file.', 'error');
    return;
  }

  // Validate file type
  const allowedTypes = ['audio/mpeg', 'video/mp4', 'video/x-msvideo']; // Add allowed MIME types
  if (!allowedTypes.includes(fileInput.files[0].type)) {
    showMessage('Invalid file type. Please upload an MP3, MP4, or AVI file.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('format', formatSelect.value);

  try {
    // Send POST request to the backend
    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Conversion failed!');
    }

    // Handle the converted file (download it)
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `converted.${formatSelect.value}`;
    link.click();

    showMessage('File converted successfully!', 'success');
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error during conversion. Please try again.', 'error');
  }
});

function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
}
