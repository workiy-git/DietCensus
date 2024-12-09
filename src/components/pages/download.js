import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import { FaDownload, FaPrint } from "react-icons/fa"; // Using react-icons for icons

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDate, setFilterDate] = useState(""); // For filtering by date
  const [searchTerm, setSearchTerm] = useState(""); // For searching by name

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://34.227.87.142/api/patient/fetchPatientData/grouped");
        setData(response.data.data);
        setFilteredData(response.data.data); // Initially set filteredData to all records
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDateFilter = (date) => {
    setFilterDate(date);
    if (date) {
      // Filter the records by the selected date
      const filtered = data.filter(item => item.date === date);
      setFilteredData(filtered);
    } else {
      // If no date is selected, show all records
      setFilteredData(data);
    }
  };

  // Handle search by name
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = data.filter(dateGroup =>
        dateGroup.records.some(record =>
          record.userName.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset to all data if search is cleared
    }
  };

  // Handle Excel download
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.flatMap(dateGroup => 
      dateGroup.records.map(record => ({
        WardNo: record.wardNo,
        CH_STD: record.dropdownSelections.find(item => item.type === 'chstd')?.inputValue,
        STD: record.dropdownSelections.find(item => item.type === 'std')?.inputValue,
        NCD: record.dropdownSelections.find(item => item.type === 'ndc')?.inputValue,
        HPD: record.dropdownSelections.find(item => item.type === 'hpd')?.inputValue,
        Renal: record.dropdownSelections.find(item => item.type === 'renal')?.inputValue,
        SF_HP: record.dropdownSelections.find(item => item.type === 'sfhpd')?.inputValue,
        MB: record.dropdownSelections.find(item => item.type === 'mb')?.inputValue,
        RCD: record.dropdownSelections.find(item => item.type === 'rcd')?.inputValue,
        Ac_SPL: record.dropdownSelections.find(item => item.type === 'acspl')?.inputValue,
        Oral_Ac_SPL: record.dropdownSelections.find(item => item.type === 'oralacspl')?.inputValue,
        SELF: record.dropdownSelections.find(item => item.type === 'self')?.inputValue,
        Lodger: record.dropdownSelections.find(item => item.type === 'lodger')?.inputValue,
        PhoneNumber: record.phoneNumber,
        UserName: record.userName,
        Total: record.total,
      }))
    ));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Diet Census");
    XLSX.writeFile(wb, "diet_census.xlsx");
  };

const handlePrint = () => {
  // Create a hidden div for Excel content only
  const printContent = document.createElement("div");
  
  // Remove any unwanted content or blank spaces
  printContent.innerHTML = `
    <h2 style="text-align: center;">Diet Census</h2>
    ${filteredData.map(dateGroup => `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th colSpan="11" style="padding: 8px; border: 1px solid #ddd;">Census Distribution</th>
            <th colSpan="5" style="padding: 8px; border: 1px solid #ddd;">${dateGroup.date}</th>
          </tr>
          <tr style="background-color: #f2f2f2; text-align: left;">
            <th style="padding: 8px; border: 1px solid #ddd;">Ward No</th>
            <th style="padding: 8px; border: 1px solid #ddd;">CH STD</th>
            <th style="padding: 8px; border: 1px solid #ddd;">STD</th>
            <th style="padding: 8px; border: 1px solid #ddd;">NCD</th>
            <th style="padding: 8px; border: 1px solid #ddd;">HPD</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Renal</th>
            <th style="padding: 8px; border: 1px solid #ddd;">SF HPD</th>
            <th style="padding: 8px; border: 1px solid #ddd;">M&B</th>
            <th style="padding: 8px; border: 1px solid #ddd;">RCD</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Ac. SPL</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Oral Ac SPL</th>
            <th style="padding: 8px; border: 1px solid #ddd;">SELF</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Lodger</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Phone Number</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
          </tr>
        </thead>
        <tbody>
          ${dateGroup.records.map(record => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px; border: 1px solid #ddd;">${record.wardNo}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'chstd')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'std')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'ndc')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'hpd')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'renal')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'sfhpd')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'mb')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'rcd')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'acspl')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'oralacspl')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'self')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.total}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.dropdownSelections.find(item => item.type === 'lodger')?.inputValue}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.phoneNumber}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.userName}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `).join('')}

    <style>
      table {
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      }

      th {
        background-color: #f2f2f2;
        font-weight: bold;
        text-align: center;
      }

      td {
        text-align: center;
      }

      tr:hover {
        background-color: #f5f5f5;
      }

      h3 {
        margin-top: 30px;
        font-size: 20px;
        text-align: center;
        color: #333;
      }
    </style>
  `;

  // Open the print window, write the content, and close it
  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent.innerHTML);
  printWindow.document.close();
  
  // Trigger the print dialog
  printWindow.print();
};


  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
        <img src="download-icon.png" alt="Download" style={styles.icon} />
        </div> 
           
        <div style={styles.actions}>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            style={styles.input}
          />
          <input
            type="date"
            onChange={(e) => handleDateFilter(e.target.value)}
            style={styles.input}
          />
          <button onClick={downloadExcel} style={styles.button}>
            <img src="download-icon.png" alt="Download" style={styles.icon} />
            Download Excel Sheet
          </button>
          <button onClick={handlePrint} style={styles.button}>
            <img src="download-icon.png" alt="Download" style={styles.icon} />
            Print
          </button>
        </div>
      </header>
      {filteredData.map((dateGroup, index) => (
        <div key={index} style={styles.dateSection}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th colSpan={11} style={styles.th}>Census Distribution</th>
                <th colSpan={5} style={styles.th}>{dateGroup.date}</th>
              </tr>
              <tr>
                <th style={styles.th}>Ward No</th>
                <th style={styles.th}>CH STD</th>
                <th style={styles.th}>STD</th>
                <th style={styles.th}>NCD</th>
                <th style={styles.th}>HPD</th>
                <th style={styles.th}>Renal</th>
                <th style={styles.th}>SF HPD</th>
                <th style={styles.th}>M&B</th>
                <th style={styles.th}>RCD</th>
                <th style={styles.th}>Ac. SPL</th>
                <th style={styles.th}>Oral Ac SPL</th>
                <th style={styles.th}>SELF</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Lodger</th>
                <th style={styles.th}>Phone Number</th>
                <th style={styles.th}>Name</th>
              </tr>
            </thead>
            <tbody>
              {dateGroup.records.map((record) => {
                return (
                  <tr key={record._id}>
                    <td style={styles.td}>{record.wardNo}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'chstd')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'std')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'ndc')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'hpd')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'renal')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'sfhpd')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'mb')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'rcd')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'acspl')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'oralacspl')?.inputValue}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'self')?.inputValue}</td>
                    <td style={styles.td}>{record.total}</td>
                    <td style={styles.td}>{record.dropdownSelections.find(item => item.type === 'lodger')?.inputValue}</td>
                    <td style={styles.td}>{record.phoneNumber}</td>
                    <td style={styles.td}>{record.userName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  icon: {
    marginRight: "8px",
  },
  dateSection: {
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "center",
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f4f4f4",
  },
  td: {
    textAlign: "center",
    border: "1px solid #ccc",
    padding: "8px",
  },
};

export default App;
