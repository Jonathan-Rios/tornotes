import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'], // Vai mostrar no terminal as queries que o prisma faz
})
