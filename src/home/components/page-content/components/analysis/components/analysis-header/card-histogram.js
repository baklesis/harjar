import Card from '../../../card.js'

const template = `
  <card>
    <h5 class='pt-4 px-1' style='text-align: center;'>TTL Ιστοαντικειμένων</h5>
    <div style="height:460px"><canvas id="histogram" class='p-3'></canvas></div>
  </card>
`
export default {
  components: {
    'card': Card,
  },
  template,
  data () {
    return {
      histogram: null,
      config: {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            data: [0,0,0,0,0,0,0,0,0,0],
            backgroundColor: ["#FF6666", '#87CEFA', "#FFFF66", "#9DE24F", "#FFBD55", "#CC99FF","#FF6666", '#87CEFA', "#FFFF66", "#9DE24F", "#FFBD55", "#CC99FF"],
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
                return "TTL: "+tooltipItem[0].xLabel
              },
              label: function(tooltipItem, data) {
                return "Ιστοαντικείμενα: "+data.datasets[0].data[tooltipItem.index]
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
      })
    },
    loadData() {
      axios.post('./php/get_histogram.php',this.$parent.$parent.header_saved_filters)
      .then((response)=>{
        this.config.data.labels = response.data['buckets']
        this.config.data.datasets[0].data = response.data['bucket_vals']
        this.histogram.update()
      })
      .catch(function (error) {
          console.log(error);
      })
    }
  },
  mounted() {
    this.histogram = this.createChart('histogram', this.config);
    this.loadData()
  }
}
