import Listener from '../models/listenerSchema'
import Member from '../models/memberSchema'
import User from '../models/userSchema'
import { UserService } from '../services/user.service'

const getUserById = async (req, res) => {
  const userid = await req.params['userid']

  try {
    let UserInfor = await User.findOne({ _id: userid })

    if (UserInfor.active_role == 'member') {
      const memberInfo = await Member.findOne({
        user_id: UserInfor._id
      })

      UserInfor.categories = memberInfo?.categories || []
    }

    if (UserInfor.active_role == 'listener') {
      const listenerInfo = Listener.findOne({
        user_id: UserInfor._id
      })
      UserInfor.categories = listenerInfo.categories
    }

    res.status(200).json(UserInfor)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
}

const getUserByUId = async (req, res) => {
  const userid = await req.params['userid']
  try {
    let UserInfor = await User.findOne({ uid: userid })

    if (UserInfor.active_role == 'member') {
      const memberInfo = await Member.findOne({
        user_id: UserInfor._id
      })

      UserInfor.categories = memberInfo?.categories || []
    }

    if (UserInfor.active_role == 'listener') {
      const listenerInfo = Listener.findOne({
        user_id: UserInfor._id
      })
      UserInfor.categories = listenerInfo.categories
    }

    res.status(200).json(UserInfor)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
}

const getUserByRole = async (req, res) => {
  const role = await req.params['role']
  try {
    let UserInfor = await User.find({ active_role: role })

    res.status(200).json(UserInfor)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
}

const getUserByName = async (req, res) => {
  const searchName = await req.params['name']
  try {
    let UserInfor = await User.find({ nickname: { $regex: searchName } })

    res.status(200).json(UserInfor)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
}

const findAll = async (req, res) => {
  try {
    const users = await UserService.findAll()

    res.status(200).json({
      users: users
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message
    })
  }
}

const addNewUser = async (req, res) => {
  const user = await { ...req.body }

  UserController.add(user)
  // const userSave = new User(user)

  // console.log(user)

  // const curentUser = await User.findOne({ uid: user.uid })
  try {
    //   if (!curentUser) {
    //     if (user.active_role == 'listener') {
    //       const categories = user.categories
    //       const memberSave = new Listener({
    //         user_id: userSave._id,
    //         categories: categories
    //       })
    //       userSave.active_role_id = memberSave._id
    //       console.log(userSave)
    //       await memberSave.save()
    //     }
    //     if (user.active_role == 'member') {
    //       const categories = user.categories
    //       const memberSave = new Member({
    //         user_id: userSave._id,
    //         categories: categories
    //       })
    //       userSave.active_role_id = memberSave._id
    //       console.log(userSave)
    //       await memberSave.save()
    //     }
    //     await userSave.save()
    //     res.status(200).send(userSave)
    //   }
    // res.status(200).send(curentUser)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
}

export const UserController = {
  getUserByUId,
  addNewUser,
  findAll,
  getUserByRole,
  getUserByName,
  getUserById
}