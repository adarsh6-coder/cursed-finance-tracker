document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleLogin(e);
            return false;
        });
    }

    // Forgot Password Modal
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModal = document.querySelector('.close-modal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'flex';
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playCardFlip();
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playClick();
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    // OAuth Buttons - Login page
    const googleLogin = document.getElementById('googleLogin');
    const githubLogin = document.getElementById('githubLogin');
    
    // OAuth Buttons - Register page
    const googleRegister = document.getElementById('googleRegister');
    const githubRegister = document.getElementById('githubRegister');

    if (googleLogin) {
        googleLogin.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playPowerUp();
            }
            showMessage('🚧 Google OAuth integration coming soon! This will allow you to login with your Google account.', 'success');
            // TODO: Implement Google OAuth
            // window.location.href = '/api/auth/google/';
        });
    }

    if (githubLogin) {
        githubLogin.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playPowerUp();
            }
            showMessage('🚧 GitHub OAuth integration coming soon! This will allow you to login with your GitHub account.', 'success');
            // TODO: Implement GitHub OAuth
            // window.location.href = '/api/auth/github/';
        });
    }

    if (googleRegister) {
        googleRegister.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playPowerUp();
            }
            showMessage('🚧 Google OAuth integration coming soon! This will allow you to register with your Google account.', 'success');
        });
    }

    if (githubRegister) {
        githubRegister.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playPowerUp();
            }
            showMessage('🚧 GitHub OAuth integration coming soon! This will allow you to register with your GitHub account.', 'success');
        });
    }
});

async function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.textContent = '⏳ Channeling Cursed Energy...';
    
    // Play loading sound
    if (window.JJK && window.JJK.soundManager) {
        window.JJK.soundManager.playCursedCharge();
    }

    if (password !== confirmPassword) {
        showMessage('❌ Cursed Energy Mismatch! Passwords do not match.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Awaken Cursed Energy 💫';
        shakeForm();
        return;
    }

    if (password.length < 6) {
        showMessage('⚠️ Weak Cursed Energy! Password must be at least 6 characters.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Awaken Cursed Energy 💫';
        shakeForm();
        return;
    }

    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('✅ Domain Expanded! Registration successful! Redirecting...', 'success');
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playSuccess();
            }
            successAnimation();
            setTimeout(() => {
                window.location.href = '/static/login.html';
            }, 2000);
        } else {
            showMessage('❌ ' + (data.message || 'Cursed Spirit Detected! Registration failed.'), 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Awaken Cursed Energy 💫';
            shakeForm();
        }
    } catch (error) {
        showMessage('💀 Cursed Spirit Attack! Network error. Please try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Awaken Cursed Energy 💫';
        shakeForm();
    }
}

async function handleLogin(e) {
    console.log('handleLogin called'); // Debug
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Validation
    if (!email || !password) {
        showMessage('⚠️ Please enter both email and password', 'error');
        shakeForm();
        return false; // Prevent form submission
    }

    // Prevent multiple submissions
    if (submitButton.disabled) {
        return false;
    }

    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.textContent = '⏳ Expanding Domain...';
    
    // Play loading sound
    if (window.JJK && window.JJK.soundManager) {
        window.JJK.soundManager.playCursedCharge();
    }

    try {
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Login response:', data); // Debug log

        if (data.success === true) {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userName', data.userName);
            showMessage('✅ Domain Entered! Welcome, Sorcerer! Redirecting...', 'success');
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playDomainExpansion();
            }
            successAnimation();
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = '/static/dashboard.html';
            }, 1500);
        } else {
            // More specific error messages
            let errorMessage = '❌ Access Denied! ';
            if (data.message) {
                if (data.message.toLowerCase().includes('not found') || data.message.toLowerCase().includes('does not exist')) {
                    errorMessage += '🔍 Account not found. Please register first.';
                } else if (data.message.toLowerCase().includes('invalid')) {
                    errorMessage += '🔐 Invalid email or password. Please try again.';
                } else {
                    errorMessage += data.message;
                }
            } else {
                errorMessage += 'Invalid credentials. Please check your email and password.';
            }
            
            showMessage(errorMessage, 'error');
            
            // Re-enable button after showing error
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Enter Domain 🌀';
            }, 500);
            
            shakeForm();
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('💀 Cursed Spirit Attack! Unable to connect to server. Please try again later.', 'error');
        
        // Re-enable button after error
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Enter Domain 🌀';
        }, 500);
        
        shakeForm();
    }
    
    return false; // Prevent default form submission
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    
    // Play sound based on type
    if (window.JJK && window.JJK.soundManager) {
        if (type === 'success') {
            window.JJK.soundManager.playSuccess();
        } else if (type === 'error') {
            window.JJK.soundManager.playError();
        }
    }
    
    // Animate message in
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.4s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto-hide after 5 seconds for errors
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 400);
        }, 5000);
    }
}

// Shake animation for errors
function shakeForm() {
    const authBox = document.querySelector('.auth-box');
    if (authBox) {
        authBox.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            authBox.style.animation = '';
        }, 500);
    }
}

// Success animation
function successAnimation() {
    const authBox = document.querySelector('.auth-box');
    if (authBox) {
        authBox.style.transition = 'all 0.5s ease';
        authBox.style.transform = 'scale(1.05)';
        authBox.style.filter = 'brightness(1.2)';
        authBox.style.boxShadow = '0 0 50px rgba(168, 85, 247, 0.8)';
        
        setTimeout(() => {
            authBox.style.transform = 'scale(1)';
            authBox.style.filter = 'brightness(1)';
        }, 500);
    }
}

// Handle Forgot Password
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('resetMessage');

    submitButton.disabled = true;
    submitButton.textContent = '⏳ Sending...';

    if (window.JJK && window.JJK.soundManager) {
        window.JJK.soundManager.playCursedCharge();
    }

    try {
        // TODO: Implement actual password reset API
        // For now, simulate the request
        await new Promise(resolve => setTimeout(resolve, 1500));

        messageDiv.textContent = '✅ Password reset link sent! Check your email.';
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';

        if (window.JJK && window.JJK.soundManager) {
            window.JJK.soundManager.playSuccess();
        }

        setTimeout(() => {
            document.getElementById('forgotPasswordModal').style.display = 'none';
            messageDiv.style.display = 'none';
            document.getElementById('resetEmail').value = '';
            submitButton.disabled = false;
            submitButton.textContent = 'Send Reset Link ✨';
        }, 3000);

        /*
        // Uncomment when backend is ready:
        const response = await fetch('/api/forgot-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = '✅ Password reset link sent! Check your email.';
            messageDiv.className = 'message success';
            messageDiv.style.display = 'block';
            
            if (window.JJK && window.JJK.soundManager) {
                window.JJK.soundManager.playSuccess();
            }
        } else {
            throw new Error(data.message || 'Failed to send reset link');
        }
        */

    } catch (error) {
        messageDiv.textContent = '❌ Failed to send reset link. Please try again.';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
        
        if (window.JJK && window.JJK.soundManager) {
            window.JJK.soundManager.playError();
        }

        submitButton.disabled = false;
        submitButton.textContent = 'Send Reset Link ✨';
    }
}
