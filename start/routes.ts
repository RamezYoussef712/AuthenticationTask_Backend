/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout')
  Route.post('forget_password', 'ForgetPasswordController.forget_password')
  Route.post('reset_password', 'ForgetPasswordController.reset_password')
  Route.get('login/github', 'SocialAuthController.redirect')
  Route.get('login/github/callback', 'SocialAuthController.callback')
})

Route.group(() => {
  Route.get('index', 'UsersController.index')
  Route.get('show/:id', 'UsersController.show')
  Route.put('update/:id', 'UsersController.update')
  Route.delete('delete/:id', 'UsersController.delete')
})
  .middleware('auth:api')
  .prefix('/api/users/')
