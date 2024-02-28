import handleChatGPTMessage from './ai-generation/chatGPTMessage.js';
import handleClearMessageHistory from './clearMessageHistory.js'
import handleHelp from './help.js'
import handleRegenerateLastBotAnswer from './ai-generation/regenerateLastBotAnswer.js'
import handlePersonalitiesList from './personalities/personalitiesList.js'

export default {
	handleChatGPTMessage,
	handleClearMessageHistory,
	handleHelp,
	handleRegenerateLastBotAnswer,
	handlePersonalitiesList
}
