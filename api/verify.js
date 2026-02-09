const crypto = require('crypto');

module.exports = async (req, res) => {
    // 1. Tối ưu Header để phản hồi nhanh nhất
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    
    // CẤU HÌNH
    const secret = "BANANA_SECRET_VIP_2025"; 
    const link4mToken = "67a2da1f15c56943e24cb1ce"; // API Key của bạn
    const myDomain = "https://key-system-banana-hub.vercel.app"; // Domain Vercel của bạn

    const { key, hwid, shorten } = req.query;

    if (!hwid) return res.status(400).json({ error: "MISSING_HWID" });

    // 2. XỬ LÝ RÚT GỌN LINK (FIX LỖI CHẬM)
    if (shorten) {
        // Link đích cần rút gọn (Vercel kèm HWID)
        const destinationUrl = `${myDomain}/?hwid=${hwid}`;
        
        try {
            // GỌI ĐÚNG LINK API V2 TỪ HÌNH ẢNH CUNG CẤP
            const apiUrl = `https://link4m.co/api-shorten/v2?api=${link4mToken}&url=${encodeURIComponent(destinationUrl)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.status === "success" && data.shortenedUrl) {
                return res.status(200).json({ 
                    status: "success", 
                    url: data.shortenedUrl 
                });
            } else {
                // Nếu lỗi, trả về link gốc để không làm gián đoạn người dùng
                return res.status(200).json({ 
                    status: "error", 
                    url: destinationUrl,
                    message: "Link4M API Error"
                });
            }
        } catch (e) {
            return res.status(500).json({ error: "SERVER_ERROR" });
        }
    }

    // 3. THUẬT TOÁN KEY (MD5 - 10 GIÂY)
    const timeStep = Math.floor(Date.now() / 10000); 
    
    const generateKey = (step) => {
        const raw = step + secret + hwid;
        const hash = crypto.createHash('md5').update(raw).digest('hex').toUpperCase();
        return `BNN-${hash.substring(0, 4)}-${hash.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);
    
    // Trả về Key
    if (!key) {
        return res.status(200).json({ 
            key: currentKey, 
            ttl: 10 - Math.floor((Date.now() % 10000) / 1000)
        });
    }

    // Check Key
    if (key === currentKey || key === generateKey(timeStep - 1)) {
        return res.status(200).json({ status: "success" });
    } else {
        return res.status(403).json({ status: "error" });
    }
};
