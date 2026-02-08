import crypto from "crypto"

const SECRET = "YAMATE_SIX_SECRET"

export default function handler(req, res) {
  const { hwid, key } = req.query
  if (!hwid || !key) return res.json({ success: false })

  const realKey = crypto.createHash("sha256")
    .update(hwid + SECRET)
    .digest("hex")
    .slice(0, 32)
    .toUpperCase()

  res.json({ success: key === realKey })
}