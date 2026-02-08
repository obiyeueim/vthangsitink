export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const { hwid, key } = req.query;
    if (!hwid || !key) return res.status(200).send("invalid");

    const secret = "BANANAVIP";
    const timeStep = Math.floor(Date.now() / 10000); // CHU KỲ 10 GIÂY
    
    const expectedKey = "BNN_" + Buffer.from(hwid.trim() + timeStep.toString() + secret).toString('base64').substring(0, 12).toUpperCase();

    if (key.trim() === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
