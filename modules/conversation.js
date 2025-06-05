const { askQuestion, getMenu } = require('./cli');
const { SearchInfoLocationByCity, SearchTemperature } = require('./apiService');

// --- Estados da Conversa ---
const CONVERSATION_STATES = {
    INITIAL: 'INITIAL',
    LOCATION_TEMPERATURE: 'LOCATION_TEMPERATURE',
    FINAL: 'FINAL'
};


const conversationSession = {
    state: CONVERSATION_STATES.INITIAL
};

function getConversationState() {
    return conversationSession.state;
}


function changeState(newState) {
    conversationSession.state = newState;
}

async function processConversationInput(input) {    
    let shouldContinue = true;

    switch (getConversationState()) {
        case CONVERSATION_STATES.INITIAL:
            const menuOptions = ["Consultar clima", "Sair"];
           
            const choice = await getMenu(menuOptions);

            if (choice === 1) { 
                console.log("Bot: Qual cidade você gostaria de saber o clima?");
                changeState(CONVERSATION_STATES.LOCATION_TEMPERATURE);
            } else if (choice === 2) { 
                console.log("Bot: Saindo, tenha um ótimo dia!");
                changeState(CONVERSATION_STATES.FINAL);
                shouldContinue = false;
            }
            break;

        case CONVERSATION_STATES.LOCATION_TEMPERATURE:
            if (input.length > 0) {

                const location = input;
                console.log(`Bot: Buscando informações sobre a temperatura em ${location}...`);

                const responseLocation = await SearchInfoLocationByCity(location);

                if (responseLocation && responseLocation.length > 0) {
                   
                    const weatherData = await SearchTemperature(parseFloat(responseLocation[0]?.lat), parseFloat(responseLocation[0]?.lon));

                    if (weatherData && weatherData.current) {                                        
                        console.log(`  A Temperatura em ${location} é: ${weatherData.current.temperature_2m}${weatherData.current_units.temperature_2m}`);
                    } else {
                        console.log(`Bot: Não consegui obter os dados para "${location}".`);
                    }
                } else {
                    console.log(`Bot: Não consegui encontrar a localização para "${location}". Por favor, verifique o nome da cidade.`);
                }
                changeState(CONVERSATION_STATES.INITIAL); 
            } else {
                console.log("Bot: Por favor, digite o nome da cidade.");
            }
            break;

        case CONVERSATION_STATES.FINAL:
            console.log("Bot: Conversa finalizada. Para começar de novo, você pode reiniciar o script.");
            shouldContinue = false;
            break;

        default:
            console.log("Bot: Desculpe, algo deu errado. Por favor, reinicie a conversa.");
            changeState(CONVERSATION_STATES.INITIAL);
            break;
    }

    return shouldContinue;
}

async function startConversation() {
    
    await processConversationInput('');
    
    while (getConversationState() !== CONVERSATION_STATES.FINAL) {
        if (getConversationState() === CONVERSATION_STATES.LOCATION_TEMPERATURE) {
            const userInput = await askQuestion("Você");
            await processConversationInput(userInput);
        } else if (getConversationState() === CONVERSATION_STATES.INITIAL) {
            await processConversationInput('');
        }
    }
}

module.exports = {
    startConversation,
    getConversationState,
    CONVERSATION_STATES
};