export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    const timeStep = Math.floor(Date.now() / 30000); // PHẢI KHỚP 30S
    const secret = "BANANAVIP";
    const expectedKey = "BNN_" + Buffer.from(hwid.trim() + timeStep + secret).toString('base64').substring(0, 12).toUpperCase();

    if (key.trim() === expectedKey) res.status(200).send("valid");
    else res.status(200).send("invalid");
}
