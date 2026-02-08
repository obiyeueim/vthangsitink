export default function handler(req, res) {
    // ÉP SERVER KHÔNG ĐƯỢC CACHE (Quan trọng nhất)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    const cleanHwid = hwid.trim();
    const cleanKey = key.trim();
    const secret = "BANANAVIP";

    // Lấy thời gian hiện tại (chia 30s)
    const timeStep = Math.floor(Date.now() / 30000);

    // CHỈ TÍNH TOÁN CHO KHUNG GIỜ HIỆN TẠI
    const expectedKey = "BNN_" + Buffer.from(cleanHwid + timeStep + secret).toString('base64').substring(0, 12).toUpperCase();

    // So sánh
    if (cleanKey === expectedKey) {
        return res.status(200).send("valid");
    } else {
        return res.status(200).send("invalid");
    }
}
