import React, { useState, useEffect } from 'react'
import { tasks } from '../services/api'
import TaskForm from './TaskForm'

const Dashboard = ({ user }) => {
  const [taskList, setTaskList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await tasks.getAll()
      setTaskList(response.data.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      await tasks.delete(id)
      await fetchTasks()
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchTasks()
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      'in-progress': 'bg-info',
      completed: 'bg-success'
    }
    return `badge ${badges[status] || 'bg-secondary'}`
  }

  if (loading && taskList.length === 0) {
    return <div className="text-center mt-5">Loading...</div>
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add New Task
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {taskList.length === 0 ? (
        <div className="alert alert-info">No tasks found. Create your first task!</div>
      ) : (
        <div className="row">
          {taskList.map((task) => (
            <div key={task._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text">{task.description || 'No description'}</p>
                  <span className={getStatusBadge(task.status)}>
                    {task.status}
                  </span>
                  {user?.role === 'admin' && task.user && (
                    <small className="d-block mt-2 text-muted">
                      Created by: {task.user.username}
                    </small>
                  )}
                  <div className="mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard