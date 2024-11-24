import React from 'react';
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // To access passed data

export const DisplayData = () => {
    const [excelData, setExcelData] = useState(null); // Initialize as null

    useEffect(() => {
        const fetchExcelData = () => {
            // Example data; replace with your actual data fetching logic
            return [
                { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
            ];
        };

        // Simulate fetching data
        const fetchedData = fetchExcelData();  // Assume fetchExcelData is a function that fetches the data
        setExcelData(fetchedData);
    }, []);

    // Check if excelData is null or undefined
    if (!excelData) {
        return <div>Loading data...</div>;
    }

    return (
        <div>
            {excelData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {excelData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};
