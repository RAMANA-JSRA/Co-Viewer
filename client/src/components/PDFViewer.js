import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./PDFViewer.css";

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL);

const PDFViewer = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Define onDocumentLoadSuccess inside the component
  const onDocumentLoadSuccess = () => {
    console.log("PDF loaded successfully");
    setPdfLoaded(true); // Set to true when PDF is loaded
  };

  // Define onDocumentLoadError inside the component
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
    setError("Error loading PDF. Please try again.");
    setPdfLoaded(false);
  };

  useEffect(() => {
    socket.on("current-page", ({ page, isAdmin }) => {
      setPageNumber(page);
      setIsAdmin(isAdmin);
    });

    socket.on("page-changed", (page) => setPageNumber(page));

    socket.on("admin-assigned", () => setIsAdmin(true));

    return () => {
      socket.off("current-page");
      socket.off("page-changed");
      socket.off("admin-assigned");
    };
  }, []);

  const changePage = (offset) => {
    const newPage = pageNumber + offset;
    setPageNumber(newPage);
    if (isAdmin) socket.emit("change-page", newPage);
  };

  return (
    <div className="pdf-viewer-container">
      {!pdfLoaded && <div className="loading">Loading PDF...</div>}{" "}
      
      <Worker workerUrl="/pdf.worker.min.js">
        <Viewer
          fileUrl="/sample.pdf"
          defaultScale={1.5}
          onDocumentLoad={onDocumentLoadSuccess}
          onDocumentLoadFailed={onDocumentLoadError} 
        />
      </Worker>
      {error && <div className="error-message">{error}</div>}
      <div className="page-controls">
        <p>Page {pageNumber}</p>
        {isAdmin && (
          <>
            <button onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
              Previous
            </button>
            <button onClick={() => changePage(1)}>Next</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
