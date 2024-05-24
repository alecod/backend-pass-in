import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getEventUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/events/:eventId/users', {
    schema: {
      params: z.object({
          eventId: z.string().uuid()
        }),
        querystring: z.object({
          query: z.string().nullish(),

          pageIndex: z.string().nullish().default("0").transform(Number)
        }),
        response: {
         200: z.object({
            users: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable()
              })
            )
         })
        }
    }
  }, async (request, reply) => {
      const { eventId } = request.params
      const { pageIndex, query } = request.query

      const users = await prisma.usersEvent.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: {
              created_at: true
            }
          }
        },

        where: query ? {
          eventId,
          name: {
            contains: query
          }
        } : { eventId }, 
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: 'desc'
        }
      })
      return reply.send({ 
          users: users.map((user) => {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
              checkedInAt: user.checkIn?.created_at ?? null
            }
          })
       })
  })
}