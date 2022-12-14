const { ConversationModel } = require('../models/conversation.model')
const { UserModel } = require('../models/user.model')

module.exports.ConversationService = {
  getAllConversations: async (uid) => {
    try {
      const conversations = await ConversationModel.getAllConversations(uid)
      return await Promise.all(
        conversations.map((conversation) => filterCurrentUserInParticipants(conversation, uid))
      )
    } catch (error) {
      throw error
    }
  },
  getConversationWith: async (uid, chatWithUid) => {
    try {
      let response = await ConversationModel.getConversationWith(uid, chatWithUid)
      const isExist = response.length !== 0
      if (!isExist) {
        const createdConversation = await ConversationModel.create(uid, chatWithUid)
        return await filterCurrentUserInParticipants(createdConversation, uid)
      }
      return await filterCurrentUserInParticipants(response[0], uid)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  updateLastMessage(lastMessageId) {}
}

async function filterCurrentUserInParticipants(conversations, uid) {
  const filteredConversations = conversations
  filteredConversations.participants = filteredConversations.participants.filter(
    (participant) => participant != null && participant !== uid
  )

  filteredConversations.participants = await Promise.all(
    filteredConversations.participants.map((participant) => {
      return UserModel.findOneByUid(participant)
    })
  )

  return await filteredConversations
}
