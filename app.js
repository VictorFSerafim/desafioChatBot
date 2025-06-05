const { startConversation, getConversationState, CONVERSATION_STATES } = require('./modules/conversation');
const { closeCLI } = require('./modules/cli');

async function main() {
    console.log("\nBem-vindo ao desafio Chatbot!");
    console.log("\nO que você deseja fazer?")
    await startConversation();
   
    if (getConversationState() === CONVERSATION_STATES.FINAL) {
        closeCLI();
    }
}

main();