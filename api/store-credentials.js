module.exports = (req, res) => {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // In a real application, you would hash the password
    // and store the credentials in a secure database.
    // For this example, we'll just log them to the Vercel console.
    console.log("Received credentials:");
    console.log("Username:", username);
    console.log("Password:", password);

    res.status(200).json({ message: "Credentials received successfully." });
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
