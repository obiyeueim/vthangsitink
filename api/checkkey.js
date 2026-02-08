import crypto from "crypto"

const SECRET = "YAMATE_SIX_SECRET"

export default function handler(req, res) {
  const { hwid, key } = req.body
  if (!hwid || !key) {
    return res.json({ success: false, error: "Missing hwid or key" })
  }

  const realKey = crypto.createHash("sha256")
    .update(hwid + SECRET)
    .digest("hex")
    .slice(0, 32)
    .toUpperCase()

  res.json({
    success: key === realKey,
    expected: realKey // để debug (debug only)
  })
}
