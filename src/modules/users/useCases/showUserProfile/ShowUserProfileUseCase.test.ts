import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

const mockedUserParams = {
  name: "John Doe",
  email: "user@email.com",
  password: "12345",
};

describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should show user profile pass an existent user id", async () => {
    const { id } = await createUserUseCase.execute(mockedUserParams);

    const user = await showUserProfileUseCase.execute(id!);

    expect(user).toEqual({
      id,
      ...mockedUserParams,
      password: expect.any(String),
    });
  });

  it("should throw error when userId is not found", async () => {
    const response = showUserProfileUseCase.execute("any");

    expect(response).rejects.toBeInstanceOf(ShowUserProfileError);
    expect(response).rejects.toThrow("User not found");
  });
});
