import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Toolbar from './toolbar'
import WatchParty from './watchparty'
import { Drawer, IconButton, TextField } from '@mui/material'
import { Clear, Close, PlayCircle } from '@mui/icons-material'
import { updateLastWatchedLink } from '@/redux/slices/videoStreamSlice'
import ReactPlayer from 'react-player'

export default function WatchPartyContainer(props:any) {
    const { draweropen,
        setdraweropen,
        addCollaborator,
        addoption,
        setaddoption,
        setCollaborators,
        setgroupsession,
        groupwatchsession,
        getwindowurl,
        Collaborators,
    links}=props
        const movieurl = useSelector((state:any)=>state.videoStream.lastwatchedlink);
    const dispatch = useDispatch()
    const isYouTubeLink = (link:any) => {
        return link.url.includes("youtube.com") || link.url.includes("youtu.be");
      };
    

    return (
        <div className="flex flex-col items-center">
            <Toolbar draweropen={draweropen} setdraweropen={setdraweropen} addCollaborator={addCollaborator} setgroupsession={setgroupsession} groupwatchsession={groupwatchsession} setCollaborators={setCollaborators} addoption={addoption} setaddoption={setaddoption} Collaborators={Collaborators} getwindowurl={getwindowurl} />
            <WatchParty />
            <Drawer anchor="right" open={draweropen}>
                <IconButton color="error" onClick={() => { setdraweropen(false) }}>
                    <Close/>
                </IconButton>
                <div className={`flex flex-col px-10 py-4 w-[90%]  items-center justify-center`}>

                    <div className="flex justify-center w-[90%]">
                        <TextField
                            sx={{
                                minWidth: "80%"
                            }}
                            type="search"
                            onChange={(e) => dispatch(updateLastWatchedLink(e.target.value))}
                            value={movieurl}
                            id="search"

                            placeholder="Paste video link "

                        />
                        <IconButton onClick={() => { dispatch(updateLastWatchedLink("")) }} color="primary">
                            <Clear />
                        </IconButton>
                    </div>
                    <h3>Paste Video Link here !</h3>

                    <div className={`flex flex-col px-10 py-5 w-[90%] gap-y-12 items-center justify-center`}>
                        {links?.map((link:any, index:number) => (
                            <>
                                {isYouTubeLink(link) ? (
                                    <div className="flex flex-2">
                                        <ReactPlayer controls={false} key={index} width={360} height={240} url={link.url} paused={true} />
                                        <IconButton onClick={() => { dispatch(updateLastWatchedLink(link.url)) }} color={link.url == movieurl ? "error" : "info"}>
                                            <PlayCircle/>
                                        </IconButton>
                                    </div>
                                ) : null}
                            </>

                        ))}
                    </div>
                </div>

            </Drawer>
        </div>
    )
}
