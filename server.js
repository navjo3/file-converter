const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const cors = require('cors'); // Optional, for cross-origin requests
const fs = require('fs'); // Import fs module

const app = express();
const PORT = 3000;

const path = require('path');


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'src', 'public', 'index.html'));
});



// Middleware for handling CORS
app.use(cors());

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

    // Send the converted file to the user
    res.download(outputPath, (err) => {
      if (err) {
        console.error(`Download error: ${err}`);
        return res.status(500).send('Error sending the converted file.');
      }

      // Optionally delete files after download (cleanup)
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
