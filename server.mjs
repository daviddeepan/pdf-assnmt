import express from "express";
import { PDFDocument } from "pdf-lib";
import PDFMerger from "pdf-merger-js";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));
//mongodb connection----------------------------------------------
const mongoUrl =
	"mongodb+srv://davidfest1:david123@cluster0.z4fwstd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
	.connect(mongoUrl)
	.then(() => {
		console.log("Connected to database");
	})
	.catch((e) => console.log(e));
//multer------------------------------------------------------------

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./files");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now();
		cb(null, uniqueSuffix + file.originalname);
	},
});

import "./models/pdfDetails.js";
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
	console.log(req.file);
	const title = req.body.title;
	const fileName = req.file.filename;
	try {
		await PdfSchema.create({ title: title, pdf: fileName });
		res.send({ status: "ok" });
	} catch (error) {
		res.json({ status: error });
	}
});

app.get("/get-files", async (req, res) => {
	try {
		PdfSchema.find({}).then((data) => {
			res.send({ status: "ok", data: data });
		});
	} catch (error) {}
});

//apis----------------------------------------------------------------
app.get("/", async (req, res) => {
	res.send("Success!!!!!!");
});


app.post("/merge", upload.none(), async (req, res) => {
	try {
		const pdfUrl = req.body.pdf;
		console.log(pdfUrl);
		const pagesToMerge = JSON.parse(req.body.selectedPages);
		console.log("Page to merge :", pagesToMerge);

		const response = await fetch(pdfUrl);
		const pdfBuffer = await response.arrayBuffer();
		console.log("pdfBuffer :", pdfBuffer);

		const merger = new PDFMerger();
		await merger.add(pdfBuffer, pagesToMerge);
		const mergedPdfBuffer = await merger.saveAsBuffer();
		res.contentType("application/pdf");
		res.send(mergedPdfBuffer);
		console.log("mergedPdfBuffer :", mergedPdfBuffer);
		const mergedPdf = await PDFDocument.load(mergedPdfBuffer);

		console.log("Merge Page count :", mergedPdf.getPageCount());
	} catch (error) {
		console.error("Error merging PDFs:", error);
		res.status(500).send("Error merging PDFs");
	}
});

app.listen(5000, () => {
	console.log("Server Started");
});
