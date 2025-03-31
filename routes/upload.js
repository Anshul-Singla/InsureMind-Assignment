const express = require("express");
const multer = require("multer");
const { Worker } = require("worker_threads");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp folder for file uploads

router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log('req.file.path:', req.file.path)
    const filePath = req.file.path; // Get uploaded file path
    const fileType = req.file.mimetype.includes("csv") ? "csv" : "xlsx";
    console.log("🚀 Starting worker for:", filePath , fileType);

    const worker = new Worker(path.join(__dirname, "../workers/uploadWorker.js"), {
        workerData: { filePath , fileType } 
    });

  
    worker.on("message", (message) => {
        console.log(" Worker finished:", message);
        res.json({ success: true, message });
    });

   
    worker.on("error", (error) => {
        console.error("Worker Error:", error);
        res.status(500).json({ success: false, error: error.message });
    });

    // 🚀 Worker Exits (Cleans Up Resources)
    worker.on("exit", (code) => {
        console.log(`Worker exited with code ${code}`);
    });
});

module.exports = router;
