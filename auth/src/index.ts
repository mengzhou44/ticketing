import express from "express";

import { json } from "body-parser";

const app = express();
app.use(json());

app.get('/', (req, res) => {
   res.send("Hello World!")
})

app.listen(4000, () => {
  console.log("version 44")
  console.log("listening on port 4000!");
});
