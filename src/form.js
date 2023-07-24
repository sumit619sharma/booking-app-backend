import React, { useEffect, useState } from 'react';
import './form.css' // Make sure to create a CSS file for styling
import axios from 'axios';
let ID=null;
const Form = () => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
  });
  const [userList,setUserList] = useState([]);
  const [isEdit,setIsEdit] = useState(false);

  const [errors, setErrors] = useState({});

const postUser =async (data)=>{
  const resp= await  axios.post('http://localhost:3000/user/add-user',{
        name: data.username,
        email: data.email,
        contact: data.phone,
    })
    console.log("reactjs axios add user==resp",resp.data.message);
}

const updateUser =async (data)=>{
    const resp= await  axios.put('http://localhost:3000/user/add-user',{
    id: ID,      
    name: data.username,
          email: data.email,
          contact: data.phone,
      })
      console.log("reactjs axios add user==resp",resp.data.message);
  }

const getUser =async ( ) =>{
   const resp = await axios.get('http://localhost:3000/user/add-user');
console.log("get user list==",resp);
   setUserList(resp.data);
}


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    // Simple validation - check for required fields
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    // If there are errors, display them and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission - you can add your logic here
    // For this example, we'll just log the form data
    console.log('Form data:', formData);

    if(isEdit){
        await updateUser(formData);
        await getUser()
        setIsEdit(false);
       setFormData({
            username: '',
            phone: '',
            email: '',
          });

        return;
    }
    
    const resp = await postUser(formData)
    const getResp = await getUser();

    // Clear form fields after submission
    setFormData({
      username: '',
      phone: '',
      email: '',
    });

    // Clear errors after submission
    setErrors({});
  };

  const editHandler = (id) =>{
    ID=id;
   const editUser =  userList.find((curr)=> {return curr.id===id})
   console.log("got edit user==",editUser)
   setFormData({
    username: editUser.name,
    phone: editUser.contact,
    email: editUser.email,
   })
   setIsEdit(true);
  }

const deleteHandler = async (id)=>{
   await axios.delete(`http://localhost:3000/user/delete/${id}`)
  await getUser();
}

useEffect(()=>{
 getUser();
},[])


  return (
    <div className="form-container">
      <h2>Booking-App</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <button type="submit"> {isEdit? 'Update': 'Submit'} </button>
      </form>
   <div>
    {userList.length>0 && 
    userList.map((curUser)=>{
        return (
            <div key={curUser.id} >  <li>  {curUser.name} -- {curUser.email} -- {curUser.contact} 
             <button onClick={ ()=>{deleteHandler(curUser.id)} } >Delete</button>
              <button onClick={ ()=>{editHandler(curUser.id)} } >Edit</button> </li></div>
        )
    })
    }
   </div>

    </div>
  );
};

export default Form;
