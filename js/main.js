import { uniqueId, formatDate } from "./helpers"
import { checkeIcon } from './helpers/icons'


const searchInput = document.querySelector('.search--input')
const todoListContainer = document.querySelector('.todo--list')
const message = document.createElement('p')
const overlay = document.querySelector('.overlay')
const createTaskModal = document.querySelector('.create-task-modal')
const openModalBtn = document.querySelector('.todo--add-btn')
const closeModalBtn = createTaskModal.querySelector('.modal--close-btn')
const updateTaskModal = document.querySelector('.task-update-modal')
const closeUpdateModalBtn = updateTaskModal.querySelector('.modal--close-btn')
const taskTitle = document.querySelector('.create-input-form')
const taskDecription = document.querySelector('.create-textarea-form')
const addTaskBtn = document.querySelector('.modal--save-btn')
const cancelTaskBtn = document.querySelector('.modal--cancel-btn')
const checkBtn = document.querySelector('.todo--check-btn')
const optionBtn = document.querySelector('.todo--opt-btn')
const optionsContainer = document.querySelector('.options-btns')
const doneOptBtn = document.querySelector('.done-opt')
const undoneOptBtn = document.querySelector('.undone-opt')
const deleteOptBtn = document.querySelector('.delete-opt')

let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []

if (localStorage.getItem('tasks') === null) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const loadTasks = (taskToLoad = tasks) => {
    todoListContainer.innerHTML = '';

    if (!taskToLoad.length) {
        message.classList.add('todo--empty-message')

        const messageToDisplay = searchInput.value ? `"${searchInput.value}" not found 🤨` : 'No tasks created 😊'

        message.textContent = messageToDisplay

        todoListContainer.appendChild(message)
    }

    taskToLoad.forEach(task => {
        const { id, title, createdAt, checked, completed } = task

        const taskElement = document.createElement('li')
        taskElement.setAttribute('data-id', id)
        taskElement.classList.add('todo--list-item')

        if (completed) {
            taskElement.classList.add('task-completed')
        }

        taskElement.innerHTML = `
        <div class="flex-group-2">
              <span class="item--title">${title}</span>
              <span class="item--date">${formatDate(createdAt)}</span>
                <button class="task--check-btn">
                 ${checked ? checkeIcon : ''}
                  <span class="visually-hidden">Select task icon</span>
                </button>
                <button class="todo--delete-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-describedby="delete-icon"
                    role="img"
                  >
                    <title id="delete-icon">Delete icon</title>
                    <path
                      d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"
                    ></path>
                  </svg>
                  <span class="visually-hidden">Delete task icon</span>
                </button>
            </div >
    `

        todoListContainer.appendChild(taskElement)

        const deleteTaskBtn = taskElement.querySelectorAll('.todo--delete-btn')
        const checkTaskBtn = taskElement.querySelectorAll('.task--check-btn')

        // Delete Task
        deleteTaskBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                const taskElement = btn.closest('.todo--list-item')
                const taskId = taskElement.dataset.id

                tasks.splice(tasks.findIndex(task => task.id === taskId), 1)

                localStorage.setItem('tasks', JSON.stringify(tasks))

                loadTasks()
            })

        })

        // Check Task
        checkTaskBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                const taskElement = btn.closest('.todo--list-item')
                const taskId = taskElement.dataset.id

                const currentTask = tasks.find(task => task.id === taskId)

                currentTask.checked = !currentTask.checked

                localStorage.setItem('tasks', JSON.stringify(tasks))
                loadTasks()

            })
        })

    })

    const tasksItems = document.querySelectorAll('.todo--list-item')

    // Update Task
    tasksItems.forEach(currentTask => {
        const taskTitle = currentTask.querySelector('.item--title')
        taskTitle.addEventListener('click', (e) => {
            const taskTitleInput = updateTaskModal.querySelector('.update-input-form')
            const taskDescriptionInput = updateTaskModal.querySelector('.update-textarea-form')
            const updateTaskBtn = updateTaskModal.querySelector('.modal--save-btn')
            const cancelUpdateTaskBtn = updateTaskModal.querySelector('.modal--cancel-btn')

            toggleUpdateModal()

            const taskToBeUpdated = taskToLoad.find(task => task.id === currentTask.dataset.id)

            taskTitleInput.value = taskToBeUpdated.title
            taskDescriptionInput.value = taskToBeUpdated.description

            updateTaskBtn.addEventListener('click', () => {
                if (taskTitleInput.value === '') return alert('Please enter a task title')

                taskToBeUpdated.title = taskTitleInput.value
                taskToBeUpdated.description = taskDescriptionInput.value

                localStorage.setItem('tasks', JSON.stringify(taskToLoad))
                loadTasks()
                toggleUpdateModal()
            })

            cancelUpdateTaskBtn.addEventListener('click', toggleUpdateModal)
        })
    })
}

