import dotenv from "dotenv";
import db from "./db/dbConnection";
import app from "./app";

dotenv.config();
const port = process.env.PORT || 3000;
db();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
