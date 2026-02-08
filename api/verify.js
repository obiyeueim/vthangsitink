export default function handler(req, res) {
    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    const cleanHwid = hwid.trim();
    const cleanKey = key.trim();

    // Thuật toán 6 giờ (phải khớp 100% với Web)
    const hours6 = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
    const secret = "BANANAVIP";
    
    const expectedKey = "BNN_" + Buffer.from(cleanHwid + hours6 + secret).toString('base64').substring(0, 12).toUpperCase();

    if (cleanKey === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
