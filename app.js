const express = require("express");
const app = express();
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.redirect("/KEA-Plan.html");
});
app.listen(process.env.PORT || 3456);