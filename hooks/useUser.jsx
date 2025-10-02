import { useContext } from "react";
import { UserContextOld } from "../context/UserContext-old";
import { UserContext } from "../context/UserContext";

export function useUser()
{
    const context = useContext(UserContext)

    if(!context){
        throw new Error("useUser must be used withing a UserProvider")
    }


    return context
}