module.exports = (req, res) => {
    // Chống Cache
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache');

    const secret = "BANANA_SUPER_SECRET"; 
    const { key, hwid } = req.query; // Lấy thêm hwid từ URL

    // Nếu không có HWID (Vào web trực tiếp không qua link script) -> Báo lỗi
    if (!hwid) {
        return res.status(400).json({ 
            error: "MISSING_HWID", 
            message: "Vui long lay link tu trong Script Roblox!" 
        });
    }

    // Thuật toán: Key = Secret + Time + HWID
    const currentTime = Date.now();
    const timeStep = Math.floor(currentTime / 10000); // 10 giây

    const generateKey = (step) => {
        // Trộn cả HWID vào chuỗi gốc để tạo sự khác biệt cho từng máy
        const raw = secret + step + hwid; 
        const encoded = Buffer.from(raw).toString('base64');
        const clean = encoded.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        return `BANANA-${clean.substring(0, 4)}-${clean.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);
    const previousKey = generateKey(timeStep - 1);

    // 1. Web xin Key (Gửi HWID lên -> Nhận về Key riêng của máy đó)
    if (!key) {
        return res.status(200).json({ 
            key: currentKey,
            ttl: 10 - Math.floor((currentTime % 10000) / 1000)
        });
    }

    // 2. Check Key (Phải khớp cả Key lẫn HWID)
    if (key === currentKey || key === previousKey) {
        return res.status(200).json({ status: "success" });
    } else {
        return res.status(403).json({ status: "error" });
    }
};
