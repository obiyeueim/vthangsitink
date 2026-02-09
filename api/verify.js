module.exports = (req, res) => {
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    const secret = "BANANA_CAT_FINAL_2024"; 
    const { key, hwid } = req.query;

    if (!hwid) {
        return res.status(400).json({ error: "MISSING_HWID" });
    }

    const currentTime = Date.now();
    const timeStep = Math.floor(currentTime / 10000); // Chu kỳ 10 giây

    const generateKey = (step) => {
        const raw = secret + step + hwid;
        const encoded = Buffer.from(raw).toString('base64');
        const clean = encoded.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        return `BANANA-${clean.substring(0, 4)}-${clean.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);
    const previousKey = generateKey(timeStep - 1);

    if (!key) {
        return res.status(200).json({ 
            key: currentKey,
            ttl: 10 - Math.floor((currentTime % 10000) / 1000)
        });
    }

    if (key === currentKey || key === previousKey) {
        return res.status(200).json({ status: "success" });
    } else {
        return res.status(403).json({ status: "error" });
    }
};
