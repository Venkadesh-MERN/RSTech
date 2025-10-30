import { useState,useEffect } from 'react';
import './App.css';
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null); 
  const [activeMenu, setActiveMenu] = useState(null); 
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    designation: '',
    project: '',
    type: '',
    status: '',
    photo:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  const API_URL = "http://localhost:5000";
  useEffect(() => {
    fetchEmployees();
  }, []);
    const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error(" Error fetching employees:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async () => {
    if (
      formData.name &&
      formData.employeeId &&
      formData.department &&
      formData.designation &&
      formData.type &&
      formData.status
    ) {
      try {
        if (editingEmployee) {
          await axios.put(`${API_URL}/employees/${editingEmployee.id}`, formData);
        } else {
          await axios.post(`${API_URL}/employees`, formData);
        }

        fetchEmployees();
        handleCancel();
      } catch (err) {
        console.error(" Error saving employee:", err);
      }
    }
  };

 const handleCancel = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      employeeId: '',
      department: '',
      designation: '',
      project: '',
      type: '',
      status: '',
      photo:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    });
  };

    const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
      fetchEmployees();
      setActiveMenu(null);
    } catch (err) {
      console.error(" Error deleting employee:", err);
    }
  };

    const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setShowModal(true);
    setActiveMenu(null);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div className="logo">RS-TECH</div>
        <div className="header-right">
          <button className="icon-button" aria-label="Settings">⚙️</button>
          <button className="icon-button" aria-label="Notifications">🔔</button>
          <div className="avatar">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="User"
            />
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav>
            <a href="#" className="nav-item active">
              👤 <span>Employee</span>
            </a>
          </nav>
        </aside>

        <main className="main-content">
          <div className="content-header">
            <h1>Employee</h1>
            <div className="header-actions">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="add-button"
                onClick={() => {
                  setShowModal(true);
                  setEditingEmployee(null);
                }}
              >
                Add New Employee
              </button>
            </div>
          </div>

          <div className="employee-table">
            <div className="table-header">
              <div className="table-cell">Employee Name</div>
              <div className="table-cell">Employee ID</div>
              <div className="table-cell">Department</div>
              <div className="table-cell">Designation</div>
              <div className="table-cell">Project</div>
              <div className="table-cell">Type</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Action</div>
            </div>
            <div className="table-body">
              {filteredEmployees.length === 0 && (
                <div className="no-records">
                  <p>No records found</p>
                </div>
              )}
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="table-row">
                  <div className="table-cell employee-name">
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="employee-photo"
                    />
                    <span>{employee.name}</span>
                  </div>
                  <div className="table-cell">{employee.employeeId}</div>
                  <div className="table-cell">{employee.department}</div>
                  <div className="table-cell">{employee.designation}</div>
                  <div className="table-cell">{employee.project || '-'}</div>
                  <div className="table-cell">{employee.type}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${employee.status.toLowerCase()}`}>
                      {employee.status}
                    </span>
                  </div>
                  <div className="table-cell" style={{ position: 'relative' }}>
                    <button
                      className="action-button"
                      onClick={() =>
                        setActiveMenu(activeMenu === employee.id ? null : employee.id)
                      }
                    >
                      ⋮
                    </button>

                    {activeMenu === employee.id && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '30px',
                          background: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '6px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                          zIndex: 10,
                        }}
                      >
                        <button
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleEdit(employee)}
                        >
                          ✏️ Update
                        </button>
                        <button
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleDelete(employee.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <button className="back-button" onClick={handleCancel}>
                ←
              </button>
              <h2>{editingEmployee ? 'Update Employee' : 'Add New Employee'}</h2>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name<span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Employee ID<span className="required">*</span></label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Department<span className="required">*</span></label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Designation<span className="required">*</span></label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Designation</option>
                    <option value="Design Lead">Design Lead</option>
                    <option value="Senior Designer">Senior Designer</option>
                    <option value="Designer">Designer</option>
                    <option value="Junior Designer">Junior Designer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Project</label>
                  <input
                    type="text"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Type<span className="required">*</span></label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Office">Office</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Status<span className="required">*</span></label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              <button className="confirm-button" onClick={handleSubmit}>
                {editingEmployee ? 'Update' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
