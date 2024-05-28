import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import "./style.scss";
import axios from "axios";

const Login = () => {




  const [formData, setFormData] = useState({
    govtId: "",
    password: "",
    role: ""
  });

  const [userRoles, setUserRoles] = useState([
    { value: "Admin", label: "Admin", name: "role" },
    { value: "Community", label: "Community", name: "role" },
    { value: "Voter", label: "Voter", name: "role" }
  ]);



  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (e) => {
    console.log(e);
    setFormData({ ...formData, [e.name]: e.value });
  };


  const handleValidation = () => {
    const { govtId, password } = formData;
    if (!govtId) {
      toast.error("govtId is required", { duration: 1000 });
      return false;
    } else if (!password) {
      toast.error("Password is required", { duration: 1000 });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      
      if(formData.role === "Voter"){
        await axios.post("http://localhost:6001/user-login", formData).then(
          (res) => {
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('govtId', res.data.govtId);
            localStorage.setItem('organization', res.data.organization);
            toast.success("Registered Successfully");
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }
        ).catch((err) => {
          toast.error("Registration Failed")
        }
        )
      }

      else  if(formData.role === "Community"){
        await axios.post("http://localhost:6001/organization-login", formData).then(
          (res) => {
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('govtId', res.data.govtId);
            toast.success("Registered Successfully");
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }
        ).catch((err) => {
          toast.error("Registration Failed")
        }
        )
      }

      else  if(formData.role === "Admin"){
        await axios.post("http://localhost:6001/admin-login", formData).then(
          (res) => {
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('govtId', res.data.govtId);
            toast.success("Registered Successfully");
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }
        ).catch((err) => {
          toast.error("Registration Failed")
        }
        )
      }

      
    }
  };

  return (
    <>
      <div className="loginContainer">
        <form onSubmit={handleSubmit} className="LoginForm">
          <div className="heading">
            <h1>Login</h1>
            <CgProfile />
          </div>


          <div className="inputContainer">
            <label htmlFor="govtId">GovtId</label>
            <input
              onChange={handleChange}
              value={formData.govtId}
              placeholder="Enter your GovtId"
              type="govtId"
              id="govtId"
              name="govtId"
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter your password"
              type={showPass ? "text" : "password"}
              id="password"
              name="password"
            />
          </div>

          <div className="checkboxContainer">
            <input
              onChange={() => setShowPass(!showPass)}
              id="checkbox"
              type="checkbox"
            />
            <label htmlFor="checkbox">Show Password</label>
          </div>

          <div className="selectContainer">
            <label>User Role</label>
            <Select
              onChange={handleSelect}
              placeholder="Select your Role"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: "none",
                  fontSize: "14px",
                }),
              }}
              options={userRoles}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
        <p>
          Don't have an account?
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Login;
