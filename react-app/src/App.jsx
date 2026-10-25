import { useMemo, useState } from 'react'

const initialStudents = [
  { id: 1, room: '8-hona', fullName: 'Fayzulloh Abdullazizov', className: '10-A', status: 'Keldi', note: '' },
  { id: 2, room: '1002', fullName: 'Sarvar Rahimov', className: '9-A', status: 'Keldi', note: '' },
  { id: 3, room: '1003', fullName: 'Shahzod Nurbekov', className: '9-B', status: 'Keldi', note: '' },
  { id: 4, room: '1004', fullName: 'Dilshod Karimov', className: '9-B', status: 'Keldi', note: '' },
  { id: 5, room: '1005', fullName: 'Azizbek Toshpulotov', className: '10-A', status: 'Kelmadi', note: 'Kasallik' },
  { id: 6, room: '1006', fullName: 'Sardor Olimov', className: '10-A', status: 'Keldi', note: '' },
  { id: 7, room: '1007', fullName: 'Bobur Yoqubov', className: '10-A', status: 'Sababli', note: 'Kasallik' },
  { id: 8, room: '1008', fullName: 'Otabek Xolmatov', className: '11-A', status: 'Keldi', note: '' },
  { id: 9, room: '1009', fullName: 'Farrux Aliyev', className: '11-A', status: 'Keldi', note: '' },
  { id: 10, room: '1010', fullName: 'Davron Usmonov', className: '11-A', status: 'Kelmadi', note: 'Oilaviy sabab' },
]

const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']

const statusConfig = {
  Keldi: { label: 'Keldi', color: '#2ecc71', bg: '#dff7ec' },
  'Kech keldi': { label: 'Kech keldi', color: '#f7c948', bg: '#fef3c7' },
  Kelmadi: { label: 'Kelmadi', color: '#ef4444', bg: '#fbe3e6' },
  Sababli: { label: 'Sababli', color: '#60a5fa', bg: '#dbeafe' },
  empty: { label: '', color: '#d1d5db', bg: '#f3f4f6' },
}

export const getMonthlyStatusMeta = (status, reason = '') => {
  const normalizedReason = reason?.trim()

  const statusMeta = {
    Keldi: {
      tone: 'green',
      color: '#22c55e',
      tooltip: "Keldi — o'quvchi bu kuni maktabga keldi.",
    },
    'Kech keldi': {
      tone: 'yellow',
      color: '#f59e0b',
      tooltip: normalizedReason ? `Kech keldi — sabab: ${normalizedReason}` : "Kech keldi — o'quvchi kech keldi.",
    },
    Kelmadi: {
      tone: 'red',
      color: '#ef4444',
      tooltip: normalizedReason ? `Kelmadi — sabab: ${normalizedReason}` : "Kelmadi — o'quvchi bu kuni kelmadi.",
    },
    Sababli: {
      tone: 'yellow',
      color: '#facc15',
      tooltip: normalizedReason ? `Sababli — sabab: ${normalizedReason}` : 'Sababli — o\'quvchi sabablisi bilan kelmagan.',
    },
  }

  return statusMeta[status] || {
    tone: 'gray',
    color: '#cbd5e1',
    tooltip: 'Ma\'lumot yo\'q',
  }
}

const getDayStatus = (studentIndex, dayNumber) => {
  const cycle = ['Kelmadi', 'Keldi', 'Keldi', 'Keldi', 'Sababli', 'Keldi', 'Keldi', 'Keldi', 'Kech keldi', 'Keldi', 'Keldi', 'Kelmadi']
  const index = (studentIndex * 3 + dayNumber) % cycle.length
  return cycle[index]
}

const formatDateForInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

