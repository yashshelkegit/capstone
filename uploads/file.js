const express = require("express");
const app = express();

// Create a route to handle the file upload. This route uses the express.json() middleware to parse JSON-encoded bodies, and the express.urlencoded() middleware to parse URL-encoded bodies. Then, it reads the file data from the req.body object and writes it to disk using the fs module.

const fs = require("fs");

app.post(
	"/upload",
	express.json(),
	express.urlencoded({ extended: true }),
	(req, res) => {
		const imageData = req.body.imageData;
		const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
		const buf = Buffer.from(base64Data, "base64");
		const fileName = `${Date.now()}.png`;
		fs.writeFile(`./uploads/${fileName}`, buf, (err) => {
			if (err) {
				console.error(err);
				res.sendStatus(500);
			} else {
				res.json({ filename: fileName });
			}
		});
	}
);

// Create a route to display the uploaded image. This route reads the file from disk using the fs module and sends it as a response with the appropriate content type.

app.get("/uploads/:filename", (req, res) => {
	const fileName = req.params.filename;
	const filePath = `./uploads/${fileName}`;
	const fileType = fileName.slice(fileName.lastIndexOf(".") + 1);
	const fileStream = fs.createReadStream(filePath);
	res.setHeader("Content-Type", `image/${fileType}`);
	fileStream.pipe(res);
});


