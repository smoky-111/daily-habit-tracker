// 1. Select DOM Elements
const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');

// 2. Retrieve saved habits from Local Storage (or start with an empty array)
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// 3. Render habits dynamically to the page
function renderHabits() {
  habitList.innerHTML = ''; // Clear existing DOM items before re-rendering

  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.className = `habit-item ${habit.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <span class="habit-name">${habit.text}</span>
      <button class="check-btn" onclick="toggleHabit(${index})">
        ${habit.completed ? 'Completed ✓' : 'Done'}
      </button>
    `;

    habitList.appendChild(li);
  });

  // Save the current state of habits into the browser's storage
  localStorage.setItem('habits', JSON.stringify(habits));
}

// 4. Function to add a new habit
function addHabit() {
  const text = habitInput.value.trim();
  if (text === '') return; // Don't add empty items

  habits.push({ text: text, completed: false });
  habitInput.value = ''; // Clear input field
  renderHabits();
}

// 5. Function to toggle habit completion status
function toggleHabit(index) {
  habits[index].completed = !habits[index].completed;
  renderHabits();
}

// 6. Event Listeners
addBtn.addEventListener('click', addHabit);

// Allow pressing 'Enter' key to add a habit
habitInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addHabit();
  }
});

// Initial render when the page loads
renderHabits();