const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 80;

// Middleware for handling CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// File conversion route
app.post('/convert', upload.single('file'), (req, res) => {
  const inputPath = req.file.path; // Path to the uploaded file
  const outputFormat = req.body.format; // Format selected by the user
  const outputPath = `uploads/${req.file.filename}.${outputFormat}`; // Output file path

  // Run FFmpeg command
  const command = `ffmpeg -i "${inputPath}" "${outputPath}"`; // Added quotes for safety

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`FFmpeg error: ${stderr}`);
      return res.status(500).send(`Error during file conversion: ${stderr}`); // Improved error message
    }

    console.log(`Conversion stdout: ${stdout}`);
    
    // Send the converted file to the user
    res.download(outputPath, (err) => {
      if (err) {
        console.error(`Download error: ${err}`);
        return res.status(500).send('Error sending the converted file.');
      }

      // Optionally delete files after download (cleanup)
      fs.unlinkSync(inputPath);   // Delete the original uploaded file
      fs.unlinkSync(outputPath);  // Delete the converted file after sending to the user
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
