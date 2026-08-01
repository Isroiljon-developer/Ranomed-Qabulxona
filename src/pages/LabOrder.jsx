import { useState, useEffect } from 'react';
import { Search, CheckCircle2, X, Plus, ChevronDown, FlaskConical } from 'lucide-react';
import Topbar from '../layout/Topbar';
import api from '../api';

// ============================================================
//  TO'LIQ XIZMATLAR RO'YXATI (100+ ta) — kategoriyalarga bo'lingan
// ============================================================
const ALL_SERVICES = {
  "Klinik Tahlillar": [
    { id: 'lab_1', name: "Qon umumiy tahlili (24-ko‘rsat)", price: 35000 },
    { id: 'lab_2', name: "Qon ivish vaqtini aniqlash", price: 15000 },
    { id: 'lab_3', name: "Siydik umumiy tahlili", price: 45000 },
    { id: 'lab_4', name: "Nechiporenko tekshiruvi", price: 35000 },
    { id: 'lab_5', name: "Mazok uretra", price: 50000 },
    { id: 'lab_6', name: "Axlat umumiy tahlili", price: 40000 },
    { id: 'lab_7', name: "3x stakannaya proba mochi", price: 100000 },
    { id: 'lab_8', name: "MERS-STAMIA tahlili", price: 110000 },
    { id: 'lab_9', name: "Siydikdagi qand miqdorini aniqlash", price: 35000 },
    { id: 'lab_10', name: "Spermogramma", price: 100000 },
    { id: 'lab_11', name: "Koagulogramma", price: 45000 },
  ],
  "Biokimik Tahlillar": [
    { id: 'lab_12', name: "Alaninaminotransferaza (ALT)", price: 35000 },
    { id: 'lab_13', name: "Aspartataminotransferaza (AST)", price: 35000 },
    { id: 'lab_14', name: "Bilirubin fraksiyasini aniqlash", price: 40000 },
    { id: 'lab_15', name: "Qondagi qand miqdorini aniqlash", price: 25000 },
    { id: 'lab_16', name: "Qondagi mochevina miqdorini", price: 40000 },
    { id: 'lab_17', name: "Qondagi kreatinin", price: 40000 },
    { id: 'lab_18', name: "Qondagi kalsiyni aniqlash", price: 35000 },
    { id: 'lab_19', name: "Qondagi umumiy oqsil", price: 35000 },
    { id: 'lab_20', name: "Qondagi temir miqdori", price: 40000 },
    { id: 'lab_21', name: "Qondagi GGT miqdorini aniqlash", price: 45000 },
    { id: 'lab_22', name: "Qondagi ShF miqdorini aniqlash", price: 45000 },
    { id: 'lab_23', name: "Qondagi Na miqdorini aniqlash", price: 40000 },
    { id: 'lab_24', name: "Qondagi K miqdorini aniqlash", price: 40000 },
    { id: 'lab_25', name: "Qondagi albumin miqdori", price: 35000 },
    { id: 'lab_26', name: "a-Amilaza (Diastaza)", price: 40000 },
    { id: 'lab_27', name: "Mochevaya kislotani aniqlash", price: 40000 },
    { id: 'lab_28', name: "Qondagi umumiy xolesterin", price: 40000 },
    { id: 'lab_29', name: "Xolestrol-LPNP aniqlash", price: 40000 },
    { id: 'lab_30', name: "Xolestrol-LPVP aniqlash", price: 40000 },
    { id: 'lab_31', name: "Triglitsiridni aniqlash", price: 40000 },
  ],
  "Revmaproba": [
    { id: 'lab_32', name: "C-reaktiv belok", price: 45000 },
    { id: 'lab_33', name: "Revmatoid faktorini aniqlash", price: 45000 },
    { id: 'lab_34', name: "Antistreptolizin-O (ASO)", price: 50000 },
    { id: 'lab_35', name: "ATSZP IFA (usulida)", price: 240000 },
  ],
  "Ekspress test": [
    { id: 'lab_36', name: "RW (Syphiliss)", price: 40000 },
    { id: 'lab_37', name: "VICH HIV", price: 40000 },
    { id: 'lab_38', name: "Covid-19 IgG", price: 90000 },
    { id: 'lab_39', name: "Covid-19 IgM", price: 90000 },
  ],
  "Gepatit Markerlari": [
    { id: 'lab_40', name: "IFA gepatit B HBsAg", price: 45000 },
    { id: 'lab_41', name: "IFA gepatit C anti-HCV", price: 45000 },
    { id: 'lab_42', name: "IFA gepatit D HDV - Ab", price: 80000 },
    { id: 'lab_43', name: "H.Pylori tahlili Ig G", price: 80000 },
    { id: 'lab_44', name: "H.Pylori tahlili Ig M", price: 80000 },
    { id: 'lab_45', name: "Qon guruhini aniqlash", price: 45000 },
    { id: 'lab_46', name: "TITR Tahlili", price: 40000 },
    { id: 'lab_47', name: "Bryutsellyoz", price: 50000 },
  ],
  "Vitaminlar IXLA": [
    { id: 'lab_48', name: "Vitamin D", price: 250000 },
    { id: 'lab_49', name: "Vitamin B12", price: 150000 },
  ],
  "Allergiya": [
    { id: 'lab_50', name: "Immunoglobulin E", price: 90000 },
  ],
  "Garmonlar": [
    { id: 'lab_51', name: "Follikulostimuliruyushchiy (FSG)", price: 80000 },
    { id: 'lab_52', name: "Lyuteiniziruyushchiy gormon (LG)", price: 80000 },
    { id: 'lab_53', name: "Testosteron obshchiy", price: 95000 },
    { id: 'lab_54', name: "Testosteron svobodniy", price: 95000 },
    { id: 'lab_55', name: "Prolaktin", price: 80000 },
    { id: 'lab_56', name: "Tireotropniy gormon (TTG)", price: 80000 },
    { id: 'lab_57', name: "Triyodtironin (T-3) svobodniy", price: 70000 },
    { id: 'lab_58', name: "Tiroksin (T-4) svobodniy", price: 70000 },
    { id: 'lab_59', name: "Triyodtironin (T-3) obshchiy", price: 70000 },
    { id: 'lab_60', name: "Tiroksin (T-4) obshchiy", price: 100000 },
    { id: 'lab_61', name: "Progesteron", price: 80000 },
    { id: 'lab_62', name: "Esteradiol", price: 75000 },
    { id: 'lab_63', name: "C-peptid", price: 120000 },
    { id: 'lab_64', name: "Insulin", price: 120000 },
    { id: 'lab_65', name: "Tireoglobulin TG", price: 106000 },
    { id: 'lab_66', name: "Anti-Tireoglobulin TG", price: 134000 },
    { id: 'lab_67', name: "Antitella Anti (TPO)", price: 120000 },
    { id: 'lab_68', name: "Kortizol", price: 75000 },
    { id: 'lab_69', name: "Xronicheskiy gonodotropin HCG", price: 75000 },
  ],
  "Torch Infeksiyasi": [
    { id: 'lab_70', name: "Xlamediya IgG", price: 75000 },
    { id: 'lab_71', name: "Gerpes VPG IgG", price: 85000 },
    { id: 'lab_72', name: "Gerpes VPG IgG", price: 85000 },
    { id: 'lab_73', name: "Toksoplazma IgG", price: 100000 },
    { id: 'lab_74', name: "Uroplazma IgG", price: 75000 },
    { id: 'lab_75', name: "Mikoplazma IgG", price: 75000 },
    { id: 'lab_76', name: "Tsitomegalavirus TSMV IgG", price: 85000 },
    { id: 'lab_77', name: "Rubella (Krasnuxa) IgG", price: 80000 },
    { id: 'lab_78', name: "Kandida IgG", price: 75000 },
    { id: 'lab_79', name: "Xlamediya IgM", price: 75000 },
    { id: 'lab_80', name: "Gerpes VPG IgM", price: 85000 },
    { id: 'lab_81', name: "Gerpes VPG IgM", price: 85000 },
    { id: 'lab_82', name: "Toksoplazma IgM", price: 80000 },
    { id: 'lab_83', name: "Uroplazma IgM", price: 75000 },
    { id: 'lab_84', name: "Mikoplazma IgM", price: 75000 },
    { id: 'lab_85', name: "Tsitomegalavirus TSMV IgM", price: 85000 },
    { id: 'lab_86', name: "Rubella (Krasnuxa) IgM", price: 85000 },
    { id: 'lab_87', name: "Kandida IgM", price: 75000 },
  ],
  "Onkomarkerlar": [
    { id: 'lab_88', name: "Kartzinoembrionalniy (CEA)", price: 80000 },
    { id: 'lab_89', name: "Alfa-fetoprotein (AFP)", price: 70000 },
    { id: 'lab_90', name: "Rakoviy antigen - CA-125", price: 80000 },
    { id: 'lab_91', name: "PSA obshchiy", price: 150000 },
    { id: 'lab_92', name: "PSA svobodniy", price: 140000 },
    { id: 'lab_93', name: "Rakoviy antigen - 19-9Ar", price: 90000 },
    { id: 'lab_94', name: "Rakoviy antigen - 15-3", price: 90000 },
    { id: 'lab_95', name: "HE-4", price: 250000 },
    { id: 'lab_96', name: "Indeks Roma (HE-4+CA-125)", price: 323000 },
  ],
  "Bak Posev": [
    { id: 'lab_97', name: "Mocha na antibiotikogrammu", price: 110000 },
    { id: 'lab_98', name: "Vozbuditel difterii", price: 110000 },
    { id: 'lab_99', name: "Krov na sterilnost", price: 110000 },
    { id: 'lab_100', name: "Mokrota na antibiotikogrammu", price: 110000 },
  ],
};

