import React from 'react';
import { Printer, X, Ticket, Phone, Globe, AlarmClock, Bed } from 'lucide-react';

export default function Receipt({ data, onClose }) {
    const handlePrint = () => {
        const printContent = document.getElementById('printable-receipt').innerHTML;
        const printStyles = `
      <style>
        @media print {
          body { margin: 0; padding: 0; background: white; }
          #printable-receipt { width: 80mm; margin: 0 auto; padding: 10mm; font-family: sans-serif; }
          .no-print { display: none !important; }
          .text-emerald { color: #10b981 !important; }
          .bg-emerald { background-color: #10b981 !important; color: white !important; }
          .bg-slate { background-color: #f8fafc !important; }
        }
      </style>
    `;
        const win = window.open('', '', 'width=800,height=900');
        win.document.write('<html><head><title>Check</title>' + printStyles + '</head><body>');
        win.document.write(printContent);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
        win.close();
    };

    if (!data) return null;

    // Custom styles for premium look without Tailwind
    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
        },
        modal: {
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '380px',
            borderRadius: '40px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        },
        header: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px',
            borderBottom: '1px solid #f1f5f9'
        },
        closeBtn: {
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: '50%',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer'
        },
        receiptBody: {
            padding: '40px',
            textAlign: 'center'
        },
        iconCircle: {
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
        },
        queueNumber: {
            fontSize: '72px',
            fontWeight: '900',
            color: '#059669',
            letterSpacing: '-4px',
            margin: '0 0 8px',
            lineHeight: '1'
        },
        amount: {
            fontSize: '36px',
            fontWeight: '900',
            color: '#059669',
            letterSpacing: '-1px',
            margin: '0 0 8px'
        },
        patient: {
            fontSize: '18px',
            fontWeight: '900',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '32px'
        },
        pill: {
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '30px',
            padding: '12px 32px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            fontWeight: '900',
            color: '#94a3b8',
            letterSpacing: '1px',
            marginBottom: '40px'
        },
        dot: {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#cbd5e1'
        },
        infoCard: {
            backgroundColor: '#f8fafc',
            borderRadius: '32px',
            border: '1px solid #f1f5f9',
            padding: '32px',
            textAlign: 'left',
            marginBottom: '40px'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
        },
        infoLabel: {
            fontSize: '10px',
            fontWeight: '900',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '2px'
        },
        infoValue: {
            fontSize: '11px',
            fontWeight: '900',
            color: '#0f172a',
            textTransform: 'uppercase'
        },
        separator: {
            height: '2px',
            borderTop: '2px dashed #f1f5f9',
            margin: '40px 0'
        },
        footer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        qrBox: {
            padding: '16px',
            backgroundColor: 'white',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
            borderRadius: '32px',
            border: '1px solid #f8fafc',
            marginBottom: '24px'
        },
        systemText: {
            fontSize: '9px',
            fontWeight: '900',
            color: '#cbd5e1',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '40px'
        },
        phoneGrid: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '32px'
        },
        printBtn: {
            width: '100%',
            padding: '20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginTop: '24px',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
        }
    };

    return (
        <div style={styles.overlay} className="no-print">
            <div style={styles.modal}>
                {/* Actions Header */}
                <div style={styles.header}>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={16} />
                    </button>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    <div id="printable-receipt" style={styles.receiptBody}>

                        {/* Top Icon Circle */}
                        <div style={styles.iconCircle}>
                            {data.queueNumber ? <Ticket size={40} color="white" /> : <Bed size={40} color="white" />}
                        </div>

                        {/* Main Highlight */}
                        {data.queueNumber ? (
                            <h1 style={styles.queueNumber}>#{data.queueNumber}</h1>
                        ) : (
                            <h1 style={styles.amount}>
                                {new Intl.NumberFormat('uz-UZ').format(data.totalAmount || 0)} <small style={{ fontSize: '16px' }}>so'm</small>
                            </h1>
                        )}

                        <div style={styles.patient}>{data.patientName}</div>

                        {/* Date Time Pill */}
                        <div style={styles.pill}>
                            <span>{new Date().toLocaleDateString('uz-UZ')}</span>
                            <div style={styles.dot}></div>
                            <span>{new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Details Box */}
                        <div style={styles.infoCard}>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Klinika</span>
                                <span style={styles.infoValue}>RANOMED MEDICAL</span>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Shifokor</span>
                                <span style={styles.infoValue}>{data.doctorName || 'isroiljon'}</span>
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#f1f5f9', width: '100%', margin: '0 0 24px' }}></div>

                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Holat</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                                    <AlarmClock size={14} />
                                    <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Navbatda</span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.separator}></div>

                        {/* Bottom Section */}
                        <div style={styles.footer}>
                            <div style={styles.qrBox}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PATIENT_${data.patientId}`}
                                    alt="QR"
                                    style={{ width: '100px', height: '100px', opacity: 0.8 }}
                                />
                            </div>

                            <p style={styles.systemText}>RANOMED CLINIC SYSTEM • 2026</p>

                            <div style={styles.phoneGrid}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', fontWeight: '900', color: '#94a3b8' }}>
                                    <Phone size={12} style={{ color: '#3b82f6', opacity: 0.5 }} />
                                    <span>+998 71 123 45 67</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', fontWeight: '900', color: '#94a3b8' }}>
                                    <Globe size={12} style={{ color: '#3b82f6', opacity: 0.5 }} />
                                    <span>ranomed.uz</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handlePrint} style={styles.printBtn} className="no-print">
                            <Printer size={18} />
                            Chop etish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
