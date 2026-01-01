const ImageKit = require('imagekit');

const imagekit = (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT)
    ? new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    })
    : null;

if (!imagekit) {
    console.warn('ImageKit keys are missing. ImageKit functionality will be disabled.');
}

exports.getAuthParameters = (req, res) => {
    try {
        if (!imagekit) {
            return res.status(503).json({ error: 'ImageKit is not configured' });
        }
        const authenticationParameters = imagekit.getAuthenticationParameters();
        res.json(authenticationParameters);
    } catch (error) {
        console.error('ImageKit auth error:', error);
        res.status(500).json({ error: 'Failed to generate authentication parameters' });
    }
};
