const { kv } = require("@vercel/kv");
const { createHash } = require("crypto");

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // CRITICAL: Hash the password before storing it.
    // Never store plain-text passwords.
    const hashedPassword = createHash("sha256").update(password).digest("hex");

    try {
      // Store the user data in Vercel KV.
      // We'll use the username as part of the key.
      await kv.set(`user:${username}`, { username, password: hashedPassword });

      res.status(200).json({ message: "Credentials stored successfully." });
    } catch (error) {
      console.error("Error storing credentials:", error);
      res.status(500).json({ error: "Failed to store credentials." });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
