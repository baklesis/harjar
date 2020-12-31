import Card from '../../../card.js'

const template = `
  <card>
    <h5 class='pt-4 px-1' style='text-align: center;'>Cache Directives Αποκρίσεων</h5>
    <div style="height:460px"><canvas id="pie" class='p-3'></canvas></div>
  </card>
`
export default {
  components: {
    'card': Card,
  },
  template,
  data () {
    return {
      histogram_config: {
        type: 'pie',
        data: {
          labels: ['public','private', 'no-cache', 'no-store'],
          datasets: [{
            label: '%',
            data: [50, 20, 15, 15],
            backgroundColor: ["#FF6666", '#87CEFA', "#FFFF66", "#9DE24F", "#FFBD55", "#CC99FF"],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
             display: true
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                return data.labels[tooltipItem.index]+": "+data.datasets[0].data[tooltipItem.index]+"%"
              }
            }
          }
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
    }
  },
  mounted() {
  this.createChart('pie', this.histogram_config);
  }
}
