const crypto = require('crypto');

module.exports = (req, res) => {
    // 1. CHẶN CACHE TRIỆT ĐỂ
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const secret = "BANANA_CAT_FINAL_2024"; 
    const { key, hwid } = req.query;

    if (!hwid) {
        return res.status(400).json({ error: "MISSING_HWID" });
    }

    // 2. TẠO THỜI GIAN (10 GIÂY)
    const timeStep = Math.floor(Date.now() / 10000); 

    // 3. THUẬT TOÁN MD5 (Đảm bảo đổi 1 số là đổi cả dãy Key)
    const generateKey = (step) => {
        // ĐƯA STEP LÊN ĐẦU để thay đổi toàn bộ mã hash
        const rawString = step + secret + hwid;
        const hash = crypto.createHash('md5').update(rawString).digest('hex').toUpperCase();
        
        // Cắt lấy 8 ký tự và format cho đẹp
        return `BNN-${hash.substring(0, 4)}-${hash.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);
    const previousKey = generateKey(timeStep - 1); // Cho phép trễ 1 nhịp mạng

    // TRẢ VỀ JSON
    if (!key) {
        return res.status(200).json({ 
            key: currentKey,
            ttl: 10 - Math.floor((Date.now() % 10000) / 1000)
        });
    }

    if (key === currentKey || key === previousKey) {
        return res.status(200).json({ status: "success" });
    } else {
        return res.status(403).json({ status: "error" });
    }
};
