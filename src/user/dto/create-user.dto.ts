import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { User } from '../entities/user.entity'
import { lowercaseString, sanitizeInput } from '../helpers/utils.helper'

export class CreateUserDto extends User {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => {
        const newValue = sanitizeInput(value)
        return lowercaseString(newValue)
    })
    email: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(25, { message: 'Username must be up to 25 characters' })
    @MinLength(4, { message: 'Username must be at least 4 characters' })
    @Transform(({ value }) => sanitizeInput(value))
    username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Password should contain more than 4 characters' })
    @MaxLength(20, { message: 'Password must be up to 20 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'senha muito fraca',
    })
    password: string
}
