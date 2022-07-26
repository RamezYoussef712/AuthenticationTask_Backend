import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('username').notNullable().unique()
      table.string('email').notNullable().unique
      table.string('password').nullable()
      table.string('forget_password_token').nullable()
      table.string('provider').nullable()
      table.string('provider_id').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['id', 'username'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
