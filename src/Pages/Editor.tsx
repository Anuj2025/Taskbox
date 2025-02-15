import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom"
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
} from "@blocknote/mantine";
import { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, } from "firebase/auth";

import Loader from "../Components/Loader.tsx"
import {useNavigate} from "react-router-dom"
import { getFirestore, doc, getDoc, setDoc, query, where, collection, updateDoc } from "firebase/firestore";
import { app } from "../services/Firebase.tsx";
import {toast} from "react-hot-toast"
import * as FaIcon from "react-icons/fa";
import { MdCancel } from "react-icons/md";



const Editor = () => {
  const editor = useCreateBlockNote();
  const [value, setValue] = useState("");
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [ShareOpen, setShareOpen] = useState(false);
  const auth = getAuth(app)
  const db = getFirestore(app);
  const {Document}  = useParams();
  const Navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [InputValue, setInputValue] = useState(false);

  async function LoadContent(email) {
  try {
    const ref = doc(db, email, Document);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      if (docSnap.data().content) {
        const SavedData = docSnap.data().content;
        editor.replaceBlocks(editor.document, SavedData)
      }
    } else {
      toast.error("No document found!")
    }
    setIsLoading(true)
  } catch (e) {
    toast.error(e.message)
  }
}

  React.useEffect(() => {
    
    const Submit = onAuthStateChanged(auth, (u) => {
if (u) {
        setUser(u);
        console.log(u.email)
        LoadContent(u.email);
}
    })

    return () => Submit()
  }, [])
 
 React.useEffect(()=> {

const FecthData = async () => {
  const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get("id");
const agent = urlParams.get("Agent");
const clientId = urlParams.get("client");
const ref = doc(db, user?.email, Document);
console.log(agent, clientId)

if (!clientId) {
   toast.error("Unknown client");
   Navigate("/clientError")
}

if (!agent) {
   toast.error("unknown error")
   Navigate("/clientError")
}
}

return () => FecthData()
 }, [])
 
  const lightRedTheme = {
    colors: {
      editor: {
        text: "#fff",
        background: "black",
      },
      menu: {
        text: "#ffffff",
        background: "black",
      },
      tooltip: {
        text: "#ffffff",
        background: "#black",
      },
      hovered: {
        text: "#fff",
        background: "#333",
      },
      selected: {
        text: "#333",
        background: "#fefefe",
      },
      disabled: {
        text: "#9b0000",
        background: "#7d0000",
      },
      shadow: "#333",
      border: "black",
      sideMenu: "#bababa",
      highlights: lightDefaultTheme.colors!.highlights,
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

 async function handleSubmit() {
    const ref = doc(db, user.email, Document);
    try {
      const Data = await updateDoc(ref, {
      content: value,
      })
      toast("Saved")
    } catch (e) {
      toast.error("No such Document!")
    }
  }
 async function handleClear() {
   try {
     editor.replaceBlocks(editor.document, "")
   } catch (e) {
     toast.error(e.message)
   }
 }
 async function handleLoad() {
   const userEmail = user.email;
   try {
     const ref = doc(db, userEmail, Document);
     const Doc = await getDoc(ref);
     const SavedData = Doc.data().content;
     editor.replaceBlocks(editor.document, SavedData)
   } catch (e) {
     toast.error(e.message)
   }
 }
function handelShare(checked) {
setIsChecked(checked);
if (checked) {
  setShareOpen("?readOnly=1")
} else {
  setShareOpen("?readOnly=0")
}
navigator.clipboard.writeText(InputValue)
}
  return (
  <div>
    {isLoading ? (
<div><BlockNoteView
      className="p-2"
      onChange={() => {
            setValue(editor.document);
          }} theme={lightRedTheme} editor={editor} />
<div className="w-full flex justify-center mt-[20px]" >
<div className="flex gap-[1rem]" >
<button className="btn btn-primary" onClick={handleSubmit}><FaIcon.FaSave size={24} /></button>
<button className="btn btn-primary" onClick={handleClear}><FaIcon.FaEraser size={24} /></button>
<button className="btn btn-primary" onClick={handleLoad}><FaIcon.FaCloudDownloadAlt size={24} /></button>
<button className="btn btn-primary" onClick={() => setIsShareOpen(!isShareOpen)}><FaIcon.FaShare size={24} /></button>
</div>

{isShareOpen ? (<div className="fixed w-full h-[100vh] flex flex-col justify-center top-0 place-content-center _align bg-black/30 backdrop-blur-lg rounded" >

<div className="w-[260px] h-[260px] bg-base-200 rounded-lg p-2 relative">
<button className="relative float-right m-1.5 "><MdCancel onClick={() => setIsShareOpen(!isShareOpen)} size={24} /></button>
<input value={window.location.hostname+":"+window.location.port+`/${user?.email.split("@")[0]}`+"/share/"+window.location.pathname.split("/")[2]+`${ShareOpen}`} onChange={() => setInputValue(window.location.hostname+":"+window.location.port+`/${user?.email.split("@")[0]}`+"/share/"+window.location.pathname.split("/")[2]+`${ShareOpen}`)} className="input w-[245px] text-nutral primary-content"  />
<div className="flex flex-col justify-center align-middle text-center">
<button className="btn btn-primary m-2.5" >create</button>
<div className="justify-center m-1"><input type="checkbox" checked={isChecked}  className="checkbox checkbox-xs" onChange={(e) => handelShare(e.target.checked)}  /> readOnly
 </div>
 <div className="justify-center m-1" ><input type="checkbox"   checked="checked" className="checkbox checkbox-xs"  /> secure</div>
</div>

</div>
</div>) : "" }

</div></div>
  ) : (<Loader />)
}
</div>
  );
};

export default Editor;
