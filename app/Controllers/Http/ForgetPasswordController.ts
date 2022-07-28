import User from 'App/Models/User'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForgetPasswordValidator from 'App/Validators/ForgetPasswordValidator'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'

export default class ForgetPasswordsController {
  public async forget_password({ request, response }: HttpContextContract) {
    let data
    let token
    try {
      data = await request.validate(ForgetPasswordValidator)
    } catch (errors) {
      return response.status(400).send({ success: false, errors: [errors.messages.errors] })
    }
    try {
      const user = await User.findByOrFail('email', data.email)
      if (user) {
        token = jwt.sign({ user: user.id }, Env.get('RESET_PASSWORD_KEY'), {
          expiresIn: '15m',
        })
        await user.merge({ forget_password_token: token }).save()
        try {
          await Mail.send((message) => {
            message
              .from('no-reply@procrew.com')
              .to(user.email)
              .subject('Password reset link')
              .html(
                `<h3>please, click the link below to reset your password:</h3></b>
              <a href="https://localhost:3000/reset_password/${token}">
              https://localhost:3000/reset_password/${token}</a>`
              )
          })
          return response.status(200).send({ success: true })
        } catch (error) {
          return response.status(400).send({ success: false, errors: [error.message] })
        }
      }
    } catch (error) {
      return response.status(400).send({ success: false, errors: [error.message] })
    }
  }

  public async reset_password({ request, response }: HttpContextContract) {
    let data
    try {
      data = await request.validate(ResetPasswordValidator)
    } catch (errors) {
      return response.status(400).send({ success: false, errors: [errors.messages.errors] })
    }
    const token = data.token
    const password = data.password
    try {
      jwt.verify(token, Env.get('RESET_PASSWORD_KEY'))
    } catch (error) {
      return response.status(400).send({ success: false, errors: [error.message] })
    }
    try {
      const user = await User.findByOrFail('forget_password_token', token)
      user.password = password
      await user.save()
      return response.status(200).send({ success: true })
    } catch (error) {
      return response.status(400).send({ success: false, errors: [error.message] })
    }
  }
}
