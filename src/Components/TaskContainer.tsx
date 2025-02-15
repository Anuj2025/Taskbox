  import React from 'react'
  import {useNavigate} from "react-router-dom"
  import {app} from "../services/Firebase.tsx"
  import {getAuth, onAuthStateChanged} from "firebase/auth"
  import { getFirestore, doc, getDoc, setDoc , deleteDoc, collection} from "firebase/firestore";
  import {toast} from "react-hot-toast"
  
  
  const TaskContainer = ({docCreateId , docLab ,docId, title, docTask, time}) => {
    const Navigate = useNavigate()
    const auth = getAuth(app);
    const db = getFirestore(app)
    const [user, setUser] = React.useState()
    
    React.useEffect(() => {
      const subs = onAuthStateChanged(auth, (u) =>{
        if (u)
        setUser(u);
      })
      
      return () => subs()
    }, [auth])
    
  async function NavigateBtn() {
      
  const client = {
    userAgent: navigator.userAgent.split(" ")[0].split("/")[0],
    platform: navigator.platform.split(" ")[0],
    language: navigator.language,
    online: navigator.onLine,
};

if (!client) {
  return toast.error("Unknown client")
}

const ref = doc(db, user.email, title);

const isIdValid = await getDoc(ref);

if (!isIdValid.exists()) {
  return toast.error("Unknown document")
}

if (!isIdValid.data().id) {
  return toast.error("authorization error")
}

if (!client.platform) {
  return toast.error("unknown error")
}

      Navigate(`/editor/${docTask}?id=${docCreateId}&client=${client.platform}&Agent=${client.userAgent}`);
      
  console.log("You are under secure private place Enjoy")
    }
    
   async function handleDeletion(docId) {
     const docRef = doc(db,  user.email, docId);
     
     try {
       await deleteDoc(docRef);
       toast("delecting "+docRef.id+"...")
       window.location.reload()
     } catch (e) {
       toast.error(e.message)
     }
   }
    
    return (
  <div className="w-[290px] m-1 min-h-[200px] bg-primary text-white p-2 rounded-lg" >
  <h3 className="text-1xl text-primary-content font-medium" >{docCreateId || "No id found"}</h3>
  <div className="btn-nutral backdrop-blur-3xl w-full flex justify-center" >
  <button onClick={() => NavigateBtn()} className="btn mt-[10px] m-2" >Open<span>{docTask}</span></button>
  </div>
  
  <div className="w-auto  h-[50px] bg-base-content justify-between text-center rounded-lg" ><button onClick={() => handleDeletion(docId)} className="btn  glass m-[10px] text-white" >Delete</button><h3 className="float-right relative m-[13px] text-1xl font-medium " >{time}</h3></div>
  <div className="relative float-left p-1.5 bg-base-content m-[11.5px] rounded-lg">{docLab.join(", ")}</div>
      </div>
    )
  }
  
  export default TaskContainer