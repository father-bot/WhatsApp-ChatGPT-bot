import handleChatGPTMessage from './chatGPTMessage.js';
import handleChangePersonality from './changePersonality.js'
import handlePersonalitiesList from './personalitiesList.js'
import handleSettings from './settings.js'
import handleHelp from './help.js'
import handleGenerateImage from './generateImage.js'
import handleRegenerateLastBotAnswer from './regenerateLastBotAnswer.js'
import handleClearMessageHistory from './clearMessageHistory.js'
import handleTranscribeVoiceMessage from './transcribeVoiceMessage.js'
import aiModelsList from './aiModelsList.js'

export default {
	handleChatGPTMessage,
	handleChangePersonality,
	handlePersonalitiesList,
	handleSettings,
	handleHelp,
	handleGenerateImage,
	handleRegenerateLastBotAnswer,
	handleClearMessageHistory,
	handleTranscribeVoiceMessage,
	aiModelsList
}
