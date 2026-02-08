export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    const secret = "BANANAVIP";
    
    // TẠO LẠI THUẬT TOÁN THEO PHÚT (30 giây mỗi chu kỳ)
    const timeStep = Math.floor(Date.now() / 30000); 
    
    // ĐÂY LÀ CHÌA KHÓA: Key được tạo ra từ HWID + THỜI GIAN + SECRET
    const expectedKey = "BNN_" + Buffer.from(hwid.trim() + timeStep + secret).toString('base64').substring(0, 12).toUpperCase();

    // In ra log để ông kiểm tra trên Vercel Dashboard nếu cần
    console.log("HWID:", hwid, "Expected:", expectedKey, "User Sent:", key);

    if (key.trim() === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
