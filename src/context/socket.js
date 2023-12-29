import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null)

export const useSocket = ()=>{
    const socket = useContext(SocketContext)
    return socket
}
export const SocketProvider = (props) => {
    const {children} = props
    const [socket, setsocket] = useState(null)
const onetimer =useRef(false)
    useEffect(() => {
        if(onetimer.current){return;}
        onetimer.current=true;
        const connection = io()
        setsocket(connection)
console.log(connection)
    }, [])
   socket?.on('connect_error',async (err) =>{
    console.log(err)
    await fetch('/api/socket')})

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )

}