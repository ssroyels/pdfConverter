const express = require("express");
const multer = require("multer");
const  docxToPDF = require("docx-pdf");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors({
    origin:"https://pdfconverter-1-a1d1.onrender.com",
    methods:["GET","POST","PATCH"],
    credentials:true
}
));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
     
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  app.post("/convertFile",upload.single("file"),function(req,res,next) {

    try{
        if(!req.file) {

            return res.status(400).json({
                message:"No File Uploaded"
            })
        }
        let outputPath = path.join(__dirname,"files",`${req.file.originalname}.pdf`)

        docxToPDF(req.file.path,outputPath,(err,result) => {
            if(err) {
                console.log(err);

                return res.status(400).json({
                    message:"Error converting to pdf"
                })
            }
            res.download(outputPath,() => {
                console.log("file downloaded")
            })
            console.log("result"+result);
        })

    } catch(err) {

        console.log(err);
        res.status(500).json({
            message:"Internal server error"
        })

    }

  })

app.get("/",(req,res) => {
    res.send("Hello Developer")
})

app.listen(port,() => {
    console.log(`example app listening on port ${port} `);
})