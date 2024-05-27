import { Rol } from "../../helpers/enums-type.enum";

export interface IAccess_token {
    access_token: string,
    email: string,
    name: string,
    rol: Rol,
    id: number
}