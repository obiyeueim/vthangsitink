// api/verify.js
export default function handler(req, res) {
    const { hwid, key } = req.query;

    if (!hwid || !key) return res.status(400).send("missing");

    // Thuật toán tạo Key phải Y HỆT bên trang index.html
    const expectedKey = "BANANA_" + Buffer.from(hwid).toString('base64').substring(0, 8).toUpperCase();

    if (key === expectedKey) {
        res.status(200).send("valid");
    } else {
        res.status(200).send("invalid");
    }
}
