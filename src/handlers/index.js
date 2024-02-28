import handleChatGPTMessage from './ai-generation/chatGPTMessage.js';
import handleClearMessageHistory from './clearMessageHistory.js'
import handleHelp from './help.js'
import handleRegenerateLastBotAnswer from './ai-generation/regenerateLastBotAnswer.js'
import handlePersonalitiesList from './personalities/personalitiesList.js'
import handleChangePersonality from './personalities/changePersonality.js'

export default {
	handleChatGPTMessage,
	handleClearMessageHistory,
	handleHelp,
	handleRegenerateLastBotAnswer,
	handlePersonalitiesList,
	handleChangePersonality
}
