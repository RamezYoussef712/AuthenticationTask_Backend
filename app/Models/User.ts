import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string | null

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.password) {
      if (user.$dirty.password) {
        user.password = await Hash.make(user.password)
      }
    }
  }

  @column({ serializeAs: null })
  public forget_password_token: string | null

  @column()
  public provider: string | null

  @column()
  public provider_id: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
