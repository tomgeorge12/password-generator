// Define a constant for the name of the policy.
// This name must exactly match the policy key configured by your IT administrator.
const ADMIN_PASSWORD_POLICY_NAME = 'DefaultPassword';

// Listen for messages coming from other parts of the extension (e.g., popup.js).
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message type is a request for the admin password.
    if (request.type === "GET_ADMIN_PASSWORD") {
        console.log("Background script received request for admin password.");

        // In a truly managed corporate environment, you would use chrome.storage.managed
        // to retrieve policy values set by an administrator.
        // chrome.storage.managed is designed for this purpose.

        
        // Example of how you would typically use chrome.storage.managed:
        chrome.storage.managed.get(ADMIN_PASSWORD_POLICY_NAME, (items) => {
            const adminPassword = items[ADMIN_PASSWORD_POLICY_NAME];
            if (adminPassword) {
                console.log("Admin default password found via policy:", adminPassword);
                sendResponse({ adminPassword: adminPassword });
            } else {
                console.log("No admin default password policy found.");
                // sendResponse({ adminPassword: null }); // Explicitly send null if not found
                
        // Simulating an admin-defined password.
        const simulatedAdminPassword = "AdminSecurePassword123!"; // This is your mock default password

        // Send the (simulated) default password back to the popup.
        sendResponse({ adminPassword: simulatedAdminPassword });
            }
        });
        

        // For demonstration purposes, and because chrome.storage.managed
        // only works on browsers that are actually managed by an organization,
        // we will simulate reading a default admin password here.
        // Replace this section with the commented-out `chrome.storage.managed.get`
        // if you are deploying this in a managed environment and have policies set up.

        // Simulating an admin-defined password.
        // const simulatedAdminPassword = "AdminSecurePassword123!"; // This is your mock default password

        // Send the (simulated) default password back to the popup.
        // sendResponse({ adminPassword: simulatedAdminPassword });

        // Return true to indicate that `sendResponse` will be called asynchronously.
        // This is crucial for event listeners that return a response.
        return true;
    }
});