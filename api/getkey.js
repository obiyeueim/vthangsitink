import crypto from "crypto"

const SECRET = "YAMATE_SIX_SECRET"

export default async function handler(req, res) {
  try {
    let body = ""

    req.on("data", chunk => {
      body += chunk
    })

    req.on("end", () => {
      const { hwid } = JSON.parse(body || "{}")
      if (!hwid) return res.status(400).json({ error: "NO_HWID" })

      const key = crypto
        .createHash("sha256")
        .update(hwid + SECRET)
        .digest("hex")
        .slice(0, 32)
        .toUpperCase()

      res.json({ key })
    })
  } catch (e) {
    res.status(500).json({ error: "SERVER_ERROR" })
  }
}
