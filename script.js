class LoginSystem {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.email = document.getElementById('email');
        this.password = document.getElementById('password');
        this.submitBtn = document.getElementById('submitBtn');
        this.togglePassword = document.getElementById('togglePassword');
        this.remember = document.getElementById('remember');
        this.toast = document.getElementById('toast');
        
        this.init();
    }
    
    init() {
        // Event Listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        this.email.addEventListener('blur', this.validateEmail.bind(this));
        this.password.addEventListener('blur', this.validatePassword.bind(this));
        
        // Real-time validation
        this.email.addEventListener('input', () => this.clearError('email'));
        this.password.addEventListener('input', () => this.clearError('password'));
        
        // Load saved email if "Remember me" was checked
        this.loadSavedEmail();
        
        // Close toast on click
        document.querySelector('.toast-close').addEventListener('click', this.hideToast.bind(this));
        
        // ADDED: Trigger label float on page load for any pre-filled inputs
        this.triggerLabelFloat();
    }
    
    // ADDED: New method to ensure labels float on page load
    triggerLabelFloat() {
        // Check if email has value and trigger label float
        if (this.email.value) {
            this.email.dispatchEvent(new Event('input'));
        }
        // Check if password has value and trigger label float
        if (this.password.value) {
            this.password.dispatchEvent(new Event('input'));
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            this.showToast('error', 'Validation Error', 'Please fix all errors before submitting');
            return;
        }
        
        // Show loading state
        this.setLoading(true);
        
        try {
            // Simulate API call
            await this.simulateLogin();
            
            // Save email if remember me is checked
            if (this.remember.checked) {
                localStorage.setItem('savedEmail', this.email.value);
            } else {
                localStorage.removeItem('savedEmail');
            }
            
            // Success
            this.showToast('success', 'Login Successful', 'Welcome back! Redirecting...');
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            this.showToast('error', 'Login Failed', error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    simulateLogin() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful login (90% success rate for demo)
                if (Math.random() < 0.9) {
                    resolve();
                } else {
                    reject(new Error('Invalid credentials. Please try again.'));
                }
            }, 1500);
        });
    }
    
    validateEmail() {
        const email = this.email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.password.value;
        
        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        } else if (password.length < 8) {
            this.showError('password', 'Password must be at least 8 characters');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    togglePasswordVisibility() {
        const type = this.password.type === 'password' ? 'text' : 'password';
        this.password.type = type;
        this.togglePassword.querySelector('i').classList.toggle('fa-eye');
        this.togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    }
    
    showError(field, message) {
        const errorElement = document.getElementById(`${field}Error`);
        const inputField = document.querySelector(`#${field}`).closest('.input-field');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        if (inputField) {
            inputField.classList.add('error');
        }
    }
    
    clearError(field) {
        const errorElement = document.getElementById(`${field}Error`);
        const inputField = document.querySelector(`#${field}`).closest('.input-field');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        if (inputField) {
            inputField.classList.remove('error');
        }
    }
    
    setLoading(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    showToast(type, title, message) {
        const icon = this.toast.querySelector('.toast-icon i');
        const titleElement = this.toast.querySelector('.toast-content h4');
        const messageElement = this.toast.querySelector('.toast-content p');
        
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
            this.toast.querySelector('.toast-icon').style.background = '#00C853';
        } else {
            icon.className = 'fas fa-exclamation-circle';
            this.toast.querySelector('.toast-icon').style.background = '#FF1744';
        }
        
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        this.toast.classList.add('show');
        
        // Auto-hide after 5 seconds
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => this.hideToast(), 5000);
    }
    
    hideToast() {
        this.toast.classList.remove('show');
    }
    
    loadSavedEmail() {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            this.email.value = savedEmail;
            this.remember.checked = true;
            // Trigger float label effect
            this.email.dispatchEvent(new Event('input'));
        }
    }
}

// Initialize the login system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});