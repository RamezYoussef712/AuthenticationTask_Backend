import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class SocialAuth {
  public async redirect({ ally }: HttpContextContract) {
    return ally.use('github').redirect()
  }

  public async callback({ ally, response, auth }: HttpContextContract) {
    const github = ally.use('github')
    if (github.accessDenied()) {
      return response.status(401).send({ success: false, errors: ['Access Denied'] })
    }
    if (github.stateMisMatch()) {
      return response
        .status(408)
        .send({ success: false, errors: ['Request has expired, please retry again'] })
    }
    if (github.hasError()) {
      return response.status(400).send({ success: false, errors: [github.getError] })
    }

    const githubUser = await github.user()
    try {
      const user = await User.firstOrCreate(
        {
          email: githubUser.email!,
        },
        {
          username: githubUser.name,
          provider: 'github',
          provider_id: githubUser.id,
        }
      )
      const token = await auth.use('api').generate(user, {
        expiresIn: '1 hour',
      })
      return response.status(200).send({ success: true, data: token.toJSON() })
    } catch (error) {
      return response.status(400).send({ success: false, errors: ['Login failed'] })
    }
  }
}
