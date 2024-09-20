document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const filterInput = document.getElementById('task-filter');
    const themeToggle = document.getElementById('theme-toggle');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Populando lista com dados fictícios
    if (tasks.length === 0) {
        tasks = [
            { name: 'Estudar JavaScript', completed: false },
            { name: 'Terminar exercício de CSS', completed: true }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para renderizar as tarefas
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span>${task.name}</span>
                <button onclick="toggleTask(${index})">Concluir</button>
                <button onclick="removeTask(${index})">Remover</button>
            `;
            taskList.appendChild(li);
        });
    }

    // Adicionando uma nova tarefa
    document.getElementById('add-task-btn').addEventListener('click', () => {
        const taskName = taskInput.value.trim();
        if (taskName) {
            tasks.push({ name: taskName, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            renderTasks();
        }
    });

    // Função para marcar como concluída
    window.toggleTask = function (index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    // Função para remover uma tarefa
    window.removeTask = function (index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    // Função para filtrar tarefas
    filterInput.addEventListener('input', (e) => {
        const filterValue = e.target.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(filterValue));
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span>${task.name}</span>
                <button onclick="toggleTask(${index})">Concluir</button>
                <button onclick="removeTask(${index})">Remover</button>
            `;
            taskList.appendChild(li);
        });
    });

    // Tema escuro/claro
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Aplicando o tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Renderizar tarefas ao carregar a página
    renderTasks();
});