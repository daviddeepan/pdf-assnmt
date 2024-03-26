import { useState } from "react";
import { Document, Page } from "react-pdf";
import axios from "axios";
import PDFMerger from "pdf-merger-js";



function PdfComp(props) {
	const [numPages, setNumPages] = useState();
	const [pageNumber, setPageNumber] = useState(1);
	const [mergedPDF, setMergedPDF] = useState(null);
	const [selectedPages, setSelectedPages] = useState([]);

	const merger = new PDFMerger();

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}
	const togglePageSelection = (pageIndex) => {
		setSelectedPages((prevState) => {
			const updatedPages = [...prevState];
			if (updatedPages[pageIndex]) {
				updatedPages[pageIndex] = false;
			} else {
				updatedPages[pageIndex] = true;
			}
			console.log(updatedPages.filter(Boolean).length);

			return updatedPages;
		});
	};

	const mergePDFs = async () => {
		try {
			console.log(selectedPages.filter(Boolean).length);
			const selectedPagesIndexes = selectedPages.reduce(
				(acc, isSelected, index) => {
					if (isSelected) acc.push(index); 
					return acc;
				},
				[]
			);
			console.log("selectedPagesIndexes:", selectedPagesIndexes);
			console.log(props.pdfFile);

			const formData = new FormData();

			formData.append("pdf", props.pdfFile);
			formData.append(
				"selectedPages",
				JSON.stringify(selectedPagesIndexes)
			);
			console.log(props.pdfFile, selectedPagesIndexes);
			const data = await axios.post(
				"http://localhost:5000/merge",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					responseType: "arraybuffer",
				}
			);

			console.log(data.data);
			const blob = new Blob([data.data], {
				type: "application/pdf",
			});
			setMergedPDF(URL.createObjectURL(blob));
			console.log(URL.createObjectURL(blob));
		} catch (error) {
			console.log(error);
		}
	};
	console.log("Merged Pdf Url:", mergedPDF);
	return (
		<div className="pdf-div">
			<p>
				Page {pageNumber} of {numPages}
			</p>
			<Document
				file={props.pdfFile}
				onLoadSuccess={onDocumentLoadSuccess}
			>
				{Array.from({ length: numPages }, (_, index) => index + 1).map(
					(page) => (
						<Page
							key={page}
							pageNumber={page}
							renderTextLayer={false}
							renderAnnotationLayer={false}
							onClick={() => togglePageSelection(page)}
							onDoubleClick={() => togglePageSelection(page)}
							className={
								selectedPages[page] ? "selected" : ""
							}
						/>
					)
				)}
			</Document>
			<button onClick={mergePDFs}>Merge Selected Pages</button>
			{mergedPDF ? (
				<div style={{ marginTop: "20px", textAlign: "center" }}>
					<a href={mergedPDF} download="merged.pdf">
						Download Merged PDF
					</a>
					<object
						data={mergedPDF}
						type="application/pdf"
						width="800"
						height="600"
					></object>
				</div>
			) : (
				<p style={{ textAlign: "center", color: "red" }}>
					Error: Failed to load PDF
				</p>
			)}
		</div>
	);
}
export default PdfComp;
