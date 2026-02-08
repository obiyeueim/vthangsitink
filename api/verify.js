export default function handler(req, res) {
    // Lệnh cấm Cache cực mạnh
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    const secret = "BANANAVIP";
    const timeStep = Math.floor(Date.now() / 30000); // 30 giây
    
    const expectedKey = "BNN_" + Buffer.from(hwid.trim() + timeStep + secret).toString('base64').substring(0, 12).toUpperCase();

    if (key.trim() === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
