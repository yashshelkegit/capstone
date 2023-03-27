import express from "express";
import nodemailer from "nodemailer";
// const loginPage = fs.readFileSync('./public/register.html');

import dotenv from "dotenv";
dotenv.config();

//db imports
import property from "./models/db.js";
import bodyParser from "body-parser";

//for image upload
import fileUpload from "express-fileUpload";

const app = express();
app.use(express.static(process.env.PUBLIC_DIR));
//for db purpose
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//for image upload
app.use(fileUpload());

app.get("/products", (req, res) => {
	// let products;
	console.log("req arrrived");
	property
		.find()
		.then((data) => console.log(res.end(JSON.stringify(data))))
		.catch((err) => console.log(err));
});

// app.get("/login", (req, res) => {
// 	res.redirect("/Users/yashshelke/Desktop/capstone/public/login/");
// });

app.post("/user-property", (req, res) => {
	let accountId = req.body.accountId;
	property
		.find({ accountId: accountId })
		.then((data) => res.end(JSON.stringify(data)))
		.catch((err) => console.log(err));
});

app.post("/form-data", async (req, res) => {
	// console.log(req)
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send("No files were uploaded.");
	}
	const image = req.files.img;

	image.mv(`./public/temp/${image.name}`, (err) => {
		if (err) {
			return res.status(500).send(err);
		}
	});
	const newProperty = new property({
		accountId: req.body.id,
		image: `./temp/${image.name}`,
		type: req.body.type,
		price: req.body.price,
		location: req.body.location,
		desc: req.body.desc,
		contact: req.body.email,
	});

	await newProperty
		.save()
		.then(() => {
			res.status(201).redirect("/");
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

app.get("/delete/:id", (req, res) => {
	property
		.deleteOne({ _id: req.params.id })
		.then((data) => console.log("deleted successfully " + data))
		.catch((err) => console.log(err));
});

app.get("/edit/:id", (req, res) => {
	property
		.findOne({ _id: req.params.id })
		.then((data) => res.end(JSON.stringify(data)))
		.catch((err) => console.log(err));
});

app.post("/update-data/:id", (req, res) => {
	property
		.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					accountId: req.body.id,
					image: `./temp/${req.files.img.name}`,
					type: req.body.type,
					price: req.body.price,
					location: req.body.location,
					desc: req.body.desc,
					contact: req.body.email,
				},
			}
		)
		.then((data) => {
			console.log("updated successfully " + data);
			res.status(201).redirect("/");
		})
		.catch((err) => console.log(err));
});

let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.E_MAIL,
		pass: process.env.E_MAIL_PASSWORD,
	},
});
app.post("/contact", (req, res) => {
	let mailOptions = {
		from: process.env.E_MAIL,
		to: req.body.email,
		subject: "offer for your property",
		text: "hey there! test email for you",
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.end(req);
		} else {
			console.log("Email sent: " + info.response);
			res.end(info.response);
		}
	});
});

app.listen(process.env.PORT);
