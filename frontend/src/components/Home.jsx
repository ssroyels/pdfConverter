import React, { useState } from 'react'
import {FaFileWord} from "react-icons/fa6"
import axios from "axios";
const Home = () => {

    const [selectFile,setSelectFile] = useState();
    const [convert,setConvert] = useState("");
    const [downloadError,setDownLoadError] = useState("");

    const handleFileChange = (e) => {
        e.preventDefault();
        setSelectFile(e.target.files[0]);

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!selectFile) {
            setConvert("Please select a file");
            return;
        }

        const formData = new FormData()
        formData.append("file",selectFile);

        try{
                const response = await fetch("https://pdfconverter-s0nr.onrender.com/convertFile", {
      method: "POST",
      body: formData,
    },{
                responseType:"blob",
             withCredentials: true});
           // const response = await axios.post(`https://pdfconverter-s0nr.onrender.com/convertFile`,formData,{
           //      responseType:"blob",
           //  },{ withCredentials: true});

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download",selectFile.name.replace(/\.[^/.]+$/,"")+".pdf")
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setSelectFile(null)
            setDownLoadError("");
            setConvert("File Converted Successfully");

        } catch(err) {

            if(err.response && err.response.status==400){
                setDownLoadError("Error occurred: ",err.response.data.message);

            } else{

                setConvert("")
            }

           
           

        }
 
    }

  return (
    <>
     <div className='max-w-screen-2xl mx-auto container px-6 py-3 md:px-40'>
        <div className='flex h-screen items-center justify-center'>
            <div className='border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold text-center mb-4'>Convert Word to PDF Online</h1>
                <p className='text-sm text-center mb-5'>
                    Easily convert Word documents to PDF format online,without having to install any software.
                </p>
            
            <div className='flex flex-col items-center space-y-4'>
                <input type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"  onChange={handleFileChange} className='hidden' id='FileInput' />
                <label htmlFor="FileInput" className='w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer hover:text-white border-blue-300 hover:bg-blue-700 duration:300 '>
                    <FaFileWord className='text-3xl mr-3'/>
                    <span className='text-3xl mr-2 '> {selectFile?selectFile.name:"Choose File"} </span>
                </label>
                <button onClick={handleSubmit} disabled = {!selectFile} className='text-white disabled:bg-gray-400 disabled:pointer-events-none bg-blue-500 hover:bg-blue-700 duration-300 font-bold px-4 py-2 rounded-lg'>Convert File</button>
          {convert && ( <div className='text-green-500 text-center'> {convert} </div> )}
          {downloadError && ( <div className='text-red-500 text-center'> {downloadError} </div> )}
            </div>
            </div>
        </div>
    </div>
    </>
   
  )
}

export default Home
