import { cookies } from "next/headers"


export const token = () => {
    const token = cookies().get('token');
    return token;
}