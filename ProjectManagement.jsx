import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Исправленный импорт
import './ProjectManagement.css';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [activeProject, setActiveProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);

  if (!authContext) {
    console.error('AuthContext не доступен');
    navigate('/auth');
    return null;
  }

  const { user, logout } = authContext;
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const savedProjects = localStorage.getItem(`projects_${user.id}`);
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects([
        {
          id: 1,
          title: "Веб-сайт компании",
          status: "В работе",
          tasks: [
            {
              id: 1,
              title: "Дизайн главной страницы",
              description: "Создать макет главной страницы с учётом брендинга",
              status: "Завершена",
              type: "Дизайн",
              modified: "30.05.2025 13:34"
            },
            {
              id: 2,
              title: "Разработка API",
              description: "Создать REST API для работы с данными",
              status: "В работе",
              type: "Backend",
              modified: "20.05.2025 19:50"
            }
          ]
        },
        {
          id: 2,
          title: "Мобильное приложение",
          status: "Новый",
          tasks: []
        }
      ]);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`projects_${user.id}`, JSON.stringify(projects));
    }
  }, [projects, user]);

  const addTask = (projectId) => {
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: "",
      status: "Новая",
      type: "Разработка",
      modified: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setProjects(projects.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            tasks: [...project.tasks, newTask],
            status: project.status === "Новый" ? "В работе" : project.status
          } 
        : project
    ));

    setNewTaskTitle("");
  };

  const addProject = () => {
    if (!newProjectTitle.trim()) return;
    
    const newProject = {
      id: Date.now(),
      title: newProjectTitle,
      status: "Новый",
      tasks: []
    };

    setProjects([...projects, newProject]);
    setNewProjectTitle("");
    setShowAddProject(false);
  };

  const toggleProject = (projectId) => {
    setActiveProject(activeProject === projectId ? null : projectId);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "В работе": "in-progress",
      "Завершена": "completed",
      "Новая": "new",
      "Новый": "new"
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return <span className="type-badge">{type}</span>;
  };

  if (!user) {
    return <div>Перенаправление на страницу авторизацию...</div>;
  }

  return (
    <div className="project-management">
      <header className="app-header">
        <h1>Управление проектами</h1>
        <div className="user-controls">
          <span className="user-email">{user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
      </header>

      {projects.map(project => (
        <div key={project.id} className="project-card">
          <div 
            className="project-header" 
            onClick={() => toggleProject(project.id)}
          >
            <div className="project-title">
              <h2>{project.title}</h2>
              <div className="project-meta">
                {getStatusBadge(project.status)}
                <span className="task-count">Задач: {project.tasks.length}</span>
              </div>
            </div>
          </div>

          {activeProject === project.id && (
            <div className="project-content">
              {project.tasks.length > 0 ? (
                project.tasks.map(task => (
                  <div key={task.id} className="task-card">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-footer">
                      <div className="task-badges">
                        {getStatusBadge(task.status)}
                        {getTypeBadge(task.type)}
                      </div>
                      <div className="task-modified">
                        Изменено: {task.modified}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-tasks">Нет задач</div>
              )}

              <div className="add-task-form">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Название задачи"
                  onKeyPress={(e) => e.key === 'Enter' && addTask(project.id)}
                />
                <button 
                  onClick={() => addTask(project.id)}
                  className="add-task-btn"
                >
                  + Добавить задачу
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="add-project-section">
        {showAddProject ? (
          <div className="add-project-form">
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Название проекта"
              onKeyPress={(e) => e.key === 'Enter' && addProject()}
              autoFocus
            />
            <div className="add-project-actions">
              <button onClick={addProject} className="confirm-add-btn">
                Добавить
              </button>
              <button 
                onClick={() => setShowAddProject(false)} 
                className="cancel-add-btn"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowAddProject(true)}
            className="add-project-btn"
          >
            + Добавить проект
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;