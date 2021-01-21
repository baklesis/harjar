import Card from '../../../card.js'

const template = `
  <card>
    <h5 class='pt-4 px-1 text-muted' style='text-align: center;'>Cacheability Directives Αποκρίσεων</h5>
    <div style="height:460px"><canvas id="polar" class='p-3'></canvas></div>
  </card>
`
export default {
  components: {
    'card': Card,
  },
  template,
  data () {
    return {
      polar: null,
      config: {
        type: 'polarArea',
        data: {
          labels: ['public','private', 'no-cache', 'no-store'],
          datasets: [{
            label: '%',
            data: [0,0,0,0],
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
      return new Chart(ctx, {
        type: config.type,
        data: config.data,
        options: config.options,
      });
    }
  },
  mounted() {
  this.polar = this.createChart('polar', this.config);
  }
}
