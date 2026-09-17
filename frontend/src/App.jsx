import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentRegistration from './components/StudentRegistration';
import StudentList from './components/StudentList';
import EditStudent from './components/EditStudent';
function App() {

    return (

        <BrowserRouter>

           <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/register-student" element={<StudentRegistration />} />
    <Route path="/students" element={<StudentList />} />
    <Route path="*" element={<Login />} />
    <Route
    path="/edit-student/:id"
    element={<EditStudent />}
/>
</Routes>

        </BrowserRouter>
    );
}

export default App;