import React from "react";
import "./Auth.css";

// Loader
import Loader from "../Components/Loader.tsx";

// Firebase
import { app } from "../services/Firebase";
import { Toaster, toast } from "react-hot-toast";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Routes
import { Link, useNavigate } from "react-router-dom";

// Icons
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";

const Auth = ({ type }) => {
  const [currentRoute, setCurrentRoute] = React.useState(null);
  const [nextRoute, setNextRoute] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [User, setUser] = React.useState(null);
  const Form = React.useRef();
  const Navigate = useNavigate();
  const auth = getAuth(app);

  const AuthOptions = [
    { id: 1, title: "Continue with Google", logo: "Google" },
    { id: 2, title: "Continue with Github", logo: "Github" },
  ];

  React.useEffect(() => {
    const next = type === "signup" ? "signin" : "signup";
    setCurrentRoute(type);
    setNextRoute(next);
  }, [type]);

 React.useEffect(() => {
   
const sub = onAuthStateChanged(auth, (user) => {
  setUser(user);
  if (!user) {
    setUser(null)
  }
  setIsLoading(false);
})

return () => sub()
 }, [auth])

  async function GooglePopUp() {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        setUser(user);
        toast.success("Login successfully");
        Navigate("/dashboard")
      }
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function GitHubPopUp() {
    const provider = new GithubAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        toast.success("Login successfully");
        setUser(user);
        Navigate(`/dashboard`)
      }
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    const form = Form.current;
    const formData = new FormData(form);
    let newData = {};
    formData.forEach((value, key) => {
      newData[key] = value;
    });

    const email = newData.email;
    const pass = newData.password;

    try {
      if (currentRoute === "signup") {
        // Login existing user
        try {
          const u = await signInWithEmailAndPassword(auth, email, pass);
        setUser(u.user);
        toast.success("Login successfully!");
        Navigate(`/dashboard`)
        } catch (e) {
          toast.success(e.message)
        }
      } else {
        // Register new user
        const u = await createUserWithEmailAndPassword(auth, email, pass);
        setUser(u.user);
        toast.success("Account created successfully!");
        Navigate(`/dashboard`)
      }
    } catch (e) {
      console.log(e);
      if (e.message.includes("email-already-in-use")) {
        return toast.error("User with this email found");
      } else if (e.message.includes("Password should be at least 6 characters")) {
        return toast.error("Password length must be 6 or more");
      }
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleSignOut() {
  try {
    await signOut(auth);
    if (!User) {
      toast.success("LogOut successfully")
    }
  } catch (e) {
    toast.error(e.message)
  }
}

  return (
    <>
      <Toaster />
      {isLoading ? (
        <Loader />
      ) : User ? (
        <>
       <div className="Auth">
         <h3>{User.email}</h3>
         <button className="button-22" onClick={() => handleSignOut()}>Log out</button>
       </div>
        </>
      ) : (
        <div className="Auth">
          <h4>{nextRoute === "signin" ? "Login" : "Create an EmailPlus account"}</h4>
          <div className="Auth-container">
            <form ref={Form} onSubmit={handleFormSubmit} id="form">
              <input id="Email" name="email" placeholder="Email" required />
              <input type="password" id="password" name="password" placeholder="Password" required />
              <button type="submit">
                {nextRoute === "signin" ? "Login" : "Create Account"}
              </button>

              <p className="Navigator">
                {nextRoute === "signup" ? (
                  <>
                    New on EmailPlus? <Link to={`/auth/${nextRoute}`}>{nextRoute}</Link>
                  </>
                ) : (
                  <>
                    Already have an account? <Link to={`/api/auth/${nextRoute}`}>{nextRoute}</Link>
                  </>
                )}
              </p>
            </form>

            <p>or</p>

            <div className="Auth_Btns">
              {AuthOptions.map((auth) => (
                <button key={auth.id} onClick={() => (auth.id === 1 ? GooglePopUp() : GitHubPopUp())}>
                  {auth.id === 1 ? <FcGoogle size={24} /> : <VscGithubInverted size={24} />} {auth.title}
                </button>
              ))}
            </div>
          </div>

          <p className="policy">
            By continuing, you agree to EmailPlus's <span>Terms of Service and Privacy Policy</span>
          </p>
        </div>
      )}
    </>
  );
};

export default Auth;
