module.exports = (req, res) => {
    // Cấm Cache tuyệt đối
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    
    // Cấu hình mật khẩu
    const secret = "BANANA_VERCEL_VIP"; 
    
    // Lấy tham số (Cách của Vercel)
    const { key, hwid } = req.query;

    // 1. Kiểm tra HWID
    if (!hwid) {
        return res.status(400).json({ error: "MISSING_HWID", message: "Vui long lay link tu Script Roblox!" });
    }

    // 2. Thuật toán 10 Giây
    const currentTime = Date.now();
    const timeStep = Math.floor(currentTime / 10000); // 10 giây

    const generateKey = (step) => {
        const raw = secret + step + hwid;
        const encoded = Buffer.from(raw).toString('base64');
        const clean = encoded.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        return `BANANA-${clean.substring(0, 4)}-${clean.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);
    const previousKey = generateKey(timeStep - 1);

    // 3. Xử lý logic
    if (!key) {
        // Web xin Key
        return res.status(200).json({ 
            key: currentKey,
            ttl: 10 - Math.floor((currentTime % 10000) / 1000)
        });
    }

    // Script check Key
    if (key === currentKey || key === previousKey) {
        return res.status(200).json({ status: "success", message: "Key Valid" });
    } else {
        return res.status(403).json({ status: "error", message: "Key Expired" });
    }
};
