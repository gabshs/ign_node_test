import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserError } from './CreateUserError'
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: IUsersRepository
let createUser: CreateUserUseCase

describe('CreateUserUseCase', () => { 
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(usersRepository)
  })

  it('should create a user if pass valid params', async () => {
    const params = {
      name: 'John Doe',
      email: 'user@email.com',
      password: '12345'
    }
    const user = await createUser.execute(params)

    expect(user).toHaveProperty('id')
  })

  it('should throw error when user already exists', async () => {
    const params = {
      name: 'John Doe',
      email: 'user@email.com',
      password: '12345'
    }

    await createUser.execute(params)
    const user = createUser.execute(params)

    expect(user).rejects.toThrow('User already exists')
    expect(user).rejects.toBeInstanceOf(CreateUserError)
  })
})