// =================================================================
// SECTION 1: FIREBASE CONFIGURATION & INITIALIZATION
// =================================================================
// This connects your website to your Firebase project.
// PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE:
const firebaseConfig = {
  apiKey: "AIzaSyDeaWu8F16uQkoRrAqK0VLpr7-CBmBFsEU",
  authDomain: "vowweddingwebsite.firebaseapp.com",
  projectId: "vowweddingwebsite",
  storageBucket: "vowweddingwebsite.firebasestorage.app",
  messagingSenderId: "662249052175",
  appId: "1:662249052175:web:3e33af79c7f175c6732b7a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// =================================================================
// SECTION 2: UI ELEMENTS & MODAL HANDLING
// =================================================================
let loginModal, signupModal;
let loginLink, signupLink, profileLink, logoutLink, userAvatar;

function initializeUIElements() {
  const loginModalEl = document.getElementById('loginModal');
  if (loginModalEl) {
    loginModal = new bootstrap.Modal(loginModalEl);
  }

  const signupModalEl = document.getElementById('signupModal');
  if (signupModalEl) {
    signupModal = new bootstrap.Modal(signupModalEl);
  }

  loginLink = document.getElementById('loginLink');
  signupLink = document.getElementById('signupLink');
  profileLink = document.getElementById('profileLink');
  logoutLink = document.getElementById('logoutLink');
  userAvatar = document.getElementById('userAvatar');
}

// =================================================================
// SECTION 3: AUTHENTICATION STATE LISTENER (THE BRAIN)
// =================================================================
auth.onAuthStateChanged((user) => {
  initializeUIElements();

  if (user) {
    // --- USER IS LOGGED IN ---
    console.log("User is logged in:", user);
    const userInitial = (user.displayName || user.email).charAt(0).toUpperCase();
    if (userAvatar) {
      userAvatar.innerHTML = `<strong>${userInitial}</strong>`;
    }
    if (loginLink) loginLink.style.display = 'none';
    if (signupLink) signupLink.style.display = 'none';
    if (profileLink) profileLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'block';
  } else {
    // --- USER IS LOGGED OUT ---
    console.log("User is logged out.");
    if (userAvatar) {
      userAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    if (loginLink) loginLink.style.display = 'block';
    if (signupLink) signupLink.style.display = 'block';
    if (profileLink) profileLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
});

// =================================================================
// SECTION 4: AUTHENTICATION FUNCTIONS
// =================================================================
function signUpWithEmail(name, email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.updateProfile({
        displayName: name
      });
    })
    .then(() => {
      console.log("User signed up and profile updated successfully!");
      if (signupModal) signupModal.hide();
    })
    .catch((error) => {
      alert(`Signup failed: ${error.message}`);
      console.error("Signup Error:", error);
    });
}

function signInWithEmail(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed in successfully!", userCredential.user);
      if (loginModal) loginModal.hide();
    })
    .catch((error) => {
      alert(`Login failed: ${error.message}`);
      console.error("Login Error:", error);
    });
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("Google sign-in successful!", result.user);
      if (loginModal) loginModal.hide(); // Close the modal on success
    })
    .catch((error) => {
      alert(`Google sign-in failed: ${error.message}`);
      console.error("Google Sign-in Error:", error);
    });
}

function signOutUser() {
  auth.signOut()
    .then(() => {
      console.log("User signed out successfully.");
    })
    .catch((error) => {
      console.error("Signout Error:", error);
    });
}

// =================================================================
// SECTION 5: EVENT LISTENERS
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
  initializeUIElements();

  // --- Form Submissions ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      signInWithEmail(email, password);
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      signUpWithEmail(name, email, password);
    });
  }

  // --- Navbar Link Clicks ---
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.show();
    });
  }

  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (signupModal) signupModal.show();
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      signOutUser();
    });
  }

  // --- Modal Switching Links ---
  const switchToSignup = document.getElementById('switchToSignup');
  if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.hide();
      if (signupModal) signupModal.show();
    });
  }

  const switchToLogin = document.getElementById('switchToLogin');
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (signupModal) signupModal.hide();
      if (loginModal) loginModal.show();
    });
  }

  // ========================================================
  // === NEW: ADDED GOOGLE SIGN-IN BUTTON FUNCTIONALITY ===
  // ========================================================
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithGoogle();
    });
  }

  // --- Dropdown Menu Logic ---
  const userAvatarButton = document.getElementById('userAvatar');
  const userDropdownMenu = document.getElementById('userDropdown');

  if (userAvatarButton && userDropdownMenu) {
    userAvatarButton.addEventListener('click', function(event) {
      event.stopPropagation();
      userDropdownMenu.classList.toggle('show');
    });
  }

  document.addEventListener('click', function(event) {
    if (userDropdownMenu && userDropdownMenu.classList.contains('show')) {
      const userMenu = document.querySelector('.user-menu');
      if (!userMenu.contains(event.target)) {
        userDropdownMenu.classList.remove('show');
      }
    }
  });
});
