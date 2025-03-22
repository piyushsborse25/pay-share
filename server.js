const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 4200;

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, "dist", "payshare", "browser")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "payshare", "browser", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
