const express = require("express");
const dotenv = require("dotenv");
const formidable = require("formidable");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const aws = require("aws-sdk");
const fs = require("fs");
const app = express();

const users = [];

dotenv.config();
const apiUrl = process.env.API_URL;

app.use(bodyParser.json());
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

app.get("/api/upload", (req, res) => {
  res.json(users);
});

app.post("/api/upload", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) throw err;
    console.log(err, fields, files);
    const userName = fields.name;
    const fileObj = files.files;
    const fileName = uuidv4() + fileObj.originalFilename;
    const filePath = fileObj.filepath;
    const filestream = fs.createReadStream(filePath);

    const spacesEndpoint = new aws.Endpoint("sgp1.digitaloceanspaces.com");
    const s3 = new aws.S3({
      endpoint: spacesEndpoint,
      accessKeyId: "DO00AGWGBAWFVGJKUVTX",
      secretAccessKey: "83ckcc4GSag+spdD345p1kZ//5rCY0DWk9OZJ4AE03U",
    });

    s3.upload(
      {
        Bucket: "msquarefdc",
        Key: fileName,
        ACL: "public-read",
        Body: filestream,
      },
      (err, data) => {
        if (err) return console.log(err);
        const imgUrl = data.Location;
        const user = { name: userName, url: imgUrl };
        users.push(user);
        return res.end();
      }
    );
  });
});

app.listen(9000, () => {
  console.log("server is listening at port 9000");
});
