export default function handler(req, res) {
  try {
    const { hwid } = req.body
    if (!hwid) return res.status(400).json({})

    const key = "BANANA-" + Buffer.from(hwid).toString("base64").slice(0, 12).toUpperCase()

    res.status(200).json({ key })
  } catch (e) {
    res.status(500).json({ error: "SERVER_ERROR" })
  }
}
