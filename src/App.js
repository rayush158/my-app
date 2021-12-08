import react from "react";
import { useState , useEffect  } from "react";
import {BrowserRouter as Router ,Routes, Route } from "react-router-dom"
import Footer from "./Components/Footer";
import AddTask from "./Components/AddTask";
import Header from "./Components/Header";
import Tasks from "./Components/Tasks";
import About from "./Components/About";

const  App=()=> {
  const [showAddTask , setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([]);

  //use Effect 
  useEffect(()=>{
    const getTasks = async () =>{
     const taskFromServer = await fetchTasks()
     setTasks(taskFromServer)
    }
    getTasks()
  }, [])

  // fetch tasks
var  url = 'http://localhost:5000/tasks'
  const fetchTasks = async () =>{
     const res = await fetch(url)
     const data = await res.json()
     return data
  } 
  
  // Fetch task
  const fetchTask = async (id) =>{
     const res = await fetch(`http://localhost:5000/tasks/${id}`)
     const data = await res.json()
     return data
  } 


  // Add Task 
  const addTask = async (task) =>{

     const res = await fetch(url, {
       method: 'POST',
       headers:{
         'Content-type': 'application/json'
       }, 
       body: JSON.stringify(task),
     })


     const data = await res.json()
     setTasks([...tasks , data])
    }
//     const id = Math.floor(Math.random()*100) + 1;
//  const newTask = {id, ...task}
  
  

  // Delete Task
  const deleteTask = async (id) => {
       
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })


    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle Reminder
  const toggleReminder = async (id) => {

  const taskToToggle = await fetchTask(id)
  const updTask = {...taskToToggle, 
  reminder: !taskToToggle.reminder}  
  
  const res  = await fetch(`http://localhost:5000/tasks/${id}`,{
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    
    },
    body: JSON.stringify(updTask)

  })
  const data = await res.json()


  setTasks(tasks.map((task)=> 
  task.id === id ? {...task , reminder:
     data.reminder} : task))
  };

  return (
    <Router>
    
    <div className="container">
      <Header title="Task Tracker"
      onAdd ={()=>setShowAddTask(!showAddTask)}
      showAdd={showAddTask}
      />
      <Routes>
      <Route path="/"
      element ={<> 
        { showAddTask && <AddTask onAdd={addTask}
        />}
        {tasks.length > 0 ? (
          <Tasks tasks={tasks} 
          onDelete={deleteTask} 
          onToggle={toggleReminder} 
          />
        ) : (
          <h2>No Task To Show</h2>
  
        )}
        </>}

      />
      <Route path ="/about" element ={<About/>}/>
      </Routes>
      <Footer />
    </div>
  
    </Router>
  );
}

export default App;
