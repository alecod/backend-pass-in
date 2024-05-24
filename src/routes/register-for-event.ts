import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/events/:eventId/usersEvent', {
    schema: {
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          usersId: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params
    const { name, email } = request.body

    const userFromEmail = await prisma.usersEvent.findUnique({
      where: {
        eventId_email: {
          email,
          eventId
        }
      }
    })

    if (userFromEmail !== null) {
      throw new Error("This e-mail is already registered for this event")
    } 

    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    })

    const numberOfUsersForEvent = await prisma.usersEvent.count({
      where: {
        eventId
      }
    })

    if(event?.mexAttendees &&  numberOfUsersForEvent >= event?.mexAttendees) {
      throw new Error('The maxinum number of users of this event has been reached ')
    }

    const user = await prisma.usersEvent.create({
      data: {
        name,
        email,
        eventId
      }
    })

    return reply.status(201).send({usersId: user.id})
  })
}