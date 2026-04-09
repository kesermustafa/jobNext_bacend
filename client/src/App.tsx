import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Footer from "./components/Footer.tsx";


const App = () => {
    return (

        <BrowserRouter>
            <div className={'flex flex-col min-h-screen'}>
                <Header/>

                <div className={'flex-1 mx-auto w-full'}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>

                </div>

                <Footer/>
            </div>


        </BrowserRouter>

    );
};

export default App;