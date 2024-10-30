import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class UpdateEventDto {
  @ApiProperty({ description: 'Nome do evento '})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição do evento '})
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Hora do evento no formato HH:mm', example: '00:00'})
  @Matches(/^\d{2}:\d{2}$/, { message: 'Hora deve ser no formato HH:mm' }) 
  hour: string;

  @ApiProperty({ description: 'Data do evento no formato YYYY-MM-DD', example: '2024-10-28'})
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve ser no formato YYYY-MM-DD'})
  date: string;

  @ApiProperty({ required:false, description: 'ID do usuário', type: String})
  userId?: string;
  
}
