// Ensure the DOM is fully loaded before executing any JavaScript.
document.addEventListener('DOMContentLoaded', () => {
    // Get references to all necessary DOM elements.
    const passwordOutput = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-btn');
    const passwordLengthInput = document.getElementById('password-length');
    const includeUppercaseCheckbox = document.getElementById('include-uppercase');
    const includeNumbersCheckbox = document.getElementById('include-numbers');
    const includeSymbolsCheckbox = document.getElementById('include-symbols');
    const generateBtn = document.getElementById('generate-btn');
    const adminMessageDiv = document.getElementById('admin-message');

    // Define character sets for password generation.
    const chars = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?'
    };

    /**
     * Generates a new password based on user-selected criteria.
     */
    function generatePassword() {
        const length = parseInt(passwordLengthInput.value, 10);
        let characters = chars.lowercase; // Start with lowercase characters

        // Conditionally add other character types based on checkbox states.
        if (includeUppercaseCheckbox.checked) {
            characters += chars.uppercase;
        }
        if (includeNumbersCheckbox.checked) {
            characters += chars.numbers;
        }
        if (includeSymbolsCheckbox.checked) {
            characters += chars.symbols;
        }

        // Basic validation for password generation.
        if (length < 6 || length > 32 || characters.length === 0) {
            passwordOutput.value = 'Invalid options! Adjust length or select character types.';
            return;
        }

        let password = '';
        // Build the password character by character.
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        passwordOutput.value = password; // Display the generated password.
    }

    // Attach event listener to the "Generate Password" button.
    generateBtn.addEventListener('click', generatePassword);

    // Attach event listener to the "Copy" button.
    copyBtn.addEventListener('click', () => {
        passwordOutput.select(); // Select the text in the password output field.
        // Use document.execCommand('copy') for copying to clipboard.
        // navigator.clipboard.writeText is generally preferred but might have
        // limitations in some extension contexts or iframes.
        document.execCommand('copy');

        // Provide a visual feedback that the password has been copied.
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => {
            copyBtn.innerText = originalText;
        }, 1500); // Revert button text after 1.5 seconds.
    });

    // --- Communication with Background Script ---
    // Request the admin-defined default password from the background script.
    chrome.runtime.sendMessage({ type: "GET_ADMIN_PASSWORD" }, (response) => {
        if (chrome.runtime.lastError) {
            // Log any errors during message communication.
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            adminMessageDiv.innerText = "Could not load admin default. Check extension permissions or policy setup.";
        } else if (response && response.adminPassword) {
            // If an admin password is received, populate the input field with it.
            passwordOutput.value = response.adminPassword;
            // Display a message indicating the admin password was loaded.
            adminMessageDiv.innerText = "Default password from admin policy has been loaded.";
            adminMessageDiv.style.color = '#007bff'; // Style the message for emphasis.
            adminMessageDiv.style.fontWeight = 'bold';
        } else {
            // If no admin password is found, inform the user.
            adminMessageDiv.innerText = "No admin default password policy found.";
        }
    });

    // Initial password generation on load.
    // This ensures that even if no admin password is set, a password is
    // displayed immediately when the popup opens.
    // The admin password will override this if it's successfully loaded.
    if (!passwordOutput.value) {
        generatePassword();
    }
});