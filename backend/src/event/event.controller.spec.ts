import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthModule } from '../auth/auth.module';
import '@types/jest'

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEventService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{
        provide: EventService,
        useValue: mockEventService
      }],
      imports: [AuthModule]
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


describe('create', () => {
  it('should create an event and return it', async () => {
    const createEventDto: CreateEventDto = { name: "Sorveteria", description: "Comprar Sorvete", hour: "17:12", date: "2024-12-29"  };
    const req = { user: { sub: 'userId' } };    
    mockEventService.create.mockResolvedValue(createEventDto);

    expect(await controller.create(createEventDto, req)).toEqual(createEventDto);
    expect(mockEventService.create).toHaveBeenCalledWith({ ...createEventDto, userId: 'userId' });
  });
});

describe('findAll', () => {
  it('should return all events for a user', async () => {
    const req = { user: { sub: 'userId' } };
    const result = [{ id: 1, name: 'Event 1' }];
    mockEventService.findAllByUserId.mockResolvedValue(result);

    expect(await controller.findAll(req)).toEqual(result);
    expect(mockEventService.findAllByUserId).toHaveBeenCalledWith('userId');
  });
});

describe('findOne', () => {
  it('should return a single event', async () => {
    const result = { id: 1, name: 'Event 1' }; 
    mockEventService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(mockEventService.findOne).toHaveBeenCalledWith('1');
  });
});

describe('update', () => {
  it('should update an event', async () => {
    const updateEventDto: UpdateEventDto = { name: "Pizzaria", description: "Sair para comer pizza", hour: "19:14", date: "2024-11-30" };
    const req = { user: { sub: 'userId' } };
    const result = { id: '1', ...updateEventDto };
    mockEventService.update.mockResolvedValue(result);

    expect(await controller.update('1', updateEventDto, req)).toEqual(result);
    expect(mockEventService.update).toHaveBeenCalledWith('1', { ...updateEventDto, userId: 'userId' });
  });
});

describe('remove', () => {
  it('should remove an event', async () => {
    const id = '1';
    mockEventService.remove.mockResolvedValue({ affected: 1 });

    expect(await controller.remove(id)).toEqual({ affected: 1 });
    expect(mockEventService.remove).toHaveBeenCalledWith(id);
  });
});
});