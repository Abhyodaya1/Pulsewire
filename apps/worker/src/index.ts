import {PROTOCOL_VERSION} from "@rn-studio/protocol";

console.log(`[Worker] Starting worker process...`);
console.log(`[Worker] Worker protocol version: ${PROTOCOL_VERSION}`);

const heartbeat = setInterval(() => {   
}, 1000);

process.on('SIGTERM' , () => {
    console.log(`[Worker] Received SIGTERM signal. Shutting down worker process...`);
    clearInterval(heartbeat);
    process.exit(0);
})