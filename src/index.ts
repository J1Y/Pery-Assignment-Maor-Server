import express from "express";
const app = express();
console.log("in app");

app.get("/", (req, res) => {
  console.log("in get");

  res.send("hello world!");
});

app.listen(3000, () => {
  console.log(`listening at port ${3000}`);
});
