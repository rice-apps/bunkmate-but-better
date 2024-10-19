import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://lxuhpiqretvrbzrykivo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dWhwaXFyZXR2cmJ6cnlraXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNTQ3NzYsImV4cCI6MjA0MzczMDc3Nn0.1nfWkTF50mNp82kK3-2pRHrvqI7iB2r-7GvNAKbkTR0");

export async function addTodo(title, description) {
  const { data, error } = await supabase
    .from('met_todos')
    .insert([{ title, description }]);

  console.log('Added todo:', data);
}


// function App() {
//   const [todos, setTodos] = useState([]);
//   const [description, setDescription] = useState('')

//   useEffect(() => {
//     getToDos();
//   }, []);

//   return (
//     <ul>
//       {todos.map((todo) => (
//         <li key={todo.name}>{todo.name}</li>
//       ))}
//     </ul>
//   );
// }

// export default App;