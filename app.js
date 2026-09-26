// 1. Initialize Supabase Client
const SUPABASE_URL = 'https://woasumnhugbwmjyfajcm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GIXQZaicGMEdXiPM2WL39g_XI_ymZn5';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Select DOM Elements
const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');

// 3. Fetch habits from Supabase Database
async function fetchHabits() {
  const { data: habits, error } = await supabaseClient
    .from('habits')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching habits:', error);
    return;
  }

  renderHabits(habits);
}

// 4. Render habits to DOM
function renderHabits(habits) {
  habitList.innerHTML = '';

  habits.forEach((habit) => {
    const li = document.createElement('li');
    li.className = `habit-item ${habit.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <span class="habit-name">${habit.title}</span>
      <button class="check-btn" onclick="toggleHabit(${habit.id}, ${habit.completed})">
        ${habit.completed ? 'Completed ✓' : 'Done'}
      </button>
    `;

    habitList.appendChild(li);
  });
}

// 5. Add a habit to Supabase
async function addHabit() {
  const title = habitInput.value.trim();
  if (title === '') return;

  const { error } = await supabaseClient
    .from('habits')
    .insert([{ title: title, completed: false }]);

  if (error) {
    console.error('Error adding habit:', error);
    return;
  }

  habitInput.value = '';
  fetchHabits(); // Refresh list from database
}

// 6. Toggle habit completion state in Supabase
async function toggleHabit(id, currentStatus) {
  const { error } = await supabaseClient
    .from('habits')
    .update({ completed: !currentStatus })
    .eq('id', id);

  if (error) {
    console.error('Error updating habit:', error);
    return;
  }

  fetchHabits(); // Refresh list from database
}

// 7. Event Listeners
addBtn.addEventListener('click', addHabit);

habitInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addHabit();
  }
});

// Initial fetch on page load
fetchHabits();