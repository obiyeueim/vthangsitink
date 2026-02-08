export default function handler(req, res) {
    const { hwid, key } = req.query;

    if (!hwid || !key) {
        return res.status(200).send("invalid");
    }

    const cleanHwid = hwid.trim();
    const cleanKey = key.trim();

    // THUẬT TOÁN PHẢI GIỐNG HỆT INDEX.HTML
    const secret = "BANANAVIP";
    const expectedKey = "BNN_" + cleanHwid.substring(0, 8).toUpperCase() + "_" + secret;

    if (cleanKey === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
