const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    if (authToken) {
        verifyToken();
    } else {
        showAuthSection();
    }

  
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('todoForm').addEventListener('submit', handleAddTodo);
});

// Auth functions
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showAuthSection() {
    document.getElementById('auth-section').classList.add('active');
    document.getElementById('todo-section').classList.remove('active');
}

function showTodoSection() {
    document.getElementById('auth-section').classList.remove('active');
    document.getElementById('todo-section').classList.add('active');
    loadTodos();
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            authToken = result.token;
            localStorage.setItem('token', authToken);
            currentUser = result.user;
            showSuccess('Login successful!');
            document.getElementById('username').textContent = currentUser.name;
            showTodoSection();
        } else {
            showError(result.message || 'Login failed');
        }
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Login error:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess('Registration successful! Please login.');
            showLogin();
            e.target.reset();
        } else {
            showError(result.message || 'Registration failed');
        }
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Register error:', error);
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const result = await response.json();
            currentUser = result.data;
            document.getElementById('username').textContent = currentUser.name;
            showTodoSection();
        } else {
            localStorage.removeItem('token');
            authToken = null;
            showAuthSection();
        }
    } catch (error) {
        localStorage.removeItem('token');
        authToken = null;
        showAuthSection();
    }
}

function logout() {
    localStorage.removeItem('token');
    authToken = null;
    currentUser = null;
    showAuthSection();
    showSuccess('Logged out successfully!');
}

// Todo functions
async function loadTodos() {
    const loadingEl = document.getElementById('loading');
    const todoListEl = document.getElementById('todo-list');
    
    loadingEl.style.display = 'block';
    todoListEl.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE}/todos`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const result = await response.json();
        loadingEl.style.display = 'none';

        if (response.ok) {
            displayTodos(result.data);
        } else {
            showError('Failed to load todos');
        }
    } catch (error) {
        loadingEl.style.display = 'none';
        showError('Network error while loading todos');
        console.error('Load todos error:', error);
    }
}

async function handleAddTodo(e) {
    e.preventDefault();
    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;

    const data = {
        title,
        description,
        completed: false
    };

    try {
        const response = await fetch(`${API_BASE}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess('Todo added successfully!');
            e.target.reset();
            loadTodos();
        } else {
            showError(result.message || 'Failed to add todo');
        }
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Add todo error:', error);
    }
}

async function toggleTodo(id, currentStatus) {
    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ completed: !currentStatus })
        });

        if (response.ok) {
            loadTodos();
        } else {
            showError('Failed to update todo');
        }
    } catch (error) {
        showError('Network error while updating todo');
        console.error('Toggle todo error:', error);
    }
}

async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showSuccess('Todo deleted successfully!');
            loadTodos();
        } else {
            showError('Failed to delete todo');
        }
    } catch (error) {
        showError('Network error while deleting todo');
        console.error('Delete todo error:', error);
    }
}

function displayTodos(todos) {
    const todoListEl = document.getElementById('todo-list');
    
    if (todos.length === 0) {
        todoListEl.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>No todos yet!</h3>
                <p>Add your first task above to get started.</p>
            </div>
        `;
        return;
    }

    todoListEl.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <div class="todo-header">
                <h4 class="todo-title">${escapeHtml(todo.title)}</h4>
                <span class="todo-status ${todo.completed ? 'completed' : 'pending'}">
                    ${todo.completed ? 'Completed' : 'Pending'}
                </span>
            </div>
            ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
            <div class="todo-actions">
                <button class="btn btn-success btn-small" onclick="toggleTodo('${todo._id}', ${todo.completed})">
                    ${todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteTodo('${todo._id}')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Utility functions
function showError(message) {
    const errorEl = document.getElementById('error-message');
    const successEl = document.getElementById('success-message');
    
    successEl.style.display = 'none';
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const errorEl = document.getElementById('error-message');
    const successEl = document.getElementById('success-message');
    
    errorEl.style.display = 'none';
    successEl.textContent = message;
    successEl.style.display = 'block';
    
    setTimeout(() => {
        successEl.style.display = 'none';
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}