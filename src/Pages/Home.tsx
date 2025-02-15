import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader.tsx";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading for 1 second
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader /> // Use your Loader component instead of plain text
      ) : (
        <div>
          <h3 className="w-full text-center h-[30px] flex justify-center items-center mt-[60px] font-extrabold text-blue-600 text-4xl">
            Create New
          </h3>
          <h3 className="w-full text-center h-[30px] flex justify-center items-center mt-[10px] font-extrabold text-secondary text-4xl">
            Task
          </h3>
          
          <div className="w-full flex items-center justify-center mt-[20px]">
            <Link to="/new">
              <button className="btn btn-primary text-center flex justify-center items-center mt-[10px] font-extrabold">
                Create
              </button>
            </Link>
          </div>

          <div className="w-full flex items-center justify-center mt-[20px]">
            <Link to="/Dashboard">
              <button className="btn btn-primary text-center flex justify-center items-center mt-[10px] font-extrabold">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
