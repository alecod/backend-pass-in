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
      response: {
        200: z.object({
          badge: z.object({
            name: z.string(),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInURL: z.string().url()
          })
        })
      }
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

    const baseURL = `${request.protocol}://${request.hostname}`

    const checkInURL = new URL(`/users/${userId}/check-in`, baseURL)

    return reply.send({ 
      badge: {
        name: user.name,
        email: user.email,
        eventTitle: user.event.title,
        checkInURL: checkInURL.toString()
      }
     })
  })
}