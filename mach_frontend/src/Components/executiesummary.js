import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../others/Navbar';
import '../styles/executive.css'
import 'chart.js/auto';

Chart.register(ArcElement, Tooltip, Legend);
function ExecutiveSummary(){
  
 
     const data = {
       labels: [
         'Skill A',
         'Skill B',
         'Skill C',
         'Skill D',
         'Skill E',
         'Skill F',
         'Skill G',
         'Skill H'
       ],
       datasets: [{
         data: [1421, 920, 753, 608, 540, 430, 320, 290],
         backgroundColor: [
           '#FF6384',
           '#36A2EB',
           '#FFCE56',
           '#4BC0C0',
           '#9966FF',
           '#FF9F40',
           '#C9CBCF',
           '#FF6699'
         ],
         hoverBackgroundColor: [
           '#FF6384',
           '#36A2EB',
           '#FFCE56',
           '#4BC0C0',
           '#9966FF',
           '#FF9F40',
           '#C9CBCF',
           '#FF6699'
         ]
       }]
     };
     const options = {
      plugins: {
        datalabels: {
          formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = (value / total * 100).toFixed(2) + '%';
            return `${label}: ${percentage}`;
          },
          color: '#fff',
          font: {
            weight: 'bold'
          }
        }
      }
    };
   
     return (
      <div className='executive-summary'>
         <Navbar/>
         <h1>ExecutiveSummary</h1>
       <div className="sum-chart-container">
         <Pie data={data} options={options} />
       </div>
       </div>
     );
   };
   

   


   export default ExecutiveSummary;