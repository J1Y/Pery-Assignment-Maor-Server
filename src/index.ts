import express from "express";
const app = express();
console.log("in app");

app.get("/", (req, res) => {
  console.log("in get");

  res.send("hello world!");
});

app.listen(process.env.PORT, () => {
  console.log(`listening at port ${process.env.PORT}`);
});
