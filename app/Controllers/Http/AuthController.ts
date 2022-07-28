import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    let data
    try {
      data = await request.validate(RegisterValidator)
    } catch (errors) {
      return response.status(400).send({ success: false, errors: [errors.messages.errors] })
    }
    try {
      const user = await User.create({ ...data })
      if (user.$isPersisted) {
        const token = await auth.use('api').attempt(data.email, data.password, {
          expiresIn: '1 hour',
        })
        return response.status(200).send({ success: true, data: [user, token.toJSON()] })
      }
    } catch (error) {
      return response.status(400).send({ success: false, errors: ['Registration failed'] })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    let data
    try {
      data = await request.validate(LoginValidator)
    } catch (errors) {
      return response.status(400).send({ success: false, errors: [errors.messages.errors] })
    }
    try {
      const token = await auth.use('api').attempt(data.email, data.password, {
        expiresIn: '1 hour',
      })
      return response.status(200).send({ success: true, data: token.toJSON() })
    } catch {
      return response
        .status(400)
        .send({ error: { message: 'User with provided credentials could not be found' } })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.status(203).send({ success: true, data: [] })
  }
}
