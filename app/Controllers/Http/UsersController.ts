import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ response, auth }: HttpContextContract) {
    const currentUser = auth.user?.id
    try {
      const users = await User.all()
      if (users.length !== 0) {
        const filteredUsers = users.filter((user) => user.id !== currentUser)
        return response.status(200).send({ success: true, data: filteredUsers })
      } else {
        return response.status(400).send({ success: false, errors: ['No users found'] })
      }
    } catch (error) {
      return response.status(400).send({ success: false, errors: [error.message] })
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const userId = +request.param('id')
      const user = await User.findOrFail(userId)
      return response.status(200).send({ success: true, data: user })
    } catch (error) {
      return response.status(400).send({ success: false, errors: ['User not found'] })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    let data
    const userId = +request.param('id')
    try {
      data = await request.validate(UpdateUserValidator)
    } catch (errors) {
      let errorMessage: string[] = []
      errors.messages.errors.forEach((element) => errorMessage.push(element.message))
      return response.status(400).send({ success: false, errors: errorMessage })
    }
    try {
      const user = await User.findOrFail(userId)
      if (user) {
        if (user.username !== data.username) {
          user.username = data.username
          await user.save()
          return response.status(200).send({ success: true, data: user })
        } else {
          return response.status(400).send({ success: false, errors: ['Nothing to update'] })
        }
      } else {
        return response.status(400).send({ success: false, errors: ['User not found'] })
      }
    } catch (error) {
      return response.status(400).send({ success: false, errors: [error.message] })
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const userId = +request.param('id')
      const user = await User.findOrFail(userId)
      await user.delete()
      return response.status(200).send({ success: true })
    } catch (error) {
      return response.status(400).send({ success: false, errors: [error.message] })
    }
  }
}
