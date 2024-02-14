import handleChatGPTMessage from './ai-generation/chatGPTMessage.js';
import handleChangePersonality from './personalities/changePersonality.js'
import handlePersonalitiesList from './personalities/personalitiesList.js'
import handleSettings from './settings.js'
import handleHelp from './help.js'
import handleGenerateImage from './ai-generation/generateImage.js'
import handleRegenerateLastBotAnswer from './ai-generation/regenerateLastBotAnswer.js'
import handleClearMessageHistory from './clearMessageHistory.js'
import handleTranscribeVoiceMessage from './ai-generation/transcribeVoiceMessage.js'
import changeAIModel from './ai-models/changeAIModel.js'
import aiModelsList from './ai-models/aiModelsList.js'

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
	changeAIModel,
	aiModelsList
}
