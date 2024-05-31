import React from 'react';
import Sidebar from '../../components/sidebar/side';
import Navbar from '../../components/navbar/Navbar';
import MainContentC from './MainContentC';
import './newhome.css';

const NewHomeC = () => {
  return (
    <div className="App">
      <Sidebar />
      <section className="contents">
        <Navbar />
        <MainContentC />
      </section>
    </div>
  );
};

export default NewHomeC;
