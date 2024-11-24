import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const UploadGrades = () => {
    const [file, setFile] = useState(null);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileParse = () => {
        if (!file) {
            alert('Please upload a file first.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Assuming the data is in the first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            const grades = [];

            // Start reading from row 3 (index 2), where data begins
            for (let i = 1; i < worksheet.length; i++) {
                const row = worksheet[i];

                // Extract the required data from each row
                const student_number = row[1];  // Student Number (Column B)
                const term = row[2];            // Term (Column C)
                const year = row[3];            // Year (Column D)
                const grade = row[4];           // Grade (Column E)
                const event = row[5];           // Event (Column F)
                const marks = row[6];           // Marks (Column G)
                const subject_code = row[7];    // Subject Code (Column H)

                // Push the data to the grades array
                grades.push({
                    student_number,
                    term,
                    year,
                    marks,
                    grade, 
                    event,
                    subject_code
                });
            }

            // Log the grades to the console before sending
            console.log('Grades to be sent:', grades);

            // Send the grades to the backend
            axios.post('http://localhost:5000/school/add-grades',  {grades} )
                .then(response => {
                    alert('Grades uploaded successfully!');
                })
                .catch(error => {
                    console.error('There was an error uploading the grades!', error);
                });
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <h2>Upload Grades Excel</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <button onClick={handleFileParse}>Upload and Submit</button>
        </div>
    );
};

export default UploadGrades;