// Search Task
const searchTask = (e) => {
    const searchValue = e.target.value.toLowerCase()

    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(searchValue)
    })

    loadTasks(filteredTasks)
}

// Add Task
const addTask = () => {

    if (taskTitle.value === '') return alert('Please enter a task title')

    const newTask = {
        id: uniqueId(),
        title: taskTitle.value,
        description: taskDecription.value,
        createdAt: new Date(),
        completed: false,
        checked: false
    }

    tasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(tasks))

    taskTitle.value = ''
    taskDecription.value = ''
    toggleModal();
    loadTasks();
}

const handleTasksChecked = () => {
    if (tasks.some(task => task.checked)) {
        tasks.forEach(task => {
            task.checked = false
        })
        localStorage.setItem('tasks', JSON.stringify(tasks))
        loadTasks()
    } else if (tasks.every(task => !task.checked)) {
        // Si no hay tareas seleccionadas Seleccionalas todas.
        tasks.forEach(task => {
            task.checked = true
        })

        localStorage.setItem('tasks', JSON.stringify(tasks))
        loadTasks()
    }
}


const toggleModal = () => {
    createTaskModal.classList.toggle('hidden')
    overlay.classList.toggle('hidden')

    if (!createTaskModal.classList.contains('hidden')) {
        taskTitle.value = ''
        taskTitle.focus()
        taskDecription.value = ''
    }
}

const toggleUpdateModal = () => {
    updateTaskModal.classList.toggle('hidden')
    overlay.classList.toggle('hidden')
}

const toggleShowOptions = () => {
    optionsContainer.classList.toggle('hidden')
}

const completeMarkedTasks = () => {
    if (!tasks.some(task => task.checked)) {
        alert('No tasks selected')
        toggleShowOptions()

        return;
    }

    tasks.forEach(task => {
        if (task.checked) {
            task.completed = true
            task.checked = false
        }
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))
    loadTasks()
    toggleShowOptions()
}

const uncompeteMarkedTasks = () => {
    if (!tasks.some(task => task.checked)) {
        alert('No tasks selected')
        toggleShowOptions()

        return;
    }

    tasks.forEach(task => {
        if (task.checked) {
            task.completed = false
            task.checked = false
        }
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))
    loadTasks()
    toggleShowOptions()
}

const deleteMarkedTasks = () => {

    if (!tasks.some(task => task.checked)) {
        alert('No tasks selected')
        toggleShowOptions()

        return;
    }


    const unMarkedTasks = tasks.filter(task => !task.checked)
    tasks = unMarkedTasks
    localStorage.setItem('tasks', JSON.stringify(tasks))
    toggleShowOptions()
    loadTasks()
}

openModalBtn.addEventListener('click', toggleModal)
closeModalBtn.addEventListener('click', toggleModal)
addTaskBtn.addEventListener('click', addTask)
searchInput.addEventListener('input', searchTask)
cancelTaskBtn.addEventListener('click', toggleModal)
checkBtn.addEventListener('click', handleTasksChecked)
optionBtn.addEventListener('click', toggleShowOptions)
doneOptBtn.addEventListener('click', completeMarkedTasks)
undoneOptBtn.addEventListener('click', uncompeteMarkedTasks)
deleteOptBtn.addEventListener('click', deleteMarkedTasks)
closeUpdateModalBtn.addEventListener('click', toggleUpdateModal)

loadTasks()