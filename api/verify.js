// api/verify.js
export default function handler(req, res) {
    const { hwid, key } = req.query;

    // KEY THẬT CỦA BẠN (Bạn có thể đổi hoặc kết nối Database ở đây)
    const SECRET_KEY = "BANANA_FREE_2026"; 

    if (!hwid || !key) {
        return res.status(400).send("missing_info");
    }

    if (key === SECRET_KEY) {
        return res.status(200).send("valid");
    } else {
        return res.status(200).send("invalid");
    }
}