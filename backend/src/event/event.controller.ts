import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  BadGatewayException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthMiddleware } from '../middleware/user.middleware';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('event')
@ApiBearerAuth()
@Controller('event')
@UseGuards(AuthMiddleware)
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @Post('create')
  @ApiResponse({ status: 201, description: 'O evento foi criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'A tentativa de criação de evento falhou.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' }) 
  @ApiBody({ type: CreateEventDto })
  async create(@Body() createEventDto: CreateEventDto, @Req() req) {
    try {
      const userId = req.user.sub;
      const event = await this.eventService.create({
        ...createEventDto,
        userId,
      });
      return event; 
    } catch (error) {
      this.logger.error('Falha ao criar evento.', error);
      throw new BadRequestException('Não foi possível criar evento.');
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Eventos encontrados com sucesso.' })
  @ApiResponse({ status: 400, description: 'ID do usuário é obrigatório.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' }) 
  @ApiResponse({ status: 502, description: 'Não foi possível retornar eventos.' })
  @ApiParam({ name: "id", required: true, description: 'ID do evento' })
  async findAll(@Req() req) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('ID do usuário é obrigatório.');
      }
      return await this.eventService.findAllByUserId(userId);
    } catch (error) {
      this.logger.error('Falha ao encontrar eventos', error);
      throw new BadGatewayException('Não foi possível retornar eventos.');
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Evento encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' }) 
  @ApiResponse({ status: 502, description: 'Não foi possível retornar evento.' })
  @ApiParam({ name: "id", required: true, description: 'ID do evento' })
  async findOne(@Param('id') id: string) {
    try {
      const event = await this.eventService.findOne(id);
      if (!event) {
        throw new NotFoundException(`Evento com o id ${id} não foi encontrado.`);
      }
      return event;
    } catch (error) {
      this.logger.error(`Falha ao encontrar evento com o id ${id}`, error);
      throw new BadGatewayException('Não foi possível retornar evento.');
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Falha na atualização do evento.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' }) 
  @ApiBody({ type: UpdateEventDto })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Req() req) {
    try {
      const userId = req.user.sub;
      return await this.eventService.update(id, { ...updateEventDto, userId });
    } catch (error) {
      this.logger.error(`Falha ao atualizar evento com o id ${id}.`, error);
      throw new BadRequestException('Não foi possível atualizar evento.');
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Evento removido com sucesso.' })
  @ApiResponse({ status: 400, description: 'Falha na remoção do evento.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' }) 
  @ApiParam({ name: "id", required: true, description: 'ID do evento' })
  async remove(@Param('id') id: string) {
    try {
      return await this.eventService.remove(id);
    } catch (error) {
      this.logger.error(`Falha ao remover evento com o id ${id}`, error);
      throw new BadRequestException('Não foi possível remover evento.');
    }
  }
}
