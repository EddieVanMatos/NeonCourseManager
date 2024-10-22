const apiUrl = 'http://localhost:8080/api/courses';

// Função para buscar e exibir todos os cursos
async function getCourses() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar cursos');
        }
        const courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para exibir cursos na lista
function displayCourses(courses) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = ''; // Limpa a lista de cursos

    if (courses.length === 0) {
        courseList.innerHTML = '<li>No courses available</li>';
        return;
    }

    courses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = `${course.id}: ${course.nome} - ${course.descricao}`;

        // Botão para deletar o curso
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('neon-btn');
        deleteBtn.onclick = () => deleteCourse(course.id);
        li.appendChild(deleteBtn);

        courseList.appendChild(li);
    });
}

// Função para buscar curso por ID ou nome
async function searchCourse(query) {
    if (!query) {
        getCourses();
        return;
    }

    try {
        let response = await fetch(`${apiUrl}/${query}`);
        if (response.status === 404) {
            response = await fetch(apiUrl);
            const courses = await response.json();
            const filteredCourses = courses.filter(course =>
                course.nome.toLowerCase().includes(query.toLowerCase())
            );
            displayCourses(filteredCourses);
        } else {
            const course = await response.json();
            displayCourses([course]);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para adicionar um novo curso
async function addCourse(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    const newCourse = {
        nome: name,
        descricao: description
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCourse)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar curso');
        }

        getCourses(); // Atualiza a lista de cursos
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para deletar curso pelo ID
async function deleteCourse(courseId) {
    if (!confirm(`Tem certeza que deseja deletar o curso com ID ${courseId}?`)) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${courseId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar curso');
        }

        alert(`Curso com ID ${courseId} deletado com sucesso!`);
        getCourses(); // Atualiza a lista de cursos
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar curso. Verifique se o ID é válido.');
    }
}

// Event listeners
document.getElementById('course-form').addEventListener('submit', addCourse);
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    searchCourse(query);
});
document.getElementById('delete-btn').addEventListener('click', () => {
    const courseId = document.getElementById('delete-id').value;
    deleteCourse(courseId);
});

// Carrega os cursos ao iniciar
getCourses();
