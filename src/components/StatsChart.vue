<template>
    <div>
      <div>
        <canvas id="myChart" width="400" height="200"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  
  export default {
    extends: Bar,
    props: ['sortedItems'],
    mounted() {
      this.renderChart(
        {
          labels: this.sortedItems.map(item => item.name),
          datasets: [
            {
              label: 'Quantity',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: this.sortedItems.map(item => item.quantity)
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      );
    }
  };
  </script>
  