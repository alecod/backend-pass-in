import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getUserBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/users/:userId/badge', {
    schema: {
      params:z.object({
        userId: z.coerce.number().int()
      }), 
      response: {}
    }
  }, async (request, reply) => {
    const {userId} = request.params

    const user = await prisma.usersEvent.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          select: {
            title: true
          }
        }
      },
      where: {
        id: userId
      }
    })

    if(user === null) {
      throw new Error('could not find user')
    }

    return reply.send({ user })

  })
}