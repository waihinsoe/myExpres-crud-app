const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const apiUrl = process.env.API_URL;
console.log(apiUrl);

app.use(express.static("public"));

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crud-app</title>
  </head>
  <body>
    <script type="text/javascript">
        localStorage.setItem('apiUrl', '${apiUrl}');
        window.location.href = '/';
    </script>
  </body>
</html>
`;

app.get("/api", (req, res) => {
  res.send(html);
});

app.get("/api/users", (req, res) => {
  res.send({ message: "This is user" });
});

app.listen(9000, () => {
  console.log("server is listening at port 9000");
});