function App() {
  const [students, setStudents] = useState(initialStudents)
  const [selectedDate, setSelectedDate] = useState('2026-10-24')
  const [searchValue, setSearchValue] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [activeTab, setActiveTab] = useState('daily')
  const [selectedMonth, setSelectedMonth] = useState(9)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [profileStudentId, setProfileStudentId] = useState(null)
  const [monthlyTooltip, setMonthlyTooltip] = useState(null)

  const filteredStudents = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return students.filter((student) => {
      const matchesName = !query || student.fullName.toLowerCase().includes(query)
      const matchesClass = !classFilter || student.className === classFilter
      return matchesName && matchesClass
    })
  }, [students, searchValue, classFilter])

  const weekend = isWeekend(new Date(`${selectedDate}T00:00:00`))

  const setStatus = (studentId, status) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId ? { ...student, status } : student,
      ),
    )
  }

  const saveAttendance = () => {
    if (weekend) {
      alert('Dam olish kunlari uchun davomat saqlanmaydi.')
      return
    }
    alert('Davomat muvaffaqiyatli saqlandi!')
  }

  const changeDate = (direction) => {
    const current = new Date(`${selectedDate}T00:00:00`)
    current.setDate(current.getDate() + direction)
    setSelectedDate(formatDateForInput(current))
  }

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()

  const showMonthlyTooltip = (event, config) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const placeBelow = rect.top < 90

    setMonthlyTooltip({
      text: config.tooltip,
      tone: config.tone,
      left: Math.min(Math.max(rect.left + rect.width / 2, 140), window.innerWidth - 140),
      top: placeBelow ? rect.bottom + 10 : rect.top - 10,
      placeBelow,
    })
  }

  const monthlyStats = useMemo(() => {
    const stats = { Keldi: 0, 'Kech keldi': 0, Kelmadi: 0, Sababli: 0 }

    students.forEach((student, studentIndex) => {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth, day)
        if (isWeekend(date)) continue
        const status = getDayStatus(studentIndex, day)
        if (stats[status] !== undefined) {
          stats[status] += 1
        }
      }
    })

    return stats
  }, [students, selectedMonth, selectedYear, daysInMonth])

  const monthlyRows = useMemo(() => {
    return students.map((student, studentIndex) => {
      const cells = []

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth, day)
        if (isWeekend(date)) {
          cells.push({ type: 'weekend', key: `${student.id}-day-${day}` })
          continue
        }

        const status = getDayStatus(studentIndex, day)
        const reason = status === 'Sababli' || status === 'Kelmadi' || status === 'Kech keldi' ? student.note || 'Sabab ko\'rsatilmagan' : ''
        cells.push({
          type: 'status',
          status,
          reason,
          key: `${student.id}-day-${day}`,
        })
      }

      return { ...student, cells }
    })
  }, [students, selectedMonth, selectedYear, daysInMonth])

  const profileStudent = students.find((student) => student.id === profileStudentId) || null

  return (
    <div className="attendance-page">
      <div className="app-shell">
        <div className="nav-tabs" aria-label="Main menu">
          <button
            type="button"
            className={activeTab === 'daily' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('daily')}
          >
            Kunlik davomat
          </button>
          <button
            type="button"
            className={activeTab === 'monthly' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('monthly')}
          >
            Oylik davomat
          </button>
        </div>

        {activeTab === 'daily' && (
          <div className="container daily-view">
            <header className="page-header">
              <div>
                <h1>Kunlik davomat</h1>
                <p>O'quvchilarning kunlik kelib-ketdi hisobini kiriting</p>
              </div>

              <div className="date-toolbar">
                <button type="button" className="nav-button" onClick={() => changeDate(-1)} aria-label="Oldingi kun">
                  {'<'}
                </button>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />

                <button type="button" className="nav-button" onClick={() => changeDate(1)} aria-label="Keyingi kun">
                  {'>'}
                </button>

                <button type="button" className="today-button" onClick={() => setSelectedDate(formatDateForInput(new Date()))}>
                  Bugun
                </button>
              </div>
            </header>

            {weekend && (
              <div className="weekend-banner" role="alert">
                <span className="banner-icon">⛔</span>
                <div>
                  <strong>Dam olish kuni! (Shanba / Yakshanba)</strong>
                  <p>Dam olish kunlari o'quvchilar yotoqxonada bo'lmaydi. Davomat tugmalari avval hisoblangan holatda faol emas.</p>
                </div>
              </div>
            )}

            <div className="filter-bar">
              <div className="search-box">
                <span className="search-icon">⌕</span>
                <input
                  type="text"
                  placeholder="Ism va familiya bo'yicha qidiruv..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                  <option value="">Barcha sinflar</option>
                  <option value="9-A">9-A</option>
                  <option value="9-B">9-B</option>
                  <option value="10-A">10-A</option>
                  <option value="11-A">11-A</option>
                </select>

                <button type="button" className="save-button" onClick={saveAttendance}>
                  💾 Saqlash
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th className="col-index">T/R</th>
                    <th>Hona raqami</th>
                    <th>O'quvchi Ism Familiyasi</th>
                    <th>Sinfi</th>
                    <th>Davomat statusi</th>
                    <th>Izoh (ixtiyoriy)</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">O'quvchilar topilmadi</td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr key={student.id}>
                        <td className="col-index">{index + 1}</td>
                        <td>{student.room}</td>
                        <td>{student.fullName}</td>
                        <td>{student.className}</td>
                        <td>
                          <div className="status-group">
                            <button
                              type="button"
                              className={student.status === 'Keldi' ? 'status-btn active green' : 'status-btn'}
                              onClick={() => setStatus(student.id, 'Keldi')}
                              disabled={weekend}
                            >
                              ✓ Keldi
                            </button>
                            <button
                              type="button"
                              className={student.status === 'Kelmadi' ? 'status-btn active red' : 'status-btn'}
                              onClick={() => setStatus(student.id, 'Kelmadi')}
                              disabled={weekend}
                            >
                              ✗ Kelmadi
                            </button>
                            <button
                              type="button"
                              className={student.status === 'Sababli' ? 'status-btn active amber' : 'status-btn'}
                              onClick={() => setStatus(student.id, 'Sababli')}
                              disabled={weekend}
                            >
                              S Sababli
                            </button>
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={student.note}
                            placeholder="Izoh..."
                            onChange={(e) => {
                              setStudents((current) =>
                                current.map((item) =>
                                  item.id === student.id ? { ...item, note: e.target.value } : item,
                                ),
                              )
                            }}
                            disabled={weekend}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="container monthly-view">
            <div className="monthly-header">
              <div>
                <h2>Oylik davomat</h2>
                <p>Oy davomidagi to'liq davomat jadvali</p>
              </div>

              <div className="month-controls">
                <button type="button" className="month-arrow" onClick={() => setSelectedMonth((value) => (value === 0 ? 11 : value - 1))}>
                  ‹
                </button>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                  {monthNames.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
                <button type="button" className="month-arrow" onClick={() => setSelectedMonth((value) => (value === 11 ? 0 : value + 1))}>
                  ›
                </button>
                <button type="button" className="today-button small" onClick={() => {
                  const now = new Date()
                  setSelectedMonth(now.getMonth())
                  setSelectedYear(now.getFullYear())
                }}>
                  Joriy oy
                </button>
              </div>
            </div>

            <div className="summary-grid">
              {[
                { key: 'Keldi', title: 'Keldi', value: monthlyStats['Keldi'], tone: 'present' },
                { key: 'Kech keldi', title: 'Kech keldi', value: monthlyStats['Kech keldi'], tone: 'late' },
                { key: 'Kelmadi', title: 'Kelmadi', value: monthlyStats['Kelmadi'], tone: 'absent' },
                { key: 'Sababli', title: 'Sababli', value: monthlyStats['Sababli'], tone: 'excused' },
              ].map((card) => (
                <div key={card.key} className={`summary-card ${card.tone}`}>
                  <div className="summary-value">{card.value}</div>
                  <div className="summary-title">{card.title}</div>
                </div>
              ))}
            </div>

            <div className="legend-bar">
              <span className="legend-label">Belgilar:</span>
              <span className="legend-item"><span className="dot green">✓</span>Keldi</span>
              <span className="legend-item"><span className="dot amber">✗</span>Kelmadi</span>
              <span className="legend-item"><span className="dot blue">S</span>Sababli</span>
              <span className="legend-item"><span className="dot gray"> </span>Dam olish</span>
            </div>

            <div className="monthly-table-wrap">
              <table className="monthly-table">
                <thead>
                  <tr>
                    <th className="mini-col">T/R</th>
                    <th className="room-col">Hona</th>
                    <th className="name-col">O'quvchi Ism Familiyasi</th>
                    {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => (
                      <th key={day} className="day-header">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyRows.map((student, index) => (
                    <tr key={student.id}>
                      <td className="mini-col">{index + 1}</td>
                      <td className="room-col">{student.room}</td>
                      <td className="name-cell">
                        <div className="name-row">
                          <span>{student.fullName}</span>
                          <button type="button" className="profile-btn" aria-label="Profilni ko'rish" onClick={() => setProfileStudentId(student.id)}>
                            👤
                          </button>
                        </div>
                      </td>

                      {student.cells.map((cell, cellIndex) => {
                        if (cell.type === 'weekend') {
                          return <td key={cell.key} className="status-cell weekend" />
                        }

                        const config = getMonthlyStatusMeta(cell.status, cell.reason)
                        return (
                          <td key={cell.key} className="status-cell">
                            <button
                              type="button"
                              className="status-dot"
                              style={{
                                background: config.color,
                                boxShadow: `0 0 0 2px ${config.color}22`,
                              }}
                              aria-label={config.tooltip}
                              aria-describedby={monthlyTooltip ? 'monthly-status-tooltip' : undefined}
                              onMouseEnter={(event) => showMonthlyTooltip(event, config)}
                              onMouseLeave={() => setMonthlyTooltip(null)}
                              onFocus={(event) => showMonthlyTooltip(event, config)}
                              onBlur={() => setMonthlyTooltip(null)}
                            >
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {monthlyTooltip && (
        <div
          id="monthly-status-tooltip"
          className={`monthly-status-tooltip ${monthlyTooltip.placeBelow ? 'below' : ''}`}
          data-tone={monthlyTooltip.tone}
          role="tooltip"
          style={{ left: monthlyTooltip.left, top: monthlyTooltip.top }}
        >
          <span className="tooltip-status-mark" />
          <span>{monthlyTooltip.text}</span>
        </div>
      )}

      {profileStudent && (
        <div className="profile-modal-backdrop" onClick={() => setProfileStudentId(null)}>
          <div className="profile-modal" onClick={(event) => event.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>O'quvchi profili</h3>
              <button type="button" className="close-button" onClick={() => setProfileStudentId(null)}>×</button>
            </div>

            <div className="profile-body">
              <div className="profile-row">
                <span className="label">Ism familiya</span>
                <strong>{profileStudent.fullName}</strong>
              </div>
              <div className="profile-row">
                <span className="label">Sinfi</span>
                <strong>{profileStudent.className}</strong>
              </div>
              <div className="profile-row">
                <span className="label">Hona raqami</span>
                <strong>{profileStudent.room}</strong>
              </div>
              <div className="profile-row">
                <span className="label">Telefon</span>
                <strong>+998 90 123 45 67</strong>
              </div>
              <div className="profile-row">
                <span className="label">Yotoqxonaga qo'shilgan sana</span>
                <strong>15.01.2024</strong>
              </div>
              <div className="profile-row">
                <span className="label">Holati</span>
                <strong>Faol</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
