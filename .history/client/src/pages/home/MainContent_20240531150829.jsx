import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './MainContent.css';

const MainContent = () => {
  const [distribution, setDistribution] = useState({
    "Not cleaned": 0,
    "In progress": 0,
    "Cleaned": 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rooms/distribution');
        const data = await response.json();
        setDistribution(data);
      } catch (error) {
        console.error('Error fetching room distribution data:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ['Not cleaned', 'In progress', 'Cleaned'],
    datasets: [{
      data: [distribution["Not cleaned"], distribution["In progress"], distribution["Cleaned"]],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  return (
    <main className='body'>
      <div className="head-title">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li>
              <a className="active" href="#">Home</a>
            </li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download'></i>
          <span className="text">Download PDF</span>
        </a>
      </div>

      <ul className="box-info">
        <li>
          <i className='bx bxs-calendar-check'></i>
          <span className="text">
            <h3>1020</h3>
            <p>New Order</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-group'></i>
          <span className="text">
            <h3>2834</h3>
            <p>Visitors</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-dollar-circle'></i>
          <span className="text">
            <h3>$2543</h3>
            <p>Total Sales</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recent Orders</h3>
            <i className='bx bx-search'></i>
            <i className='bx bx-filter'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Date Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="img/people.png" alt="user" />
                  <p>John Doe</p>
                </td>
                <td>01-10-2021</td>
                <td><span className="status completed">Completed</span></td>
              </tr>
              <tr>
                <td>
                  <img src="img/people.png" alt="user" />
                  <p>John Doe</p>
                </td>
                <td>01-10-2021</td>
                <td><span className="status pending">Pending</span></td>
              </tr>
              <tr>
                <td>
                  <img src="img/people.png" alt="user" />
                  <p>John Doe</p>
                </td>
                <td>01-10-2021</td>
                <td><span className="status process">Process</span></td>
              </tr>
              <tr>
                <td>
                  <img src="img/people.png" alt="user" />
                  <p>John Doe</p>
                </td>
                <td>01-10-2021</td>
                <td><span className="status pending">Pending</span></td>
              </tr>
              <tr>
                <td>
                  <img src="img/people.png" alt="user" />
                  <p>John Doe</p>
                </td>
                <td>01-10-2021</td>
                <td><span className="status completed">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="todo">
          <div className="head">
            <h3>Todos</h3>
            <i className='bx bx-plus' ></i>
            <i className='bx bx-filter' ></i>
          </div>
          <ul className="todo-list">
            <li className="completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="not-completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="not-completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
          </ul>
        </div>
      </div>

      <div className="chart-container">
        <h3>Room States Distribution</h3>
        <Doughnut data={data} />
      </div>
    </main>
  );
};

export default MainContent;
