
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";
import Switch from "react-switch";

const BASE_URL = "./api/";
const URL_REGISTER = BASE_URL + "rest_register.php";
const URL_MESSAGES = BASE_URL + "rest_get_messages.php";

function App() {

  //App valitsee kahdesta näkymästä togglen avulla

  const [selection, setSelection] = useState(false);

  return (
    <div>
      <Switch onChange={checked => setSelection(checked)} checked={selection} />
      {selection ? <RegisterUser /> : <Messages />}
    </div>
  );
}

/**
 * Komponentti rekisteröi käyttäjän lomaketietojan perusteella
 */
function RegisterUser() {

  const { register, handleSubmit } = useForm();
  const [msg, setMsg] = useState("");

  function onSubmit(data) {
    axios.post(URL_REGISTER, data)
      .then(resp => {
        setMsg(data.uname + " registered successfully!");
      })
      .catch(error => {
        setMsg("Error in registering: " + error.message);
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:
          <input {...register("fullname")} />
        </label>
        <label>
          Username:
          <input {...register("uname")} />
        </label>
        <label>
          Password:
          <input {...register("pw")} type="password" />
        </label>
        <button type="submit">OK</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

/**
 * Komponentti hakee ja näyttää annetun käyttäjänimen viestit
 */
function Messages() {
  const { register, handleSubmit } = useForm();
  const [messages, setMessages] = useState([]);

  function onSubmit(data) {
    axios.get(URL_MESSAGES, { params: { uname: data.uname } })
      .then(resp => {
        setMessages(resp.data)
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username:
          <input {...register("uname")} />
        </label>
        <button type="submit">OK</button>
      </form>
      <ul>
        {messages.map(element => <li>{element}</li>)}
      </ul>
    </div>
  )
}

export default App;
