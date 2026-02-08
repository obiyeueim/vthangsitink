export default function handler(req, res) {
    let { hwid, key } = req.query;
    if (!hwid || !key) return res.status(400).send("invalid");

    // Loại bỏ khoảng trắng thừa nếu có
    hwid = hwid.trim();
    key = key.trim();

    // Thuật toán: Lấy 10 ký tự đầu của HWID rồi viết hoa
    const expectedKey = "BNN_" + hwid.substring(0, 10).toUpperCase();

    if (key === expectedKey) {
        return res.status(200).send("valid");
    } else {
        return res.status(200).send("invalid");
    }
}
