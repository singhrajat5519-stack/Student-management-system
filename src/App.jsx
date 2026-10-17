import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownToLine, Bell, BookOpen, CalendarDays, Check,
  ChevronDown, CircleHelp, GraduationCap, LayoutDashboard, Menu,
  MoreHorizontal, Pencil, Plus, Search, Settings, SlidersHorizontal,
  Trash2, Users, X, Clock3, Mail, Phone, Sparkles, TrendingUp,
} from 'lucide-react'

const seedStudents = [
  { id: 'STU-1024', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', course: 'Computer Science', year: 'Year 2', status: 'Active', joined: '12 Aug 2025', initials: 'AS', color: 'lavender' },
  { id: 'STU-1025', name: 'Ananya Verma', email: 'ananya.verma@example.com', phone: '+91 98765 12340', course: 'Business Administration', year: 'Year 3', status: 'Active', joined: '18 Aug 2025', initials: 'AV', color: 'peach' },
  { id: 'STU-1026', name: 'Rohan Gupta', email: 'rohan.gupta@example.com', phone: '+91 91234 56780', course: 'Computer Science', year: 'Year 1', status: 'Pending', joined: '02 Sep 2025', initials: 'RG', color: 'mint' },
  { id: 'STU-1027', name: 'Diya Patel', email: 'diya.patel@example.com', phone: '+91 99887 76655', course: 'Design & Arts', year: 'Year 2', status: 'Active', joined: '06 Sep 2025', initials: 'DP', color: 'pink' },
  { id: 'STU-1028', name: 'Vivaan Singh', email: 'vivaan.singh@example.com', phone: '+91 90123 45678', course: 'Data Science', year: 'Year 3', status: 'Inactive', joined: '21 Sep 2025', initials: 'VS', color: 'blue' },
  { id: 'STU-1029', name: 'Ishita Rao', email: 'ishita.rao@example.com', phone: '+91 93456 78901', course: 'Business Administration', year: 'Year 1', status: 'Active', joined: '29 Sep 2025', initials: 'IR', color: 'yellow' },
  { id: 'STU-1030', name: 'Kabir Mehta', email: 'kabir.mehta@example.com', phone: '+91 97654 32109', course: 'Computer Science', year: 'Year 4', status: 'Active', joined: '04 Oct 2025', initials: 'KM', color: 'mint' },
  { id: 'STU-1031', name: 'Saanvi Joshi', email: 'saanvi.joshi@example.com', phone: '+91 98760 12345', course: 'Design & Arts', year: 'Year 2', status: 'Pending', joined: '11 Oct 2025', initials: 'SJ', color: 'peach' },
]

const courses = ['Computer Science', 'Business Administration', 'Design & Arts', 'Data Science']
const colors = ['lavender', 'peach', 'mint', 'pink', 'blue', 'yellow']

function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('')
}

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('campusflow-students')
      return saved ? JSON.parse(saved) : seedStudents
    } catch { return seedStudents }
  })
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All courses')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    localStorage.setItem('campusflow-students', JSON.stringify(students))
  }, [students])

  function emptyForm() {
    return { name: '', email: '', phone: '', course: courses[0], year: 'Year 1', status: 'Active' }
  }

  const filteredStudents = useMemo(() => students.filter(student => {
    const q = search.toLowerCase().trim()
    const matchesSearch = !q || [student.name, student.email, student.id, student.course].some(value => value.toLowerCase().includes(q))
    return matchesSearch &&
      (courseFilter === 'All courses' || student.course === courseFilter) &&
      (statusFilter === 'All statuses' || student.status === statusFilter)
  }), [students, search, courseFilter, statusFilter])

  const activeCount = students.filter(s => s.status === 'Active').length
  const pendingCount = students.filter(s => s.status === 'Pending').length

  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  function openEdit(student) {
    setEditing(student)
    setForm({ name: student.name, email: student.email, phone: student.phone, course: student.course, year: student.year, status: student.status })
    setModalOpen(true)
  }

  function submitStudent(event) {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    if (!name || !email) return
    if (editing) {
      setStudents(current => current.map(s => s.id === editing.id ? { ...s, ...form, name, email, initials: getInitials(name) } : s))
      showNotice('Student details updated successfully')
    } else {
      const nextNumber = Math.max(1031, ...students.map(s => Number(s.id.replace('STU-', '')) || 0)) + 1
      const newStudent = {
        ...form, name, email, phone: form.phone.trim(), initials: getInitials(name),
        id: `STU-${nextNumber}`, joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        color: colors[students.length % colors.length],
      }
      setStudents(current => [newStudent, ...current])
      showNotice('New student added successfully')
    }
    setModalOpen(false)
  }

  function deleteStudent(student) {
    if (window.confirm(`Delete ${student.name}'s record? This cannot be undone.`)) {
      setStudents(current => current.filter(s => s.id !== student.id))
      showNotice('Student record deleted')
    }
  }

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function exportCsv() {
    const headers = ['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Year', 'Status', 'Joined']
    const rows = filteredStudents.map(s => [s.id, s.name, s.email, s.phone, s.course, s.year, s.status, s.joined])
    const csv = [headers, ...rows].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'campusflow-students.csv'
    link.click()
    URL.revokeObjectURL(url)
    showNotice('Student list exported as CSV')
  }

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={23} strokeWidth={2.5} /></div>
          <div><span className="brand-name">campusflow</span><span className="brand-subtitle">STUDENT PORTAL</span></div>
          <button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          <button className="nav-item"><LayoutDashboard size={18} /><span>Overview</span></button>
          <button className="nav-item active"><Users size={18} /><span>Students</span><span className="nav-count">{students.length}</span></button>
          <button className="nav-item"><BookOpen size={18} /><span>Courses</span></button>
          <button className="nav-item"><CalendarDays size={18} /><span>Attendance</span></button>
          <button className="nav-item"><Activity size={18} /><span>Reports & analytics</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={18} /></div>
            <div><strong>Need a hand?</strong><p>Visit our help center</p></div>
            <ChevronDown className="help-chevron" size={15} />
          </div>
          <button className="profile">
            <div className="profile-avatar">AR</div>
            <div className="profile-info"><strong>Admin Rahul</strong><span>Administrator</span></div>
            <MoreHorizontal size={20} className="profile-more" />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={21} /></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>Students</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="term-pill"><span className="green-dot" /> Fall semester 2025 <ChevronDown size={14} /></div>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="topbar-avatar">AR</div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="page-heading">
            <div>
              <div className="eyebrow"><Sparkles size={13} /> STUDENT DIRECTORY</div>
              <h1>Students <span className="heading-count">{students.length}</span></h1>
              <p className="page-subtitle">Manage your students, track their progress, and keep everything organized.</p>
            </div>
            <div className="heading-actions">
              <button className="button button-secondary" onClick={exportCsv}><ArrowDownToLine size={17} /> Export</button>
              <button className="button button-primary" onClick={openAdd}><Plus size={18} /> Add student</button>
            </div>
          </section>

          <section className="stats-grid" aria-label="Student statistics">
            <StatCard icon={<Users size={19} />} iconClass="stat-purple" label="Total students" value={students.length.toLocaleString()} trend="+12.8%" detail="vs. last semester" />
            <StatCard icon={<Check size={19} />} iconClass="stat-green" label="Active students" value={activeCount.toLocaleString()} trend={`${students.length ? Math.round(activeCount / students.length * 100) : 0}%`} detail="of all students" />
            <StatCard icon={<Clock3 size={19} />} iconClass="stat-orange" label="Pending review" value={pendingCount.toLocaleString()} trend="Needs attention" detail="enrollment status" />
            <StatCard icon={<TrendingUp size={19} />} iconClass="stat-blue" label="Courses offered" value={courses.length.toString()} trend="Across campus" detail="academic programs" />
          </section>

          <section className="directory-card">
            <div className="directory-top">
              <div><h2>All students</h2><p>View and manage your student records</p></div>
              <div className="directory-meta"><span className="live-dot" /> Data synced locally <span className="meta-divider" /> Updated just now</div>
            </div>
            <div className="toolbar">
              <label className="search-box">
                <Search size={18} />
                <input aria-label="Search students" placeholder="Search name, email, ID..." value={search} onChange={e => setSearch(e.target.value)} />
                {search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={15} /></button>}
                <kbd>⌘ K</kbd>
              </label>
              <div className="filter-actions">
                <label className="select-wrap"><SlidersHorizontal size={16} /><select aria-label="Filter by course" value={courseFilter} onChange={e => setCourseFilter(e.target.value)}><option>All courses</option>{courses.map(course => <option key={course}>{course}</option>)}</select><ChevronDown size={14} /></label>
                <label className="select-wrap status-select"><select aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All statuses</option><option>Active</option><option>Pending</option><option>Inactive</option></select><ChevronDown size={14} /></label>
                <button className="icon-button filter-more" aria-label="More filters" onClick={() => { setCourseFilter('All courses'); setStatusFilter('All statuses'); setSearch('') }}><MoreHorizontal size={20} /></button>
              </div>
            </div>

            <div className="table-scroll">
              <table>
                <thead><tr><th><input type="checkbox" aria-label="Select all visible students" onChange={e => showNotice(e.target.checked ? 'Bulk selection is a demo feature' : 'Selection cleared')} /></th><th>STUDENT <span className="sort-mark">↕</span></th><th>STUDENT ID</th><th>COURSE</th><th>YEAR</th><th>STATUS</th><th>ENROLLED</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {filteredStudents.map(student => <tr key={student.id}>
                    <td><input type="checkbox" aria-label={`Select ${student.name}`} /></td>
                    <td><div className="student-cell"><div className={`student-avatar avatar-${student.color}`}>{student.initials}</div><div className="student-details"><strong>{student.name}</strong><span><Mail size={12} /> {student.email}</span></div></div></td>
                    <td><span className="student-id">{student.id}</span></td>
                    <td><span className="course-name"><span className={`course-dot dot-${student.color}`} />{student.course}</span></td>
                    <td><span className="year-pill">{student.year}</span></td>
                    <td><span className={`status-badge status-${student.status.toLowerCase()}`}><span />{student.status}</span></td>
                    <td><span className="enrolled-date">{student.joined}</span></td>
                    <td><div className="row-actions"><button aria-label={`Edit ${student.name}`} title="Edit student" onClick={() => openEdit(student)}><Pencil size={15} /></button><button aria-label={`Delete ${student.name}`} title="Delete student" onClick={() => deleteStudent(student)}><Trash2 size={15} /></button></div></td>
                  </tr>)}
                  {filteredStudents.length === 0 && <tr><td colSpan="8"><div className="empty-state"><Search size={25} /><strong>No students found</strong><span>Try a different search or clear your filters.</span><button className="button button-secondary" onClick={() => { setSearch(''); setCourseFilter('All courses'); setStatusFilter('All statuses') }}>Clear filters</button></div></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing <strong>{filteredStudents.length ? 1 : 0}–{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span>
              <div className="pagination"><button disabled>Previous</button><button className="page-number">1</button><button disabled>Next</button></div>
            </div>
          </section>

          <footer className="page-footer"><span>© 2025 CampusFlow. Made for better learning.</span><div><a href="https://react.dev/" target="_blank" rel="noreferrer">React</a><span>·</span><a href="https://vite.dev/" target="_blank" rel="noreferrer">Vite</a><span>·</span><button onClick={() => showNotice('CampusFlow frontend demo — no backend connected.')}>About this demo</button></div></footer>
        </div>
      </main>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
        <section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div><div className="modal-icon"><GraduationCap size={21} /></div><h2 id="modal-title">{editing ? 'Edit student' : 'Add a student'}</h2><p>{editing ? 'Update the student’s information below.' : 'Fill in the details to create a student record.'}</p></div><button className="icon-button" aria-label="Close dialog" onClick={() => setModalOpen(false)}><X size={20} /></button></div>
          <form onSubmit={submitStudent}>
            <div className="form-grid">
              <label className="form-field full-field"><span>Full name <b>*</b></span><input autoFocus required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Aarav Sharma" /></label>
              <label className="form-field"><span>Email address <b>*</b></span><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" /></label>
              <label className="form-field"><span>Phone number</span><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></label>
              <label className="form-field full-field"><span>Course <b>*</b></span><select required value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>{courses.map(course => <option key={course}>{course}</option>)}</select></label>
              <label className="form-field"><span>Academic year</span><select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>{['Year 1', 'Year 2', 'Year 3', 'Year 4'].map(year => <option key={year}>{year}</option>)}</select></label>
              <label className="form-field"><span>Status</span><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{['Active', 'Pending', 'Inactive'].map(status => <option key={status}>{status}</option>)}</select></label>
            </div>
            <div className="modal-footer"><button type="button" className="button button-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="button button-primary"><Check size={16} /> {editing ? 'Save changes' : 'Add student'}</button></div>
          </form>
        </section>
      </div>}

      {notice && <div className="toast"><span><Check size={15} /></span>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></div>}
    </div>
  )
}

function StatCard({ icon, iconClass, label, value, trend, detail }) {
  return <article className="stat-card"><div className={`stat-icon ${iconClass}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-bottom"><span className={iconClass === 'stat-orange' ? 'trend-neutral' : 'trend-positive'}>{trend}</span><span>{detail}</span></div><div className={`stat-decoration ${iconClass}`} /></article>
}

export default App