const FLAT_SERVICES = Object.values(ALL_SERVICES).flat();

export default function LabOrder() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [activeCategory, setActiveCategory] = useState(Object.keys(ALL_SERVICES)[0]);

  useEffect(() => {
    api.get('/reception/patients')
      .then(data => setPatients(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const filteredPatients = patients.filter(p =>
    (p.ism || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.telefon || '').includes(search)
  ).slice(0, 20);

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const totalPrice = selectedServices.reduce((sum, t) => sum + t.price, 0);
  const formatMoney = (n) => new Intl.NumberFormat('uz-UZ').format(n) + ' so\'m';

  // Filter services in active category by search
  const getFilteredInCategory = (catName) => {
    const services = ALL_SERVICES[catName] || [];
    if (!catSearch) return services;
    return services.filter(s => s.name.toLowerCase().includes(catSearch.toLowerCase()));
  };

  // Global search across all categories
  const globalSearchResults = catSearch
    ? FLAT_SERVICES.filter(s => s.name.toLowerCase().includes(catSearch.toLowerCase()))
    : null;

  const handleSubmit = async () => {
    if (!selectedPatient || selectedServices.length === 0) return;
    setLoading(true);
    try {
      for (const service of selectedServices) {
        await api.post('/lab/orders', {
          patientId: selectedPatient.id,
          filialId: selectedPatient.filialId || 1,
          testType: service.name,
          price: service.price
        });
      }
      setSuccess(true);
      setSelectedPatient(null);
      setSelectedServices([]);
      setSearch('');
    } catch (err) {
      alert('Xatolik: ' + (err.message || 'Noma\'lum xato'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <Topbar title="Xizmatlar & Laboratoriya Buyurtma" />

      <div style={{ padding: '24px 32px' }}>
        {success && (
          <div style={{
            marginBottom: 24, padding: '16px 20px',
            background: '#ecfdf5', border: '1.5px solid #a7f3d0',
            borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14
          }}>
            <CheckCircle2 style={{ width: 28, height: 28, color: '#059669', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: '#065f46', fontSize: 15 }}>Buyurtma muvaffaqiyatli yuborildi!</p>
              <p style={{ fontSize: 13, color: '#047857', marginTop: 2 }}>
                Kassir to'lovni tasdiqlagandan keyin tahlil laborantga ko'rinadi.
              </p>
            </div>
            <button onClick={() => setSuccess(false)} style={{ color: '#6ee7b7', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>
              <X size={20} />
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Patient Selection */}
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={18} style={{ color: '#3b82f6' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>1. Bemorni Tanlang</h3>
              </div>
              <div style={{ padding: '18px 22px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Ism yoki telefon..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setShowPatientList(true); }}
                    onFocus={() => setShowPatientList(true)}
                    style={{
                      width: '100%', paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11,
                      borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc',
                      fontFamily: 'inherit', fontSize: 14, outline: 'none', color: '#0f172a'
                    }}
                  />
                </div>

                {showPatientList && search && (
                  <div style={{
                    marginTop: 8, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden',
                    maxHeight: 240, overflowY: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                  }}>
                    {filteredPatients.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Bemor topilmadi</div>
                    ) : filteredPatients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPatient(p); setSearch(p.ism); setShowPatientList(false); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '11px 16px',
                          background: 'white', border: 'none', borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                          fontFamily: 'inherit', transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 800, fontSize: 14, flexShrink: 0
                        }}>{(p.ism || '?').charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.ism}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{p.telefon}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedPatient && (
                  <div style={{
                    marginTop: 10, padding: '12px 16px',
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    border: '1.5px solid #93c5fd', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 800, fontSize: 15
                      }}>{selectedPatient.ism.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e40af', fontSize: 14 }}>{selectedPatient.ism}</div>
                        <div style={{ fontSize: 12, color: '#3b82f6' }}>#{selectedPatient.id} · {selectedPatient.telefon}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedPatient(null); setSearch(''); }}
                      style={{ color: '#93c5fd', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Services Selection */}
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FlaskConical size={18} style={{ color: '#06b6d4' }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>2. Xizmatlarni Tanlang</h3>
                  {selectedServices.length > 0 && (
                    <span style={{ background: '#6366f1', color: 'white', fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>
                      {selectedServices.length} ta
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative', minWidth: 220 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Xizmat qidirish..."
                    value={catSearch}
                    onChange={e => setCatSearch(e.target.value)}
                    style={{
                      paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                      borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc',
                      fontFamily: 'inherit', fontSize: 13, outline: 'none', width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Global search results */}
              {catSearch && globalSearchResults ? (
                <div style={{ padding: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                    Qidiruv natijalari ({globalSearchResults.length} ta)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
                    {globalSearchResults.map(service => {
                      const isSelected = selectedServices.find(s => s.id === service.id);
                      return (
                        <ServiceBtn key={service.id} service={service} isSelected={isSelected} toggle={toggleService} formatMoney={formatMoney} />
                      );
                    })}
                    {globalSearchResults.length === 0 && (
                      <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Xizmat topilmadi</div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', height: 460 }}>
                  {/* Categories Sidebar */}
                  <div style={{ width: 200, borderRight: '1px solid #f1f5f9', overflowY: 'auto', flexShrink: 0 }}>
                    {Object.keys(ALL_SERVICES).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                          width: '100%', textAlign: 'left', padding: '13px 16px',
                          background: activeCategory === cat ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'white',
                          border: 'none', borderBottom: '1px solid #f8fafc',
                          borderLeft: `3px solid ${activeCategory === cat ? '#3b82f6' : 'transparent'}`,
                          cursor: 'pointer', fontFamily: 'inherit',
                          display: 'flex', flexDirection: 'column', gap: 4,
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: 12.5, fontWeight: activeCategory === cat ? 700 : 500, color: activeCategory === cat ? '#1e40af' : '#0f172a' }}>
                          {cat}
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                          {ALL_SERVICES[cat].length} ta xizmat
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Services List */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 8 }}>
                      {getFilteredInCategory(activeCategory).map(service => {
                        const isSelected = selectedServices.find(s => s.id === service.id);
                        return (
                          <ServiceBtn key={service.id} service={service} isSelected={isSelected} toggle={toggleService} formatMoney={formatMoney} />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div style={{
              background: 'white', borderRadius: 20, border: '1px solid #e2e8f0',
              overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              position: 'sticky', top: 80
            }}>
              <div style={{
                padding: '18px 22px', borderBottom: '1px solid #f1f5f9',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
              }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>3. Buyurtma xulosasi</h3>
                {selectedPatient && (
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
                    Bemor: <strong style={{ color: 'white' }}>{selectedPatient.ism}</strong>
                  </p>
                )}
              </div>
              <div style={{ padding: 18 }}>
                {selectedServices.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                    <FlaskConical size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: 13 }}>Hech qanday xizmat tanlanmadi</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: 350, overflowY: 'auto', marginBottom: 16 }}>
                    {selectedServices.map(s => (
                      <div key={s.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 0', borderBottom: '1px dashed #f1f5f9'
                      }}>
                        <span style={{ fontSize: 13, color: '#0f172a', flex: 1, paddingRight: 8 }}>{s.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{formatMoney(s.price)}</span>
                          <button
                            onClick={() => toggleService(s)}
                            style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedServices.length > 0 && (
                  <div style={{
                    padding: '14px 16px', background: 'linear-gradient(135deg, #f0f4ff, #e8f0fe)',
                    borderRadius: 12, border: '1.5px solid #c7d7ff', marginBottom: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#1e40af', textTransform: 'uppercase' }}>Jami:</span>
                      <span style={{ fontWeight: 900, fontSize: 22, color: '#4f46e5' }}>{formatMoney(totalPrice)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, marginTop: 4, textAlign: 'right' }}>
                      {selectedServices.length} ta xizmat
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!selectedPatient || selectedServices.length === 0 || loading}
                  style={{
                    width: '100%', padding: '14px',
                    borderRadius: 14, border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 700, fontSize: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s',
                    background: selectedPatient && selectedServices.length > 0 && !loading
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      : '#e2e8f0',
                    color: selectedPatient && selectedServices.length > 0 && !loading ? 'white' : '#94a3b8',
                    boxShadow: selectedPatient && selectedServices.length > 0 && !loading
                      ? '0 8px 20px rgba(6,182,212,0.3)'
                      : 'none'
                  }}
                >
                  <Plus size={18} />
                  {loading ? 'Yuborilmoqda...' : 'Kassirga Yuborish'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 10 }}>
                  💡 To'lov kassir tomonidan tasdiqlanadi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Helper Component ----
function ServiceBtn({ service, isSelected, toggle, formatMoney }) {
  return (
    <button
      onClick={() => toggle(service)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${isSelected ? '#6366f1' : '#e2e8f0'}`,
        background: isSelected ? 'linear-gradient(135deg, #eff6ff, #e0e7ff)' : 'white',
        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 5, border: `2px solid ${isSelected ? '#6366f1' : '#cbd5e1'}`,
          background: isSelected ? '#6366f1' : 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s'
        }}>
          {isSelected && <CheckCircle2 size={12} style={{ color: 'white' }} />}
        </div>
        <span style={{ fontSize: 12.5, fontWeight: isSelected ? 600 : 500, color: isSelected ? '#3730a3' : '#0f172a' }}>
          {service.name}
        </span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#4f46e5' : '#64748b', flexShrink: 0, marginLeft: 8 }}>
        {formatMoney(service.price)}
      </span>
    </button>
  );
}
