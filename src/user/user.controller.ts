import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import { diskStorage } from 'multer'
import { IsPublic } from 'src/auth/decorators/is-public.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @IsPublic()
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @Get('user/:username')
    getUserByUsername(@Param() params) {
        return this.userService.getUserByUsername(params.username)
    }

    @Get()
    getUsers() {
        return this.userService.getUsers()
    }

    @Patch(':id')
    //@UseGuards(LocalAuthGuard)
    //@UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', { storage: diskStorage({}) }))
    async updateUser(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const buffer = file ? await fs.readFile(file.path) : undefined
        return await this.userService.updateUser(
            id,
            updateUserDto,
            buffer,
            file?.mimetype,
            file?.originalname,
            req,
            res,
        )
    }
}
