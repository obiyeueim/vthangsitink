const crypto = require('crypto');

export default function handler(req, res) {
    // Cấu hình Headers chống Cache triệt để
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const { hwid, key } = req.query;
    const secret = "BANANAVIP";

    // Lấy thời gian hiện tại (Chu kỳ 10 giây theo yêu cầu)
    // Lưu ý: Cần xử lý độ trễ mạng, cho phép sai số +/- 1 chu kỳ (tolerance)
    const currentTime = Date.now();
    const timeStep = Math.floor(currentTime / 10000); 

    // Hàm tạo Key chuẩn
    const generateKey = (step) => {
        const raw = hwid + step + secret;
        // Giả lập mã hóa Base64 đơn giản theo yêu cầu
        const encoded = Buffer.from(raw).toString('base64');
        return "BNN_" + encoded.substring(0, 12).toUpperCase();
    };

    const currentKey = generateKey(timeStep);
    const previousKey = generateKey(timeStep - 1); // Cho phép key cũ tồn tại thêm 1 chu kỳ để tránh lag

    // Chế độ API: Trả về Key hiện tại cho Web (nếu không gửi key lên để verify)
    if (!key && hwid) {
        return res.status(200).json({ 
            valid_key: currentKey,
            ttl: 10 - Math.floor((currentTime % 10000) / 1000) // Thời gian còn lại của key
        });
    }

    // Chế độ Verify: Kiểm tra Key từ Roblox gửi lên
    if (key === currentKey || key === previousKey) {
        return res.status(200).json({ status: "success", message: "Key Valid" });
    } else {
        return res.status(403).json({ status: "error", message: "Key Expired or Invalid" });
    }
}
