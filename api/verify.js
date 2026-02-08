export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    // THUẬT TOÁN 1 PHÚT ĐỂ TEST (Phải khớp với index.html)
    const timeStep = Math.floor(Date.now() / (1000 * 60));
    const secret = "BANANAVIP";
    const expectedKey = "BNN_" + Buffer.from(hwid.trim() + timeStep + secret).toString('base64').substring(0, 12).toUpperCase();

    if (key.trim() === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
