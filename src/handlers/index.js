import handleChatGPTMessage from './aiGeneration/chatGPTMessage.js';
import handleChangePersonality from './personalities/changePersonality.js'
import handlePersonalitiesList from './personalities/personalitiesList.js'
import handleSettings from './settings.js'
import handleHelp from './help.js'
import handleGenerateImage from './aiGeneration/generateImage.js'
import handleRegenerateLastBotAnswer from './aiGeneration/regenerateLastBotAnswer.js'
import handleClearMessageHistory from './clearMessageHistory.js'
import handleTranscribeVoiceMessage from './aiGeneration/transcribeVoiceMessage.js'
import changeAIModel from './aiModels/changeAIModel.js'
import aiModelsList from './aiModels/aiModelsList.js'

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
