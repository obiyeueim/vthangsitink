const crypto = require('crypto');

module.exports = async (req, res) => {
    // 1. CẤU HÌNH CƠ BẢN
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Cho phép Roblox gọi
    
    const secret = "BANANA_SECRET_VIP_2024"; 
    const link4mToken = "67a2da1f15c56943e24cb1ce"; // API LINK4M CỦA ÔNG
    
    const { key, hwid, shorten } = req.query;

    if (!hwid) return res.status(400).json({ error: "MISSING_HWID" });

    // 2. CHỨC NĂNG RÚT GỌN LINK (MÁY IN TIỀN)
    // Nếu Script hoặc Web gửi yêu cầu ?shorten=true
    if (shorten) {
        const longUrl = `https://${req.headers.host}/?hwid=${hwid}`;
        try {
            // Gọi sang Link4M để rút gọn
            const response = await fetch(`https://link4m.com/api?api=${link4mToken}&url=${encodeURIComponent(longUrl)}`);
            const data = await response.json();
            
            if (data.status === "success" || data.shortenedUrl) {
                return res.status(200).json({ 
                    status: "success", 
                    url: data.shortenedUrl 
                });
            } else {
                return res.status(500).json({ error: "LINK4M_FAIL", detail: data });
            }
        } catch (e) {
            return res.status(500).json({ error: "SERVER_ERROR" });
        }
    }

    // 3. THUẬT TOÁN TẠO KEY (MD5 - 10 GIÂY)
    const timeStep = Math.floor(Date.now() / 10000); 
    
    const generateKey = (step) => {
        const raw = step + secret + hwid;
        const hash = crypto.createHash('md5').update(raw).digest('hex').toUpperCase();
        return `BNN-${hash.substring(0, 4)}-${hash.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);
    
    // Trả về Key cho Web hiển thị
    if (!key) {
        return res.status(200).json({ 
            key: currentKey, 
            ttl: 10 - Math.floor((Date.now() % 10000) / 1000)
        });
    }

    // Kiểm tra Key (Cho phép độ trễ 1 chu kỳ để tránh lag mạng)
    if (key === currentKey || key === generateKey(timeStep - 1)) {
        return res.status(200).json({ status: "success" });
    } else {
        return res.status(403).json({ status: "error" });
    }
};
