import React from 'react';
import Sidebar from '../../components/sidebar/side';
import Navbar from '../../components/navbar/Navbar';
import MainContent from './MainContent';
import './newhome.css';

const NewHome = () => {
  return (
    <div className="App">
      <Sidebar />
      <section className="contents">
        <Navbar />
        <MainContent />
      </section>
    </div>
  );
};

export default NewHome;
