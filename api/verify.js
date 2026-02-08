export default function handler(req, res) {
    // Chống Cache - Ép server luôn tính toán mới
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    // Lấy thời gian hiện tại chính xác đến từng phút
    const timeStep = Math.floor(Date.now() / 60000); 
    const secret = "BANANAVIP";
    
    // Tạo key chuẩn của PHÚT HIỆN TẠI
    const expectedKey = "BNN_" + Buffer.from(hwid.trim() + timeStep + secret).toString('base64').substring(0, 12).toUpperCase();

    if (key.trim() === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
