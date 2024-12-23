import { TextField,  IconButton, Toolbar as Toolbar1 } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon, Cancel as CancelIcon, Link as LinkIcon, ArrowBack as ArrowBackIcon, Movie, VideoSettingsRounded } from '@mui/icons-material';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


const Toolbar =({draweropen,setdraweropen,setCollaborators,setaddoption,Collaborators,getwindowurl,addoption,addCollaborator,groupwatchsession,setgroupsession})=>{
  const useractive=useSelector((state)=>state.videoStream.active)




return(
    <div className="flex w-screen bg-black fixed p-0 z-20 justify-center">
    <div className="flex max-sm:!flex justify-center p-2 my-6 border w-fit margin-auto rounded-lg gap-4">
      {!addoption ? (
        <>
          <IconButton onClick={() => setaddoption(true)} color="primary">
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={getwindowurl} color="primary">
            <LinkIcon />
          </IconButton>
          <Link href="/home">
            <IconButton color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <IconButton onClick={()=>{setgroupsession(!groupwatchsession)}} color={groupwatchsession?'error':'primary'}>
            <Movie/>
          </IconButton>

          {setdraweropen && <IconButton onClick={()=>{if(useractive){setdraweropen(!draweropen)}
        else{
          toast.error("Get control access to change video !")
        }
        }} color={!draweropen?'primary':'error'}>
            <VideoSettingsRounded/>
          </IconButton>}
        </>
      ) : (
        <>
          <TextField
            type="search"
            onChange={(e) => setCollaborators(e.target.value)}
            value={Collaborators}
            id="search"
            className="block sm:min-w-80 p-4 text-sm text-white border border-gray-300 rounded-lg bg-gray-50  focus:border-blue-500 dark:bg-gray-600   dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Email"
            required
          />
          <IconButton onClick={addCollaborator} color="primary">
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={() => setaddoption(false)} color="error">
            <CancelIcon />
          </IconButton>
          
        </>
      )}
    </div>
  </div>

)
}
export default Toolbar;