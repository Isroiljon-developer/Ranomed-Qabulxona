// PDF Export utility
export const exportToPDF = (data, filename, title) => {
  // Create printable HTML content
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 20px; color: #1a1a1a; }
        h1 { color: #1a6ed8; border-bottom: 2px solid #1a6ed8; padding-bottom: 10px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #1a6ed8; color: white; padding: 12px 8px; text-align: left; font-size: 12px; text-transform: uppercase; }
        td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .header-info { display: flex; justify-content: space-between; margin-bottom: 20px; color: #6b7280; font-size: 12px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .badge-success { background-color: #d1fae5; color: #059669; }
        .badge-warning { background-color: #fef3c7; color: #d97706; }
        .badge-info { background-color: #dbeafe; color: #2563eb; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="header-info">
        <span>Sana: ${new Date().toLocaleDateString('uz-UZ')}</span>
        <span>Jami: ${data.length} ta</span>
      </div>
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0] || {}).map(key => `<th>${formatHeader(key)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(value => `<td>${formatValue(value)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Open print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

// Excel/CSV Export utility
export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    alert("Ma'lumot yo'q");
    return;
  }

  // Get headers
  const headers = Object.keys(data[0]);
  
  // Create CSV content with BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  let csvContent = BOM;
  
  // Add headers
  csvContent += headers.map(h => formatHeader(h)).join(',') + '\n';
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const formatted = formatValue(value);
      if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')) {
        return `"${formatted.replace(/"/g, '""')}"`;
      }
      return formatted;
    });
    csvContent += values.join(',') + '\n';
  });

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${formatDate(new Date())}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper functions
const formatHeader = (key) => {
  const headers = {
    'id': 'ID',
    'name': 'Ismi',
    'patient': 'Bemor',
    'patientName': 'Bemor',
    'phone': 'Telefon',
    'doctor': 'Shifokor',
    'status': 'Status',
    'queueNumber': 'Navbat',
    'branch': 'Filial',
    'source': 'Manba',
    'action': 'Harakat',
    'date': 'Sana',
    'time': 'Vaqt',
    'ward': 'Palata',
    'room': 'Xona',
    'roomNumber': 'Xona raqami',
    'diagnosis': 'Tashxis',
    'daysLeft': 'Qolgan kunlar',
    'admitDate': "Yotqizilgan sana",
    'details': 'Tafsilotlar',
    'createdAt': 'Yaratilgan',
  };
  return headers[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

const formatValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Ha' : 'Yo\'q';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Export patient queue data
export const exportQueueData = (queue, format = 'excel') => {
  const data = queue.map(p => ({
    queueNumber: p.queueNumber || '—',
    name: p.name,
    phone: p.phone,
    doctor: p.doctor,
    source: p.source,
    status: getStatusLabel(p.status),
    branch: p.branch,
  }));

  if (format === 'pdf') {
    exportToPDF(data, 'navbat', 'Navbat ro\'yxati');
  } else {
    exportToExcel(data, 'navbat');
  }
};

// Export history data
export const exportHistoryData = (history, format = 'excel') => {
  const data = history.map(h => ({
    patientName: h.patientName || h.patient,
    action: h.action,
    date: h.date,
    time: h.time || '',
    branch: h.branch || '',
    details: h.details || '',
  }));

  if (format === 'pdf') {
    exportToPDF(data, 'tarix', 'Bemorlar tarixi');
  } else {
    exportToExcel(data, 'tarix');
  }
};

// Export ward patients data
export const exportWardData = (wards, format = 'excel') => {
  const data = [];
  wards.forEach(ward => {
    ward.patients.forEach(patient => {
      data.push({
        roomNumber: ward.roomNumber,
        name: patient.name,
        phone: patient.phone,
        diagnosis: patient.diagnosis,
        admitDate: patient.admitDate,
        daysLeft: patient.daysLeft,
      });
    });
  });

  if (format === 'pdf') {
    exportToPDF(data, 'palatalar', 'Palatadagi bemorlar');
  } else {
    exportToExcel(data, 'palatalar');
  }
};

const getStatusLabel = (status) => {
  const labels = {
    'waiting': 'Kutmoqda',
    'called': 'Chaqirildi',
    'in-progress': 'Qabulda',
    'payment': "To'lov",
  };
  return labels[status] || status;
};
