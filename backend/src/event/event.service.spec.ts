import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Repository<Event>;

  const mockEventRepository = {
    create: jest.fn().mockReturnValue({}),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event and return it', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Sorveteria',
        description: 'Comprar Sorvete',
        hour: '17:12',
        date: '2024-12-29',
        userId: 'userId', // Inclua userId para ser usado no evento
      };

      mockEventRepository.save.mockResolvedValue(createEventDto);

      const result = await service.create(createEventDto);
      expect(result).toEqual(createEventDto);
      expect(mockEventRepository.create).toHaveBeenCalledWith({
        ...createEventDto,
        user: { id: createEventDto.userId },
      });
      expect(mockEventRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUserId', () => {
    it('should return an array of events for a user', async () => {
      const userId = 'userId';
      const events = [{ id: '1', name: 'Sorveteria' }, { id: '2', name: 'Cinema' }];

      mockEventRepository.find.mockResolvedValue(events);

      const result = await service.findAllByUserId(userId);
      expect(result).toEqual(events);
      expect(mockEventRepository.find).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      const eventId = '1';
      const event = { id: eventId, name: 'Sorveteria' };

      mockEventRepository.findOneBy.mockResolvedValue(event);

      const result = await service.findOne(eventId);
      expect(result).toEqual(event);
      expect(mockEventRepository.findOneBy).toHaveBeenCalledWith({ id: eventId });
    });

    it('should return null if the event does not exist', async () => {
      const eventId = 'non-existent-id';
      mockEventRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(eventId);
      expect(result).toBeNull();
      expect(mockEventRepository.findOneBy).toHaveBeenCalledWith({ id: eventId });
    });
  });

  describe('update', () => {
    it('should update an event and return it', async () => {
      const eventId = '1';
      const updateEventDto: UpdateEventDto = { name: 'Novo Nome', description: 'Nova descrição', hour: "00:00", date: "2024-12-12" };
      const existingEvent = { id: eventId, name: 'Sorveteria', description: 'Nova descrição', hour: "00:00", date: "2024-12-12" };

      mockEventRepository.findOneBy.mockResolvedValue(existingEvent);
      mockEventRepository.save.mockResolvedValue({ ...existingEvent, ...updateEventDto });

      const result = await service.update(eventId, updateEventDto);
      expect(result).toEqual({ ...existingEvent, ...updateEventDto });
      expect(mockEventRepository.findOneBy).toHaveBeenCalledWith({ id: eventId });
      expect(mockEventRepository.save).toHaveBeenCalledWith({ ...existingEvent, ...updateEventDto });
    });

    it('should throw an error if the event is not found', async () => {
      const eventId = 'non-existent-id';
      const updateEventDto: UpdateEventDto = { name: 'Novo Nome', description: 'Nova descrição', hour: "00:00", date: "2024-12-12"  };

      mockEventRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(eventId, updateEventDto)).rejects.toThrow(Error);
      await expect(service.update(eventId, updateEventDto)).rejects.toThrow('Tarefa não encontrada!');
    });
  });

  describe('remove', () => {
    it('should remove an event by id', async () => {
      const eventId = '1';

      mockEventRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(eventId);
      expect(result).toEqual({ message: `Evento com ID ${eventId} deletado com sucesso.` });
      expect(mockEventRepository.delete).toHaveBeenCalledWith({ id: eventId });
    });

    it('should throw an error if the event does not exist', async () => {
      const eventId = 'non-existent-id';

      mockEventRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(eventId)).rejects.toThrow(Error);
      await expect(service.remove(eventId)).rejects.toThrow(`Evento com ID ${eventId} não encontrado`);
    });
  });
});
