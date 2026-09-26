const SUPABASE_URL = 'https://woasumnhugbwmjyfajcm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GIXQZaicGMEdXiPM2WL39g_XI_ymZn5';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const authContainer = document.getElementById('auth-container');
const trackerContainer = document.getElementById('tracker-container');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');

// --- AUTHENTICATION LISTENERS & STATE ---

// Sign Up
signupBtn.addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signUp({
    email: authEmail.value,
    password: authPassword.value,
  });
  if (error) alert(error.message);
  else alert('Account created! You can now log in.');
});

// Log In
loginBtn.addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: authEmail.value,
    password: authPassword.value,
  });
  if (error) alert(error.message);
});

// Log Out
logoutBtn.addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
});

// Monitor Auth Session
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    authContainer.style.display = 'none';
    trackerContainer.style.display = 'block';
    fetchHabits();
  } else {
    authContainer.style.display = 'block';
    trackerContainer.style.display = 'none';
    habitList.innerHTML = '';
  }
});

// --- HABIT DATA OPERATIONS ---

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
  fetchHabits();
}

async function toggleHabit(id, currentStatus) {
  const { error } = await supabaseClient
    .from('habits')
    .update({ completed: !currentStatus })
    .eq('id', id);

  if (error) {
    console.error('Error updating habit:', error);
    return;
  }

  fetchHabits();
}

addBtn.addEventListener('click', addHabit);
habitInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addHabit();
});