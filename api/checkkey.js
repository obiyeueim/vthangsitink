export default function handler(req, res) {
  try {
    const { hwid, key } = req.query
    if (!hwid || !key) return res.json({ success: false })

    const realKey = "BANANA-" + Buffer.from(hwid).toString("base64").slice(0, 12).toUpperCase()

    res.json({ success: key === realKey })
  } catch (e) {
    res.status(500).json({ success: false })
  }
}
