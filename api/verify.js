// Sử dụng thư viện có sẵn của Node.js để tránh lỗi
const crypto = require('crypto');

module.exports = async (req, res) => {
    // 1. Cấu hình Header chuẩn để phản hồi cực nhanh
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*'); 

    // === CẤU HÌNH CỦA BẠN ===
    const secret = "BANANA_SECRET_VIP_2025"; 
    const link4mToken = "67a2da1f15c56943e24cb1ce"; // API Key Link4M của bạn
    
    // Tự động lấy domain hiện tại
    const host = req.headers.host; 
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const myDomain = `${protocol}://${host}`;

    const { key, hwid, shorten } = req.query;

    // Nếu không có HWID thì chặn luôn
    if (!hwid) return res.status(400).json({ error: "MISSING_HWID" });

    // 2. CHỨC NĂNG RÚT GỌN LINK (Link4M V2 - Fix lỗi chậm)
    if (shorten) {
        const destinationUrl = `${myDomain}/?hwid=${hwid}`;
        
        try {
            // URL API V2 chuẩn từ tài liệu Link4M
            const apiUrl = `https://link4m.co/api-shorten/v2?api=${link4mToken}&url=${encodeURIComponent(destinationUrl)}`;
            
            // Giả lập trình duyệt để không bị chặn
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            const data = await response.json();
            
            // Kiểm tra kết quả trả về từ Link4M
            if (data.status === "success" && data.shortenedUrl) {
                return res.status(200).json({ 
                    status: "success", 
                    url: data.shortenedUrl 
                });
            } else {
                // Link4M lỗi -> Trả về link gốc để dùng tạm (Không báo lỗi server nữa)
                return res.status(200).json({ 
                    status: "fallback", 
                    url: destinationUrl,
                    message: "Link4M API Fail"
                });
            }
        } catch (e) {
            // Lỗi mạng -> Trả về link gốc dùng tạm
            return res.status(200).json({ 
                status: "fallback", 
                url: destinationUrl,
                message: "Server Error"
            });
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

    // Trả về Key (cho Web hiển thị)
    if (!key) {
        return res.status(200).json({ 
            key: currentKey, 
            ttl: 10 - Math.floor((Date.now() % 10000) / 1000)
        });
    }

    // Kiểm tra Key (cho Script check)
    if (key === currentKey || key === generateKey(timeStep - 1)) {
        return res.status(200).json({ status: "success" });
    } else {
        return res.status(403).json({ status: "error" });
    }
};
