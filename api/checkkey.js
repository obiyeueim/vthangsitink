import crypto from "crypto"

const SECRET = "BANANA_HUB_SECRET"

export default function handler(req, res) {
  const { hwid, key, expireAt } = req.query
  if (!hwid || !key || !expireAt) {
    return res.json({ success: false, reason: "MISSING_DATA" })
  }

  if (Date.now() > Number(expireAt)) {
    return res.json({ success: false, reason: "EXPIRED" })
  }

  const raw = hwid + "|" + expireAt + "|" + SECRET
  const realKey = crypto.createHash("sha256")
    .update(raw)
    .digest("hex")
    .slice(0, 32)
    .toUpperCase()

  res.json({ success: key === realKey })
}
