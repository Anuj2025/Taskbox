import Input from "../Components/Input.tsx"
import Button from "../Components/Button.tsx"
import Label from "../Components/Labels.tsx"
import React from 'react'
import {toast} from "react-hot-toast"

import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from 'uuid';

import {useNavigate} from "react-router-dom"
import { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, } from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc, query, where } from "firebase/firestore";
import { app } from "../services/Firebase.tsx"

const New = () => {
  
  const [labels, setLabels] = React.useState([]);
  const [Task, setTask] = React.useState("");
  const [User, setUser] = React.useState();
  
  const db = getFirestore(app)
  const auth = getAuth(app)
  const Navigate = useNavigate();
  
  React.useEffect(() => {
    const subs = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Add An Account")
        return Navigate("/auth")
      } else {
        setUser(user);
      }
    })
    
    return () => subs()
  }, [])
  
  let LabelsArry = [
    {
      name: "Workspace",
      id: 1,
    },
    {
      name: "Office",
      id: 2,
    },
    {
     name: "Private",
     id: 3,
    }
    ]
    
  function generateUID(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uid = "";
    for (let i = 0; i < length; i++) {
        uid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return uid;
}
  
 async function handleTask() {
   if(User) {
     try{
      const docRef = doc(db,  User.email, Task);
  
      const document = await setDoc(docRef, {
        createdAt: new Date(),
        lab: labels,
        task: Task,
        id: generateUID(),
      })
      
      Navigate(`/dashboard?doc=${docRef.id}`)
    } catch (e) {
      toast.error(e.message)
    }
   } else {
     toast.error("Pls Create Account Frist")
   }
  }
  return (
<>
 <div className="w-full h-[70vh] align-middle flex flex-col justify-center" >
<div className="flex justify-center flex-col lg:bg-amber-100"> 
  <Input type="text" header="Task" placeholder="Enter Your Task" value={Task} onChange={(e) => setTask(e.target.value)} />
   
   <div className="flex justify-center flex-row flex-wrap m-2">

   {LabelsArry.map((label, index) => {
     return (
<div key={label.id}>
<Label text={label.name} labels={labels} setLabels={setLabels} />
</div>
       )
   })}
   </div>
   
    <div className="flex justify-center align-middle" ><Button click={() => handleTask()} status="false" text="Create Task" /></div>
    </div>
    </div>
</>
  )
}

export default New