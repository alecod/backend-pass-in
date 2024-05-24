import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/users/:userId/check-in', {
    schema: {
      params: 
        z.object({
          userId: z.coerce.number().int()
        }),

        response: {
          201: z.null()
        }
      
    }
  }, async (request, reply) => {
    const {userId} = request.params

    const usersCheckIn = await prisma.checkIn.findUnique({
      where: {
        usersEventId: userId
      }
    })

    if(usersCheckIn !== null) {
      throw new Error("Checking In haas ben registred")
    }

    await prisma.checkIn.create({
      data: {
        usersEventId: userId
      }
    })

    return reply.status(201).send()

  })
}