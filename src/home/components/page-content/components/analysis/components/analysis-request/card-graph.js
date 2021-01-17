import Card from '../../../card.js'

const template = `
  <card style="height: calc(100vh - 110px); max-height:720px ">
    <h5 class='pt-4 px-1 text-muted' style='text-align: center;'>Μέσος Χρόνος Απόκρισης Αιτήσεων</h5>
    <canvas id="histogram" class='px-3' style='padding-top: 10%; padding-bottom: 10%'></canvas>
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
        type: 'line',
        data: {
          labels: ['00:00','01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
          datasets: [{
            label: '',
            data: [19, 28, 20, 16, 43, 56, 12, 39, 44, 34, 19, 28, 20, 16, 43, 56, 12, 39, 44, 34, 19, 28, 20, 16],
            backgroundColor: ['#87CEFA'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
             display: false
          },
          tooltips: {
            callbacks: {
              title: function(tooltipItem, data){
                return "Ώρα: "+tooltipItem[0].xLabel
              },
              label: function(tooltipItem, data) {
                return "Μέσος Χρόνος Απόκρισης: "+data.datasets[0].data[tooltipItem.index]
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
  this.createChart('histogram', this.histogram_config);
  }
}
