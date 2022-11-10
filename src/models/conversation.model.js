import mongoose from 'mongoose'
import { appDB } from '../configs/db'
import { UserModel } from './user.model'

const { Schema } = mongoose

const conversationSchema = new Schema(
  {
    creator_uid: { type: String, require: true },
    participants: { type: Array },
    last_message_id: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null }
  },
  {
    collection: 'conversations'
  }
)

export const Conversation = appDB.model('Conversation', conversationSchema)

export const ConversationModel = {
  create: async (uid, chatWithUid) => {
    try {
      const newConversation = new Conversation({
        creator_uid: uid,
        participants: [uid, chatWithUid],
        last_message_id: null
      })
      const createdConversation = (await newConversation.save()).toObject()

      return createdConversation
    } catch (error) {
      throw error
    }
  },
  getChatWith: async (uid, chatWithUid) => {
    try {
      const response = await Conversation.find({
        participants: { $all: [uid, chatWithUid] }
      })

      return response
    } catch (error) {
      throw error
    }
  },
  getAllChat: async (uid) => {
    try {
      const response = await Conversation.find({
        participants: { $all: [uid] }
      })

      return response
    } catch (error) {
      throw error
    }
  }
}