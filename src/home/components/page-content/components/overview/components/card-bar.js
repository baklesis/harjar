import Card from '../../card.js'

const template = `
  <card style='100%'>
    <b-row class='pt-3'>
      <h5 class="px-4 text-muted" style='float:left'>Αριθμός εγγραφών</h5>
      <b-col>
      <b-form-group style='float:right'>
          <b-form-radio-group size="sm"
            id="btn-radios-1"
            v-model="selected"
            :options="options"
            name="radios-btn-default"
            buttons
          ></b-form-radio-group>
      </b-form-group>
    </b-col>
    </b-row>
    <b-row>
      <b-col>
      <div class = 'pl-2 pr-4 pb-3 overflow-auto' style='height: calc(100vh - 340px)'>
        <div style='height: 100%'><canvas id="barChart"></canvas></div>
      </div>
    </b-col>
    </b-row>
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
      selected:'method',
      options: [
          { text: 'Μέθοδος αίτησης', value: 'method' },
          { text: 'Κωδικός απόκρισης', value: 'code' }
          ],
      chart_config: {
        type: 'horizontalBar',
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend:{
            display: false
          },
            scales: {
                yAxes: [{
                  barThickness: 15,
                    gridLines: {
                      display: false
                    },
                    ticks:{
                      padding:10,
                      beginAtZero: true
                    }
                }],
                xAxes: [{
                  display: false,
                  gridLines: {
                      display: false
                    },
                    ticks:
                    {
                      beginAtZero: true
                    }
                }]
            },
            cornerRadius: 10
        }
      },
      method_data:{
        labels: ['GET', 'POST', 'CONNECT', 'HEAD', 'PUT', 'DELETE'],
        datasets: [{
          data: [],
          backgroundColor:
            'rgba(255, 159, 64, 0.9)',
          borderWidth: 0
        }]
      },
      code_data:{
        labels:[],
        datasets:[{
          data: [],
          minBarLength: 20,
          backgroundColor:
            'rgba(64, 159, 255, 0.9)',
          borderWidth: 0,

        }]
      },
      myChart: null,
      status_codes: {
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Found',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '306': 'Unused',
        '307': 'Temporary Redirect',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Timeout',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Required',
        '413': 'Request Entry Too Large',
        '414': 'Request-URI Too Long',
        '415': 'Unsupported Media Type',
        '416': 'Requested Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Timeout',
        '505': 'HTTP Version Not Supported'
      }
    }
  },
  computed:{
    current_data: function () {
      return (this.selected == 'method') ? this.method_data : this.code_data;
    }
  },
  methods: {
    sortNestedJSON(parsedJSON)
    {
      var sorted_arrays = [];
      console.log(Object.entries(parsedJSON)) // Unsupported in IE 11
      for(const [key,value] of Object.entries(parsedJSON))
      {
        var edit_array = [];
        console.log(value);
        for (a in value)
        {
          edit_array.push([a,value[a]])
        }
        edit_array.sort(function(a,b){return b[1]- a[1]});
        console.log(edit_array);
        sorted_arrays.push(edit_array);
      }
      console.log(sorted_arrays);
      return sorted_arrays;
    }
  },
  mounted() {
    this.myChart = new Chart(document.getElementById('barChart'), {
        type: this.chart_config.type,
        data: this.current_data,
        options: this.chart_config.options,
        plugins: this.chart_config.plugins,
      })
    axios.get("./php/get_card_bar.php").then((response)=>{
      // sort data
      var sorted = this.sortNestedJSON(response.data);
      // load method chart data
      let status_codes = this.status_codes
      this.method_data.labels = sorted[0].map(function(value,index) {return value[0];});
      this.method_data.datasets[0].data = sorted[0].map(function(value,index) {return value[1];});
      // load code chart data
      this.code_data.labels = sorted[1].map(function(value,index) {return value[0]+": "+status_codes[value[0]];});
      this.code_data.datasets[0].data = sorted[1].map(function(value,index) {return value[1];});
      // update chart
      this.myChart.update();
    })

  },
  updated()
  {
    this.myChart.data = this.current_data;
    this.myChart.update();
  }
}
