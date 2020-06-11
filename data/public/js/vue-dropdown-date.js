// Define a new component
function VueDropDownDate() {

}
// var moment = require('moment');
VueDropDownDate.date = {
    data: function () {
        return {
            year: moment().format('YYYY'),
            month: moment().format('M'),
            day: moment().format('D'),
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        }
    },
    props: {
        id: {
            default: '',
            type: String,
            required: true
        },
        name: {
            default: '',
            type: String,
            required: true
        },
        className: {
            default: 'vue-dropdown-date',
            type: String
        },
        value: {
            default: '',
            type: String
        },
    },
    created: function(){
        var date = moment(this.value);
        if (date.isValid()){
            this.year = date.format('YYYY');
            this.month = date.format('M');
            this.day = date.format('D');
        } else {
            this.year = '';
            this.month = '';
            this.day = '';
        }
    },
    computed: {
        maxDays: function(){
            var date = moment(this.year+'-'+this.month, 'YYYY-M');
            if(!date.isValid()){
                return 31; // Default to 31 days
            }
            return date.daysInMonth();
        },
        days: function(){
            var days = [];
            for(var i = 0; i < this.maxDays; i++){
                days.push(i+1);
            }
            return days
        },
        dateValue: function(){
            var value = moment(this.year+'-'+this.month+'-'+this.day, 'YYYY-M-D').format('YYYY-MM-DD');
            this.$emit('change', value);
            return value;
        }
    },
    template: '' +
'<div v-bind:class="className">'+
    '<input type="hidden" v-bind:name="name" v-model="dateValue">'+
    '<div class="form-row">'+
        '<div class="col">'+
            '<select v-model="month" class="form-control">'+
                '<option value="">Month</option>'+
                '<option v-for="(m, index) in months" v-bind:value="index+1">{{m}}</option>'+
            '</select>'+
        '</div>'+
        '<div class="col">'+
            '<select v-model="day" class="form-control">'+
                '<option value="">Day</option>'+
                '<option v-for="d in days" v-bind:value="d">{{d}}</option>'+
            '</select>'+
        '</div>'+
        '<div class="col">'+
            '<input v-model="year" type="number" class="form-control" placeholder="Year" min="1">'+
        '</div>'+
    '</div>'+
'</div>'
};
