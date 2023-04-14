import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { User } from '../entities/user.entity'

export class CreateUserDto extends User {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'senha muito fraca',
    })
    password: string
}
