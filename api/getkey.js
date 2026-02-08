import crypto from "crypto"

const SECRET = "BANANA_HUB_SECRET"

export default function handler(req, res) {
  const { hwid } = req.body
  if (!hwid) return res.json({ error: "NO_HWID" })

  const key = crypto.createHash("sha256")
    .update(hwid + SECRET)
    .digest("hex")
    .slice(0, 32)
    .toUpperCase()

  res.json({ key })
}
