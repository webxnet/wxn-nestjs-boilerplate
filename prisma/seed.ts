import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    await prisma.user.deleteMany()

    console.log('Seeding ...')
const user1 = await prisma.user.create({
    data: {
        email: 'gilson.peloso@webxnet.com.br',
        username: 'Admin'
        firstname: 'Gilson',
        lastname: 'Peloso',
        avatarUrl: 'https://kitweb.s3.sa-east-1.amazonaws.com/user.png'
      isSuperUser: true,
  isStaff:       true,         
  isActive:      true,        
  phone: '+5535988556340',         
  langKey: 'pt-br',

        password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
        role: 'USER',
        posts: {
            create: {
                title: 'Join us for Prisma Day 2019 in Berlin',
                content: 'https://www.prisma.io/day/',
                published: true,
            },
        },
    },
})

     console.log({ user1, user2 })
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
