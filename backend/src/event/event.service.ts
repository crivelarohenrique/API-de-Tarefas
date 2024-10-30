import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor (
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create({ 
      ...createEventDto,
      user: { id: createEventDto.userId},
    });
    return this.eventRepository.save(event);
  }

  async findAllByUserId(userId: string) {
    return this.eventRepository.find({
      where: { userId }
    })
  }

  async findOne(id: string) {
    const event = this.eventRepository.findOneBy({ id })
    return event
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.findOneBy({ id })
    if (!event) {
      throw new Error('Tarefa não encontrada!')
    }

    Object.assign(event, updateEventDto)
    return this.eventRepository.save(event)
  }

  async remove(id: string) {
    const result = await this.eventRepository.delete({ id });

    if (result.affected === 0 ) {
      throw new Error(`Evento com ID ${id} não encontrado`)
    }

    return { message: `Evento com ID ${id} deletado com sucesso.`}
  }
}
