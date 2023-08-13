const express = require('express');
const fetch = require('node-fetch');
const { json } = require('express'); // Import json from express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(json()); // Use json middleware

app.get('/api/mediaUrls/:username', async (req, res) => {
    const { username } = req.params;
    const apiUrl = `https://www.snapchat.com/add/${username}`;

    try {
        const response = await fetch(apiUrl);
        const htmlText = await response.text();
        
        const mediaUrls = extractMediaUrls(htmlText);
        res.json({ mediaUrls });
    } catch (error) {
        console.error("Error fetching media URLs:", error);
        res.status(500).json({ error: "Error fetching media URLs" });
    }
});

function extractMediaUrls(htmlText) {
    const mediaUrlPattern = /"mediaUrl":"(.*?)"/g;
    const mediaUrls = [];
    
    let match;
    while ((match = mediaUrlPattern.exec(htmlText)) !== null) {
        mediaUrls.push(match[1]);
    }
    
    return mediaUrls;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
