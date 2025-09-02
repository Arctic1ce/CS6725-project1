const { kv } = require("@vercel/kv");
const { createHash } = require("crypto");
const { createClient } = require("redis");

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const redis = await createClient().connect();

    try {
      // Store the user data in Redis.
      // We'll use the username as part of the key.
      await redis.set(`user:${username}`, { username, password });

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
