import { createApp } from './app.js';
import { config } from './constants.js'

/**
 * Main entry point of the server. Listens on the specified port, or defaults to port 3000
 */
async function main() {
    const app = createApp();

    app.listen(config.PORT, () => {
        console.log(`Connected to server on port: ${config.PORT}`);
    });
}

// Call the main function
main().catch((err) => {
    console.error("Error starting server: ", err);
    process.exit(1);
});
