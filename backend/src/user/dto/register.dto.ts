import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


export class RegisterDto {

  @ApiProperty({ description: "Nome do usuário"})
  @IsString()
  name: string;

  @ApiProperty({ description: "Email do usuário"})
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Senha do usuário"})
  @IsString()
  password: string;
}
