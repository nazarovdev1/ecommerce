import React from 'react';
import Hero from '../components/Hero';
import NewCollection from '../components/NewCollection';
import Bestsellers from '../components/Bestsellers';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Hero />
      <NewCollection />
      <Bestsellers />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
