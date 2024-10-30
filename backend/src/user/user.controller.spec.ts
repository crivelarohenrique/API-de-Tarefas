import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call userService.create and return a user', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const savedUser: User = { id: '1', ...userData, password: 'hashedPassword', events: [] };

      mockUserService.create.mockResolvedValue(savedUser);

      const result = await controller.create(userData);

      expect(result).toEqual(savedUser);
      expect(mockUserService.create).toHaveBeenCalledWith(userData.name, userData.email, userData.password);
    });
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const loginDto: LoginDto = { email: 'john@example.com', password: 'password' };
      const user: User = { id: '1', name: 'John Doe', email: loginDto.email, password: 'hashedPassword', events: [] };
      const tokenResponse = { token: 'jwtToken', userId: user.id };

      mockUserService.validateUser.mockResolvedValue(user);
      mockUserService.login.mockResolvedValue(tokenResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(tokenResponse);
      expect(mockUserService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockUserService.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto: LoginDto = { email: 'john@example.com', password: 'wrongPassword' };

      mockUserService.validateUser.mockResolvedValue(null); // Simulando falha na validação do usuário

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const user: User = { id: userId, name: 'John Doe', email: 'john@example.com', password: 'hashedPassword', events: [] };

      mockUserService.findById.mockResolvedValue(user);

      const result = await controller.getUser(userId);

      expect(result).toEqual(user);
      expect(mockUserService.findById).toHaveBeenCalledWith(userId);
    });
  });
});
