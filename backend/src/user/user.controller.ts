import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso.'})
  @ApiResponse({ status: 400, description: 'Erro ao criar o usuário.' })
  @ApiBody({
    description: 'Dados do usuário para criação',
    type: RegisterDto, 
  })
  async create(@Body() registerDto: RegisterDto) {
    const { name, email, password } = registerDto; 
    return this.userService.create(name, email, password);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  @ApiBody({ description: 'Dados para login', type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userService.login(user);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso.'})
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiParam({ name: 'id', required: true, description: 'ID do usuário' })
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com o id ${id} não encontrado.`);
    }
    return user;
  }
}
