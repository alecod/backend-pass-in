import {prisma} from '../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: "c2c78286-896b-4565-a95d-a80809ea2fb2",
      title: 'United Sumiit',
      slug: "united-summit",
      details: "Um evento para devs apaixonados por codigo",
      mexAttendees: 120
    }
  })



}

seed().then(() => {
  console.log('database seeded')
  prisma.$disconnect()
})