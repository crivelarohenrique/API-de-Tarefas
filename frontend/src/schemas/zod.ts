import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().nonempty("Senha ou Email incorretos."),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação de senha é obrigatória"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const eventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  hour: z
    .string()
    .regex(/^\d{2}:\d{2}$/, { message: 'Hora deve ser no formato 00:00' }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve ser no formato DD-MM-YYYY' }),
});
