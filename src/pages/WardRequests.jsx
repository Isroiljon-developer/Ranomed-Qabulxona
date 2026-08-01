import { useState, useEffect } from 'react';
import Topbar from '../layout/Topbar';
import api from '../api';

export default function WardRequests() {
    const [requests, setRequests] = useState([]);
    const [wards, setWards] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReq, setSelectedReq] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isDirectAdmit, setIsDirectAdmit] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        wardId: '',
        patientId: '',
        passportNumber: '',
        address: '',
        nurseId: '',
        days: 5
    });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [reqs, wardsData, patientsData] = await Promise.all([
                api.get('/reception/ward-requests'),
                api.get('/reception/wards'),
                api.get('/reception/patients')
            ]);
            setRequests(reqs || []);
            setWards((wardsData || []).filter(w => w.status !== 'occupied'));
            setPatients(patientsData || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (req) => {
        setSelectedReq(req);
        setIsDirectAdmit(false);
        setForm({ 
            wardId: '', 
            patientId: req.patientId,
            passportNumber: '', 
            address: req.patient?.manzil || '', 
            nurseId: '',
            days: req.recommendedDays || 5
        });
        setShowModal(true);
    };

    const openDirectModal = () => {
        setSelectedReq(null);
        setIsDirectAdmit(true);
        setForm({ 
            wardId: '', 
            patientId: '',
            passportNumber: '', 
            address: '', 
            nurseId: '',
            days: 5
        });
        setShowModal(true);
    };

    const handleAssign = async () => {
        if (!form.wardId || !form.patientId) {
            showToast('Iltimos, palata va bemorni tanlang', 'error');
            return;
        }
        setAssigning(true);
        try {
            if (isDirectAdmit) {
                // To'g'ridan to'g'ri yotqizish
                const userString = localStorage.getItem('user');
                const user = userString ? JSON.parse(userString) : {};
                await api.post('/reception/admit', {
                    patientId: parseInt(form.patientId),
                    wardId: parseInt(form.wardId),
                    expectedDays: parseInt(form.days),
                    filialId: user.filialId || 1
                });
                showToast('✅ Bemor palataga yotqizildi!');
            } else {
                await api.put(`/reception/ward-request/${selectedReq.id}/assign`, {
                    wardId: parseInt(form.wardId),
                    passportNumber: form.passportNumber,
                    address: form.address,
                    nurseId: form.nurseId || null
                });
                showToast('✅ Palata biriktirildi! Kassirga yuborildi.');
            }
            setShowModal(false);
            fetchAll();
        } catch (err) {
            showToast('Xatolik: ' + err.message, 'error');
        } finally {
            setAssigning(false);
        }
    };

    const s = {
        page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" },
        container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
        header: {
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            borderRadius: '20px',
            padding: '28px 32px',
            color: 'white',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        card: {
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px 24px',
            marginBottom: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #e2e8f0'
        }
    };

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', padding: '14px 22px', borderRadius: '14px',
                    fontWeight: '600', fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}>
                    {toast.msg}
                </div>
            )}

            <Topbar title="Palataga Yotqizish" />
            <div style={s.container}>
                {/* Header */}
                <div style={s.header}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>
                            🛏️ Palataga Yotqizish
                        </h2>
                        <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: '14px' }}>
                            Bemorni palataga joylashtirishni rasmiylashtiring
                        </p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button
                            onClick={openDirectModal}
                            style={{
                                background: 'white', color: '#4f46e5', border: 'none',
                                borderRadius: '12px', padding: '10px 16px', fontWeight: '700',
                                cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            + Yangi Yotqizish
                        </button>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '900', lineHeight: 1 }}>{requests.length}</div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>kutayotgan</div>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '22px' }}>ℹ️</span>
                    <div>
                        <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#1e40af', fontSize: '14px' }}>
                            Jarayon: Qabulxona → Kassir
                        </p>
                        <p style={{ margin: 0, color: '#3b82f6', fontSize: '13px' }}>
                            Bemor hujjatlarini kiritib, bo'sh palatani tanlang. 
                            Tasdiqlangandan so'ng, kassirga ko'rsatilgan kunlik to'lov uchun avtomatik yuboriladi.
                        </p>
                    </div>
                </div>

                {/* Requests list */}
                {loading ? (
                    <div style={s.emptyState}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Yuklanmoqda...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div style={s.emptyState}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h3 style={{ color: '#64748b', margin: '0 0 8px' }}>Shifokordan kutilayotgan talablar yo'q</h3>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
                            Yuqoridagi "+ Yangi Yotqizish" orqali to'g'ridan to'g'ri yotqizishingiz mumkin
                        </p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} style={s.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                                {/* Patient info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: '800', fontSize: '18px', flexShrink: 0
                                    }}>
                                        {(req.patient?.ism || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>
                                            {req.patient?.ism || `Bemor ID: ${req.patientId}`}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
                                            👨‍⚕️ {req.doctorName} &nbsp;|&nbsp; 📋 {req.diagnosis}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                            ⏰ {new Date(req.createdAt).toLocaleString('uz-UZ')}
                                        </div>
                                    </div>
                                </div>

                                {/* Right */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <div style={{
                                        background: '#fef9c3', border: '1px solid #fde68a',
                                        borderRadius: '10px', padding: '8px 14px', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: '700', textTransform: 'uppercase' }}>Tavsiya</div>
                                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#92400e' }}>
                                            {req.recommendedDays} kun
                                        </div>
                                    </div>
                                    {req.note && (
                                        <div style={{
                                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                                            borderRadius: '10px', padding: '8px 14px',
                                            maxWidth: '180px', fontSize: '13px', color: '#166534'
                                        }}>
                                            💬 {req.note}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => openModal(req)}
                                        style={{
                                            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                            color: 'white', border: 'none', borderRadius: '12px',
                                            padding: '12px 22px', fontWeight: '700', cursor: 'pointer',
                                            fontSize: '14px', whiteSpace: 'nowrap',
                                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
                                        }}
                                    >
                                        🛏️ Palata biriktirish
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Assignment Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: 'white', borderRadius: '24px', padding: '32px',
                            maxWidth: '540px', width: '100%',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>
                                🛏️ Palata Biriktirish {isDirectAdmit && "(To'g'ridan to'g'ri)"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8' }}
                            >✕</button>
                        </div>

                        {/* Patient summary / selection */}
                        {isDirectAdmit ? (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Bemorni tanlang *
                                </label>
                                <select
                                    value={form.patientId}
                                    onChange={e => setForm({ ...form, patientId: e.target.value })}
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        border: '1.5px solid #e2e8f0', borderRadius: '12px',
                                        fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="">-- Bemor tanlash --</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.ism} ({p.telefon})</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div style={{
                                background: '#eff6ff', borderRadius: '14px', padding: '16px', marginBottom: '22px'
                            }}>
                                <div style={{ fontWeight: '700', color: '#1e40af', fontSize: '15px' }}>
                                    {selectedReq?.patient?.ism || 'Bemor'}
                                </div>
                                <div style={{ color: '#3b82f6', fontSize: '13px', marginTop: '4px' }}>
                                    Tashxis: {selectedReq?.diagnosis} | Tavsiya: {selectedReq?.recommendedDays} kun
                                </div>
                            </div>
                        )}

                        {/* Passport & Address (only if requested from doctor, otherwise optional) */}
                        {!isDirectAdmit && (
                            <>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                                        Pasport raqami
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="AA1234567"
                                        value={form.passportNumber}
                                        onChange={e => setForm({ ...form, passportNumber: e.target.value })}
                                        style={{
                                            width: '100%', padding: '12px 16px',
                                            border: '1.5px solid #e2e8f0', borderRadius: '12px',
                                            fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                                        Manzil
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Toshkent, Yunusobod..."
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        style={{
                                            width: '100%', padding: '12px 16px',
                                            border: '1.5px solid #e2e8f0', borderRadius: '12px',
                                            fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        {/* Days input for direct admit */}
                        {isDirectAdmit && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Yotish kunlari soni
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={form.days}
                                    onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 1 })}
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        border: '1.5px solid #e2e8f0', borderRadius: '12px',
                                        fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        )}

                        {/* Ward Selection */}
                        <div style={{ marginBottom: '22px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>
                                Bo'sh Palatalar *
                            </label>
                            {wards.length === 0 ? (
                                <p style={{ color: '#ef4444', fontWeight: '600', textAlign: 'center', padding: '20px' }}>
                                    ⚠️ Bo'sh palatalar mavjud emas!
                                </p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
                                    {wards.map(ward => {
                                        const isSelected = form.wardId == ward.id;
                                        return (
                                            <div
                                                key={ward.id}
                                                onClick={() => setForm({ ...form, wardId: ward.id })}
                                                style={{
                                                    border: isSelected ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    cursor: 'pointer',
                                                    background: isSelected ? '#f5f3ff' : 'white',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                                                    {ward.name || `Palata #${ward.id}`}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                                    {ward.price ? new Intl.NumberFormat('uz-UZ').format(ward.price) + " so'm/kun" : 'Narx ko\'rsatilmagan'}
                                                </div>
                                                {isSelected && <div style={{ color: '#6366f1', fontWeight: '700', marginTop: '6px', fontSize: '12px' }}>✓ Tanlandi</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Price preview */}
                        {form.wardId && (() => {
                            const ward = wards.find(w => w.id == form.wardId);
                            const days = form.days;
                            const price = ward?.price || 0;
                            const total = price * days;
                            return (
                                <div style={{
                                    background: '#0f172a', borderRadius: '14px', padding: '16px',
                                    marginBottom: '20px', color: 'white'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>
                                        <span>Kunlik: {new Intl.NumberFormat('uz-UZ').format(price)} so'm</span>
                                        <span>× {days} kun</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900' }}>
                                        <span>Kassirga yuboriladi:</span>
                                        <span style={{ color: '#4ade80' }}>{new Intl.NumberFormat('uz-UZ').format(total)} so'm</span>
                                    </div>
                                </div>
                            );
                        })()}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: '#f1f5f9', border: 'none',
                                    borderRadius: '12px', fontWeight: '600',
                                    cursor: 'pointer', fontSize: '14px', color: '#475569'
                                }}
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={assigning || !form.wardId || !form.patientId}
                                style={{
                                    flex: 2, padding: '14px',
                                    background: assigning || !form.wardId || !form.patientId
                                        ? '#e2e8f0'
                                        : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                    color: assigning || !form.wardId || !form.patientId ? '#94a3b8' : 'white',
                                    border: 'none', borderRadius: '12px',
                                    fontWeight: '700', cursor: 'pointer', fontSize: '15px'
                                }}
                            >
                                {assigning ? '⏳ Yuborilmoqda...' : '✅ Tasdiqlash va Kassirga Yuborish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
