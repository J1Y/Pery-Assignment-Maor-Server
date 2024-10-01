import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(process.env.PORT, () => {
  console.log(`listening at port ${process.env.PORT}`);
});
