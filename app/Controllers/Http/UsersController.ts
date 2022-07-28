import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all()
      if (users.length !== 0) {
        return response.status(200).send({ success: true, data: users })
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
      return response.status(400).send({ success: false, errors: [errors.messages.errors] })
    }
    try {
      const user = await User.findOrFail(userId)
      if (user) {
        if (user.username !== data.username) {
          user.username = data.username
        }
        if (user.email !== data.email) {
          user.email = data.email
        }
        await user.save()
        return response.status(200).send({ success: true, data: user })
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
