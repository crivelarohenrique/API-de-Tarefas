import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return it', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const savedUser = { id: '1', ...userData, password: 'hashedPassword', events: [] };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); 
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(savedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

      const result = await service.create(userData.name, userData.email, userData.password);

      expect(result).toEqual(savedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userData as any); // Simulando que o usuário já existe

      await expect(service.create(userData.name, userData.email, userData.password)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const userData = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'hashedPassword' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userData as User);

      const result = await service.findByEmail(userData.email);

      expect(result).toEqual(userData);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userData = { id: '1', name: 'John Doe' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userData as User);

      const result = await service.findById(userData.id);

      expect(result).toEqual(userData);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userData.id }, select: ['name'] });
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const userData = { id: '1', email: 'john@example.com', password: 'hashedPassword' };
      const plainPassword = 'password';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userData as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Simulando comparação de senha

      const result = await service.validateUser(userData.email, plainPassword);

      expect(result).toEqual(userData);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, userData.password);
    });

    it('should return null if credentials are invalid', async () => {
      const userData = { id: '1', email: 'john@example.com', password: 'hashedPassword' };
      const plainPassword = 'wrongPassword';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userData as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Simulando comparação de senha falha

      const result = await service.validateUser(userData.email, plainPassword);

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, userData.password);
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const userData = { id: '1', email: 'john@example.com' };
      const token = 'token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token); // Simulando a geração de token

      const result = await service.login(userData as User);

      expect(result).toEqual({ token, userId: userData.id });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: userData.email, sub: userData.id });
    });
  });
});
