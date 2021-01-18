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
      <div class = 'px-2 pb-3 overflow-auto' style='height: calc(100vh - 340px)'>
        <canvas id="barChart" width="200px" height="150px"></canvas>
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
          //responsive: false,
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
          data: [25, 19, 12, 8, 5, 3],
          backgroundColor:
            'rgba(255, 159, 64, 0.9)',
          borderWidth: 0
        }]
      },
      code_data:{
        labels:['This','is','a','test'],
        datasets:[{
          data: [2,3,4,5],
          minBarLength: 20,
          backgroundColor:
            'rgba(64, 159, 255, 0.9)',
          borderWidth: 0,

        }]
      },
      myChart: null,
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
    //var data_copy = Object.assign({},this.current_data);
    this.myChart = new Chart(document.getElementById('barChart'), {
        type: this.chart_config.type,
        data: this.current_data,
        options: this.chart_config.options,
        plugins: this.chart_config.plugins,
      });
    var incoming = '{ "method":{"GET":25,"POST":50,"HEAD":3,"DELETE":2},"code":{ "This":1, "is":3, "a":2, "test":4 } }';
    var imported = JSON.parse(incoming);
    var sorted = this.sortNestedJSON(imported);

    this.method_data.labels = sorted[0].map(function(value,index) {return value[0];});
    this.method_data.datasets[0].data = sorted[0].map(function(value,index) {return value[1];});

    this.code_data.labels = sorted[1].map(function(value,index) {return value[0];});
    this.code_data.datasets[0].data = sorted[1].map(function(value,index) {return value[1];});

    /*var max = Object.keys(incoming).reduce(function(max,key){
  return (max === undefined || incoming[key] > incoming[max]) ? +key : max;
});
    outgoing[max] = incoming[max];
    incoming.remove(max);
*/
  },
  updated()
  {
    //console.log(this.current_data);
    this.myChart.data = this.current_data;
    /*
   while(this.myChart.data.labels.length!=0){
      console.log("He");
      this.myChart.data.labels.pop();
      this.myChart.data.datasets[0].data.pop();
    }*/
    /* console.log(this.current_data);
   // console.log(this.myChart.data.datasets[0].data);
    this.myChart.data.labels.push(this.current_data.labels);
    this.myChart.data.labels=this.myChart.data.labels.flat();
    //console.log(this.myChart.data.labels);
    this.myChart.data.datasets[0].data.push(this.current_data.datasets[0].data);
    this.myChart.data.datasets[0].data=this.myChart.data.datasets[0].data.flat();
   // console.log(this.myChart.data.datasets[0].data);
  //console.log(this.myChart.data.labels);*/
    this.myChart.update();
  }
}
