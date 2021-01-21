import Card from '../../../card.js'

const template = `
  <card style="height: calc(100vh - 110px); max-height:720px ">
    <h5 class='pt-4 px-1 text-muted' style='text-align: center;'>Μέσος Χρόνος Απόκρισης Αιτήσεων</h5>
    <canvas id="graph" class='px-3' style='padding-top: 10%; padding-bottom: 10%'></canvas>
  </card>
`
export default {
  components: {
    'card': Card,
  },
  template,
  data () {
    return {
      config: {
        type: 'line',
        data: {
          labels: ['00:00','01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
          datasets: [{
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            backgroundColor: ['#87CEFA'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    suggestedMin: 0
                }
            }]
          },
          legend: {
             display: false
          },
          tooltips: {
            callbacks: {
              title: function(tooltipItem, data){
                return "Ώρα: "+tooltipItem[0].xLabel
              },
              label: function(tooltipItem, data) {
                return "Μέσος Χρόνος Απόκρισης: "+data.datasets[0].data[tooltipItem.index]+" ms"
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
    },
    loadData() {
      //get data for graph
      axios.post('./php/get_graph.php',this.$parent.request_saved_filters)
      .then((response)=>{
        this.config.data.datasets[0].data = response.data
        this.graph.update()
      })
      .catch(function (error) {
          console.log(error);
      })
    }
  },
  mounted() {
    // reset saved filters
    this.$parent.request_saved_filters.content_types = []
    this.$parent.request_saved_filters.days = []
    this.$parent.request_saved_filters.providers = []
    this.$parent.request_saved_filters.http_methods = []
    // create chart
    this.graph = this.createChart('graph', this.config);
    // load data in graph
    this.loadData()
  }
}
