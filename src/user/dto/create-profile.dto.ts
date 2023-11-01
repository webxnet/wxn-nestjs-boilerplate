import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator'
import { Profile } from '../entities/profile.entity'
import { sanitizeInput } from '../helpers/utils.helper'

export class CreateProfileDto extends Profile {
    @IsNotEmpty()
    avatarUrl: string

    @IsString()
    @IsOptional()
    @Transform(({ value }) => sanitizeInput(value))
    firstName: string

    @IsString()
    @IsOptional()
    @Transform(({ value }) => sanitizeInput(value))
    lastName: string

    @IsString()
    @IsOptional()
    @Transform(({ value }) => sanitizeInput(value))
    address: string

    dateOfBirth: Date
    emailVerified: Date

    @IsBoolean()
    @IsOptional()
    isActive: boolean

    @IsBoolean()
    @IsOptional()
    isBlock: boolean

    @IsBoolean()
    @IsOptional()
    isStaff: boolean

    @IsBoolean()
    @IsOptional()
    isSuperUser: boolean

    @IsString()
    @IsOptional()
    @Transform(({ value }) => sanitizeInput(value))
    langKey: string

    @IsString()
    @IsOptional()
    phone: string
}
