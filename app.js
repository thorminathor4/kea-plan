import express from "express";
const app = express();
app.use(express.static("public"));
import path from "path";
app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/KEA-Plan.html"));
});
app.listen(process.env.PORT || 3456);