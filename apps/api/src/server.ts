import { app } from './app.js';
import 'dotenv/config';

// Read in the port
const PORT = Number(process.env.PORT ?? 3000);

/**
 * Main entry point of the servers. Listens on the specified port, or defaults to port 3000
 */
async function main() {
    //TODO(#2): Add db connection logic
    app.listen(PORT, () => {
        console.log(`Connected to server on port: ${PORT}`);
    });
}

// Call the main function
main().catch((err) => {
    console.error("Error starting server: ", err);
    process.exit(1);
});
