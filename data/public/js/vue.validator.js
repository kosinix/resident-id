// Define a class like this
function VueValidator(){
    
}
Vue.component('vue-error-note', {
    props: {
        note: {
            default: '',
            type: String,
            required: true
        }
    },
    template: '<small v-if="note" class="invalid-feedback">{{note}}</small>'
});

Vue.component('vue-alert-error', {
    props: {
        message: {
            default: '',
            type: String,
            required: true
        }
    },
    template: '<div v-if="message" class="alert alert-danger">{{message}}</div>'
});

VueValidator.install = function (Vue, options) {
    
    // Instance method
    Vue.prototype.$setError = function(name, error){
        Vue.set(this.invalid, name, error);
    },
    Vue.prototype.$clearError = function(name){
        Vue.set(this.invalid, name, '');
    },
    Vue.prototype.$countErrors = function(name){
        var count = 0;
        _.each(this.invalid, function(errorMsg){
            if(errorMsg!==''){
                count++;
            }
        });
        return count;
    }
    Vue.prototype.$clearErrors = function(){
        var me = this;
        _.each(me.invalid, function(o,k){
            Vue.set(me.invalid, k, '');
        });
        me.errorMessage = "";
    },
    Vue.prototype.$invalidClass = function (key) {
        if(_.get(this.invalid, key)!==''){
            return "is-invalid";
        }
        return '';
    }
    Vue.mixin({
        data: function () {
            return {
                errorMessage: "",
            }
        }
    });
}
