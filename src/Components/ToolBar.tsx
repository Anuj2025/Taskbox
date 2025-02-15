import React from 'react'

// firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { app } from "../services/Firebase.tsx";

// toast
import {toast} from "react-hot-toast"

const ToolBar = () => {
  const auth = getAuth(app)
  const db = getFirestore(app)
  const [user, setUser] = React.useState();
  
  // fecthing user 
  React.useEffect(() => {
    const subs = onAuthStateChanged(auth, (u) => {
      setUser(u);
    })
    
  return () => subs()
  }, [auth])
  
  async function handleDeletion() {
    try {
      const ref = collection(db, user.email);
      const Docs = await getDocs(ref);
    const isTrue =  confirm("are tou sure? ")
    if (isTrue) {
      Docs.forEach( async (docu) => {
        if (!docu.data().task) {
        return toast.error("unable to found documents")
      }
        await deleteDoc(doc(db, user.email, docu.data().task))
        toast("deleted")
      window.location.reload()
      })
    } else {
      toast("opration canceled")
    }
      
    } catch (e) {
      toast.error(e.message)
    }
  }
  async function handleAccount() {
    const isDeleting = confirm("Confirm?");
    if (isDeleting) {
      
    }
  }
  return (
<div className="flex gap-2.5 justify-center" >
<button onClick={() => handleDeletion()} className="btn">Delete All</button>
<button onClick={() => handleAccount()} className="btn">Delete<br/>Account</button>
</div>
  )
}

export default ToolBar