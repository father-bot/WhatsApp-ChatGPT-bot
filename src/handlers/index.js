import handleChatGPTMessage from './ai-generation/chatGPTMessage.js'
import handleClearMessageHistory from './clearMessageHistory.js'
import handleHelp from './help.js'
import handleRegenerateLastBotAnswer from './ai-generation/regenerateLastBotAnswer.js'
import handlePersonalitiesList from './personalities/personalitiesList.js'
import handleChangePersonality from './personalities/changePersonality.js'
import handleGenerateImage from './ai-generation/generateImage.js'
import handleAIModelsList from './ai-models/aiModelsList.js'
import handleChangeAIModel from './ai-models/changeAIModel.js'
import handleTranscribeVoiceMessage from './ai-generation/transcribeVoiceMessage.js'

export default {
	handleChatGPTMessage,
	handleClearMessageHistory,
	handleHelp,
	handleRegenerateLastBotAnswer,
	handlePersonalitiesList,
	handleChangePersonality,
	handleGenerateImage,
	handleAIModelsList,
	handleChangeAIModel,
	handleTranscribeVoiceMessage
}
