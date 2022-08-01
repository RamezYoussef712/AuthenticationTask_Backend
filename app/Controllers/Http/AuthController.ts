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
      let errorMessage: string[] = []
      errors.messages.errors.forEach((element) => errorMessage.push(element.message))
      return response.status(400).send({ success: false, errors: errorMessage })
    }
    try {
      const user = await User.create({ ...data })
      if (user.$isPersisted) {
        const token = await auth.use('api').attempt(data.email, data.password, {
          expiresIn: '1 hour',
        })
        const authToken = token.toJSON()
        return response
          .status(200)
          .send({ success: true, data: { user: user, access_token: authToken.token } })
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
      let errorMessage: string[] = []
      errors.messages.errors.forEach((element) => errorMessage.push(element.message))
      return response.status(400).send({ success: false, errors: errorMessage })
    }
    try {
      const token = await auth.use('api').attempt(data.email, data.password, {
        expiresIn: '1 hour',
      })
      const user = await User.findByOrFail('email', data.email)
      const authToken = token.toJSON()
      return response
        .status(200)
        .send({ success: true, data: { user: user, access_token: authToken.token } })
    } catch {
      return response
        .status(400)
        .send({ success: false, errors: ['User with provided credentials could not be found'] })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.status(203).send({ success: true })
  }
}
