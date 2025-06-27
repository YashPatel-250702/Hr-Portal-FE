import About from "./About";
import Blog from "./Blogs";
import Contact from "./Contact";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";

export default function Home() {
  return (
    <div>
      <Header />
      <div id="hero"><Hero /></div>
      <div id="about"><About /></div>
      <div id="blogs"><Blog /></div>
      <div id="contact"><Contact /></div>
      <div id="footer"><Footer /></div>
    </div>
  );
}
