import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { S3Service } from 'src/s3/s3.service'
import { PrismaService } from './../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService, private s3Service: S3Service) {}

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                email: true,
                username: true,
                avatarUrl: true,
            },
        })
        // if no user is found, throw an error
        if (!user) {
            throw new BadRequestException('Something went wrong. Please try again.')
        }

        // generate a signed url for the image if exists
        if (user.avatarUrl) {
            const key = user.avatarUrl.split('.amazonaws.com/')[1]
            user.avatarUrl = await this.s3Service.getSignedUrl(key)
        }

        return user
    }

    async getUserByUsername(username: string) {
        const userName = await this.prisma.user.findUnique({
            where: { username },
            select: {
                username: true,
                email: true,
            },
        })

        // if no user is found, throw an error
        if (!userName) {
            throw new BadRequestException('Something went wrong. Please try again.')
        }

        return userName
    }

    async getUsers() {
        const countItems = await this.prisma.user.count()
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                email: true,
                roles: true,
            },
            orderBy: {
                username: 'asc',
            },
        })

        return { countItems, users }
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, username } = createUserDto
        // check if email already exists
        const emailExists = await this.prisma.user.findUnique({
            where: { email },
        })

        if (emailExists) {
            throw new BadRequestException(`email: '${email}' is already registered.`)
        }
        // check if user already exists
        const userNameExists = await this.prisma.user.findUnique({
            where: { username },
        })

        if (userNameExists) {
            throw new BadRequestException(`username: '${username}' is already registered.`)
        }

        const data = {
            ...createUserDto,
            // save hashed password from the current password
            password: await bcrypt.hash(createUserDto.password, 10),
        }
        // create user with prisma
        const createdUser = await this.prisma.user.create({ data })
        return {
            ...createdUser,
            password: undefined,
        }
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } })
    }

    async updateUser(
        id: string,
        updateUserDto: UpdateUserDto,
        buffer: Buffer | undefined,
        mimetype: string | undefined,
        originalname: string | undefined,
        req: any,
        res: any,
    ) {
        // get the user id from the JWT token
        const userId = req.user.id

        // get user from the database
        const user = await this.prisma.user.findUnique({ where: { id: id } })

        // if no user is found, throw an error
        if (!user) {
            throw new NotFoundException('User not found')
        }

        // check if userId from token equals the id from the request params
        if (user.id !== userId) {
            throw new BadRequestException('You are not authorized to edit this profile.')
        }

        // initialize the avatarUrl as existing or undefined
        let avatarUrl: string | undefined = user.avatarUrl

        // check if user is trying to update the avatar, delete the old avatar from S3 and upload the new one
        if (buffer && mimetype && originalname) {
            if (avatarUrl) {
                const oldKey = avatarUrl.split('.amazonaws.com/')[1]
                await this.s3Service.deleteImage(oldKey)
            }
            const username = req.user.username
            const key = `${username}/avatars/${Date.now()}-${originalname}`
            avatarUrl = await this.s3Service.uploadImage(buffer, mimetype, key)
        }

        // updateData spread the updateUserDto and add the avatarUrl
        const updateData: Record<string, any> = {
            ...(updateUserDto.email !== undefined && { email: updateUserDto.email }),
            ...(updateUserDto.username !== undefined && {
                username: updateUserDto.username,
            }),
            avatarUrl,
        }
        // check if user is trying to update the username
        if (updateUserDto.username) {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username: updateUserDto.username },
            })

            if (existingUsername) {
                throw new BadRequestException('Username already taken')
            }

            updateData.username = updateUserDto.username
        }

        // check if user is trying to update the email
        if (updateUserDto.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            })

            if (existingEmail) {
                throw new BadRequestException('Email already taken.')
            }

            updateData.email = updateUserDto.email
        }

        // update the user
        const updateUser = await this.prisma.user.update({
            where: {
                id: id,
            },
            data: updateData,
        })

        // check if the user was updated
        if (updateUser) {
            return res.status(200).json({
                message: 'User updated successfully',
                avatarUrl,
            })
        } else {
            throw new BadRequestException('Oops! Something went wrong.')
        }
    }
}
