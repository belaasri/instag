// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

app.post('/download', async (req, res) => {
    try {
        const { url } = req.body;
        const postId = extractPostId(url);
        
        const response = await axios.get(`https://www.instagram.com/p/${postId}/?__a=1`);
        const media = response.data.graphql.shortcode_media;
        
        let downloadUrl;
        let type;
        
        if (media.is_video) {
            type = 'video';
            downloadUrl = media.video_url;
        } else {
            type = 'image';
            downloadUrl = media.display_url;
        }

        res.json({ downloadUrl, type });
        
    } catch (error) {
        res.status(400).json({ error: 'Invalid URL or unable to fetch media' });
    }
});

function extractPostId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
