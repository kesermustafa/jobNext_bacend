import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email("Geçerli bir e-posta giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
    passwordConfirm: z.string(),
    phone: z.string().optional(),
    country: z.string().optional(),
    description: z.string().min(2).max(200).optional(),
}).refine(data => data.password === data.passwordConfirm, {
    message: "Şifreler uyuşmuyor",
    path: ["passwordConfirm"]
});

export const LoginUserSchema = z.object({
    email: z.string().email("Geçerli bir e-posta giriniz"),
    password: z.string().min(1, "Şifre zorunludur")
}).strict();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type LoginUserDto = z.infer<typeof LoginUserSchema>;

