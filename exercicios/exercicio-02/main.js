// Inicializa as tarefas a partir do localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Se não houver tarefas, adiciona algumas fictícias
if (tasks.length === 0) {
    tasks = [
        { name: 'Estudar JavaScript', completed: false },
        { name: 'Terminar exercício de CSS', completed: true }
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para renderizar as tarefas
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpa a lista antes de renderizar

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.innerHTML = `
            <span>${task.name}</span>
            <button onclick="toggleTask(${index})">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
            <button onclick="removeTask(${index})">Remover</button>
        `;
        taskList.appendChild(li);
    });
}

// Função para adicionar nova tarefa
document.getElementById('add-task').addEventListener('click', () => {
    const newTaskInput = document.getElementById('new-task');
    const newTaskName = newTaskInput.value.trim();
    if (newTaskName) {
        tasks.push({ name: newTaskName, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        newTaskInput.value = ''; // Limpa o campo de input
        renderTasks(); // Renderiza as tarefas atualizadas
    }
});

// Função para marcar/desmarcar tarefa
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(); // Atualiza a lista
}

// Função para remover tarefa
function removeTask(index) {
    tasks.splice(index, 1); // Remove a tarefa
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(); // Atualiza a lista
}

// Alternar entre tema claro e escuro
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Aplicar o tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Renderiza as tarefas inicialmente
renderTasks();