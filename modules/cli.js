const readline = require('readline');

let rl = null; 

function getReadlineInterface() {
    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.on('close', () => {
            process.exit(0);
        });
    }
    return rl;
}

function askQuestion(question) {
    const currentRl = getReadlineInterface();
    return new Promise(resolve => {
        currentRl.question(` ${question ? `${question}: ` : 'Bot:'} `, resolve);
    });
}

async function getMenu(menuOptions) {
    console.log(`\nBot: ${"Escolha uma opção:"}`);
    menuOptions.forEach((option, index) => {
        console.log(`  ${index + 1}. ${option}`);
    });

    let choice = '';
    let isValidChoice = false;

    while (!isValidChoice) {
        choice = await askQuestion("Sua escolha");
        const choiceNum = parseInt(choice);

        if (!isNaN(choiceNum) && choiceNum >= 1 && choiceNum <= menuOptions.length) {
            isValidChoice = true;
        } else {
            console.log("Bot: Opção inválida. Por favor, digite o número correspondente à sua escolha.");
        }
    }
    return parseInt(choice);
}

function closeCLI() {
    if (rl) {
        rl.close();
        rl = null; // Limpa a referência
    }
}

module.exports = {
    askQuestion,
    getMenu,
    closeCLI
};