import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "../services/Firebase.tsx";
import { IoMdAdd } from "react-icons/io";

import { useNavigate, Link } from "react-router-dom";
import Loader from "../Components/Loader.tsx";
import TaskContainer from "../Components/TaskContainer.tsx";
import { toast } from "react-hot-toast";
import ToolBar from "../Components/ToolBar"

const Dashboard = () => {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState<any[]>([]); // Ensuring it's an array

  // Handle User Authentication
  useEffect(() => {
    const subs = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        toast.error("No Account Found");
        navigate("/auth");
      }
    });

    return () => subs();
  }, [navigate]);

  // Function to Load Tasks
  async function LoadData() {
    if (!User) {
      toast.error("No user found");
      return;
    }

    try {
      const Ref = collection(db, User.email);
      const queryData = await getDocs(Ref);
      const data = queryData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks.");
    }
  }

  // Fetch data when User changes
  useEffect(() => {
    if (User) {
      LoadData();
    }
  }, [User]);

  if (loading) return <Loader />;

  return (
    <>
      {User ? (
        <div className="w-full flex flex-col justify-center flex-wrap">
        <ToolBar/>
<div className="ml-2 flex flex-wrap mt-[20px] justify-center">
 {Data.length > 0 ? (
    Data.map((doc) => {
return (
<div key={doc.id} ><TaskContainer docCreateId={doc.id} docLab={doc.lab} docId={doc.task} key={doc.id} title={doc.task || "Untitled"} docTask={doc.task?.replace(" ", "") || "Untitled"} time={doc.createdAt?.toDate().toLocaleString().split(",")[0] || "Unknown Time"}/></div>)
    })
          ) : (
            <div className="flex mt-[40px] justify-center w-full text-center ">
              <p>No tasks found.</p>
                <Link className="mt-1" to="/new">              Create              </Link>
            </div>
          )}
</div>
    
  <Link to="/new">  <button className="btn btn-circle btn-secondary-content fixed bottom-[120px] text-gray-600 right-10" ><IoMdAdd size={24} /></button></Link>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Dashboard;
