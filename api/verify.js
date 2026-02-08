export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    const hours6 = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
    const secret = "BANANAVIP";
    const expectedKey = "BNN_" + Buffer.from(hwid.trim() + hours6 + secret).toString('base64').substring(0, 12).toUpperCase();

    if (key.trim() === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
