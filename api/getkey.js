import crypto from "crypto"

const SECRET = "BANANA_HUB_SECRET"
const EXPIRE_HOURS = 6

export default function handler(req, res) {
  const { hwid } = req.body
  if (!hwid) return res.json({ error: "NO_HWID" })

  const expireAt = Date.now() + EXPIRE_HOURS * 60 * 60 * 1000

  const raw = hwid + "|" + expireAt + "|" + SECRET
  const key = crypto.createHash("sha256")
    .update(raw)
    .digest("hex")
    .slice(0, 32)
    .toUpperCase()

  res.json({
    key,
    expireAt
  })
}
