import Recommended from "../pages/home/Recommended";
import Slider from "../pages/home/Slider";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePosts from "../pages/home/Posts";


function Home(props) { 
  return ( 
    <> 
       <Slider/>
        <Recommended />
       <HomePosts/>
    </> 
  ); 
} 
export default Home; 