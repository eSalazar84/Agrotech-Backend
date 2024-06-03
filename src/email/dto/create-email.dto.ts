import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Templates } from "../../helpers/enums-type.enum";

export class CreateEmailDto {
    @IsString()
    @IsNotEmpty()
    from: string;

    @IsString()
    @IsNotEmpty()
    subjectEmail: string;

    @IsString()
    @IsNotEmpty()
    sendTo: string

    @IsEnum(Templates)
    @IsNotEmpty()
    template: string
}
