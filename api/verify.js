const crypto = require('crypto');

module.exports = async (req, res) => {
    // 1. CẤU HÌNH CƠ BẢN
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*'); 

    const secret = "BANANA_SECRET_VIP_2025"; 
    const link4mToken = "67a2da1f15c56943e24cb1ce"; // API Key chuẩn của bạn
    
    // Tự động lấy domain hiện tại (để không phải sửa code nhiều)
    const host = req.headers.host; 
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const myDomain = `${protocol}://${host}`;

    const { key, hwid, shorten } = req.query;

    if (!hwid) return res.status(400).json({ error: "MISSING_HWID" });

    // 2. CHỨC NĂNG RÚT GỌN LINK (ĐÃ FIX CHẶN BOT)
    if (shorten) {
        const destinationUrl = `${myDomain}/?hwid=${hwid}`;
        
        try {
            // URL API V2 chuẩn từ ảnh bạn gửi
            const apiUrl = `https://link4m.co/api-shorten/v2?api=${link4mToken}&url=${encodeURIComponent(destinationUrl)}`;
            
            // THÊM HEADER GIẢ LẬP TRÌNH DUYỆT (QUAN TRỌNG NHẤT)
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            const textData = await response.text(); // Lấy text trước để debug nếu lỗi
            
            try {
                const data = JSON.parse(textData);
                
                // Kiểm tra kết quả theo đúng tài liệu ảnh
                if (data.status === "success" && data.shortenedUrl) {
                    return res.status(200).json({ 
                        status: "success", 
                        url: data.shortenedUrl 
                    });
                } else {
                    // Link4M báo lỗi -> Trả về link gốc (Dự phòng)
                    console.log("Link4M Error:", data);
                    return res.status(200).json({ 
                        status: "fallback", 
                        url: destinationUrl, 
                        message: "Link4M API Error" 
                    });
                }
            } catch (jsonError) {
                // Không phải JSON (có thể là HTML lỗi của Cloudflare)
                return res.status(200).json({ 
                    status: "fallback", 
                    url: destinationUrl,
                    message: "Cloudflare Blocked"
                });
            }

        } catch (e) {
            // Lỗi mạng Vercel -> Trả về link gốc
            return res.status(200).json({ 
                status: "fallback", 
                url: destinationUrl,
                message: "Server Error"
            });
        }
    }

    // 3. TẠO KEY (GIỮ NGUYÊN)
    const timeStep = Math.floor(Date.now() / 10000); 
    const generateKey = (step) => {
        const raw = step + secret + hwid;
        const hash = crypto.createHash('md5').update(raw).digest('hex').toUpperCase();
        return `BNN-${hash.substring(0, 4)}-${hash.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);

    if (!key) {
        return res.status(200).json({ 
            key: currentKey, 
            ttl: 10 - Math.floor((Date.now() % 10000) / 1000)
        });
    }

    if (key === currentKey || key === generateKey(timeStep - 1)) {
        return res.status(200).json({ status: "success" });
    } else {
        return res.status(403).json({ status: "error" });
    }
};
