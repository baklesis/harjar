import Card from '../card.js'

const template = `
  <card>
    <canvas id="barChart" width="200" height="120"></canvas>
  </card>
`
export default {
  components: {
    'card': Card,
  },
  template,
  props: ['title','subtitle','value','icon'],
  data () {
    return {
      chart_config: {
        type: 'horizontalBar',
        data: {
            labels: ['GET', 'POST', 'CONNECT', 'HEAD', 'PUT', 'DELETE'],
            datasets: [{
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor:
                    'rgba(255, 159, 64, 0.9)',
                borderWidth: 0
            }]
        },
        options: {
          //responsive: false,
          legend:{
            display: false
          },
            scales: {
                yAxes: [{
                  barThickness: 10,
                    gridLines: {
                      display: false
                    },
                    ticks:{
                      padding:10
                    }
                }],
                xAxes: [{
                  display: false,
                  gridLines: {
                      display: false
                    }
                }]
            },
            cornerRadius: 10
        }
      },
    }
  },
  methods: {
    createChart(id, config) {
      const ctx = document.getElementById(id);
      const myChart = new Chart(ctx, {
        type: config.type,
        data: config.data,
        options: config.options,
      });
      var dataArray = myChart.data.datasets[0].data;
      console.log(dataArray);
      myChart.data.datasets[0].data = dataIndexes;
      myChart.update();
      console.log("Chart made!");
    }
  },
  mounted() {
  this.createChart('barChart', this.chart_config);
  }
}