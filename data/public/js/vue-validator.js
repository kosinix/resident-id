/**
 * Requires lodash
 * Optional: momentjs when using date-related validators (minAge, validDate)
 */
// TODO: Change the name back to VueValidator
// Define a class like this
function VueValidator2(){
    
}
// Vue components
Vue.component('validator-error', {
    props: {
        id: {
            default: '',
            type: String,
            required: true
        },
        messages: {
            default: [],
            type: Array,
            required: true
        }
    },
    computed: {
        message: function(){
            var me = this;
            var m = _.find(this.messages, function(o){
                return o.field == me.id
            })
            return _.get(m, 'message', '');
        }
    },
    template: '<small v-if="message" class="invalid-feedback">{{message}}</small>'
});

Vue.component('validator-alert-error', {
    props: {
        message: {
            default: '',
            type: String,
            required: true
        }
    },
    template: '<div v-if="message" class="alert alert-danger">{{message}}</div>'
});

Vue.component('validator-alert-success', {
    props: {
        message: {
            default: '',
            type: String,
            required: true
        }
    },
    template: '<div v-if="message" class="alert alert-success">{{message}}</div>'
});

VueValidator2.mixin = {
    methods: {
        validatorValidate: function(){
            var me = this;
            _.each(me.validator.checkList, function(check){
                var fieldNamePath = check.name; // Can be a field name (eg. "firstName") or a path (eg. "name.firstName") which resolves to a variable in Vue "data".
                var fieldValue = _.get(me, fieldNamePath);
                var fieldType = _.get(check, 'type', 'String');
                if(fieldType==='Number'){// Number
                    fieldValue = _.toFinite(fieldValue);
                } else if(fieldType==='Date'){// Date
                    fieldValue = moment(fieldValue);
                } else { // Assume string
                    fieldValue = _.toString(fieldValue);
                }
                _.each(check.validations, function(validation){
                    
                    var validator = _.bind(validation.validator, me, _, _);
                    
                    if(!validator(fieldValue, validation)){
                        // console.log('validation', validation.name, 'failed')
                        var errorMessage = "Field error";
                        if(_.isFunction(validation.message)){
                            errorMessage = validation.message()
                        } else {
                            errorMessage = validation.message.replace("{fieldName}", fieldNamePath).replace("{fieldValue}", fieldValue)
                        }

                        var found = _.find(me.validator.errorMessages, function(o) { 
                            return (o.field === fieldNamePath && o.key === validation.name); 
                        });
                        if(!found){
                            me.validator.errorMessages.push({
                                field: fieldNamePath,
                                key: validation.name,
                                message: errorMessage
                            });
                        }
                        
                        if(_.get(validation, 'break', false)){
                            return false;
                        } 
                    } else {
                        var index = _.findIndex(me.validator.errorMessages, function(o) { 
                            // console.log('validation', validation.name, 'passed')
                            return (o.field === fieldNamePath && o.key === validation.name); 
                        });
                        Vue.delete(me.validator.errorMessages, index);
                    }
                });

                
            
            });
            return me.validator.errorMessages;
        },
        validatorGetError: function(field){
            var found = _.find(me.validator.errorMessages, function(o) { 
                return (o.field === field); 
            });
            if(found){
                return found;
            }
            return '';
        }
    }
};
VueValidator2.init = function(checkList, defaultErrorMessages, errorMessage){
    // create validator object 
    return {
        checkList: checkList,
        errorMessages: defaultErrorMessages || [],
        errorMessage: errorMessage || ""
    };
}

VueValidator2.required = function(message, stopNext) {

    return {
        name: "required",
        message: message || "Field {fieldName} must not be blank.",
        break: stopNext || true,
        validator: function(value, validation){
            if(!value){
                return false;
            } 
            return true;
        }
    }
}

VueValidator2.min = function(min, message, stopNext){
    return {
        name: "min",
        message: message || "Field {fieldName} must not be below "+min+".",
        break: stopNext || false,
        validator: function(value, validation){
            if(value < min){
                return false;
            } 
            return true;
        }
    }
}

VueValidator2.max = function(max, message, stopNext){
    return {
        name: "max",
        message: message || "Field {fieldName} must not be above "+max+".",
        break: stopNext || false,
        validator: function(value, validation){
            if(value > max){
                return false;
            } 
            return true;
        }
    }
}

VueValidator2.range = function(min, max, message, stopNext){
    return {
        name: "range",
        message: message || "Field {fieldName} must be within "+min+"-"+max+" range.",
        break: stopNext || false,
        validator: function(value, validation){
            if(value < min || value > max){
                return false;
            } 
            return true;
        }
    }
}

VueValidator2.minLength = function(min, message, stopNext){
    return {
        name: "minLength",
        message: message || "Field {fieldName} must not be less than "+min+" characters.",
        break: stopNext || false,
        validator: function(value, validation){
            if(value.length < min){
                return false;
            } 
            return true;
        }
    }
}

VueValidator2.maxLength = function(max, message, stopNext){
    return {
        name: "maxLength",
        message: message || "Field {fieldName} must not be more than "+max+" characters.",
        break: stopNext || false,
        validator: function(value, validation){
            if(value.length > max){
                return false;
            } 
            return true;
        }
    }
}

VueValidator2.email = function(message, stopNext) {
    return {
        name: "email",
        message: message || "Field {fieldName} must be a email.",
        break: stopNext || false,
        validator: function(value, validation){
            if(value){
                // Source: http://emailregex.com/
                // regex used in type=”email” from W3C:
                if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)){
                    return false;
                }
            }
            return true;
        }
    }
}

VueValidator2.equal = function(compare, message, stopNext) {
    return {
        name: "equal",
        message: message || "Field {fieldName} must be equal to "+compare+".",
        break: stopNext || false,
        validator: function(value, validation){
            if(value !== compare){
                return false;
            }
            return true;
        }
    }
}

VueValidator2.equalField = function(compare, message, stopNext) {
    return {
        name: "equal",
        message: message || "Field {fieldName} must be equal to "+compare+".",
        break: stopNext || false,
        validator: function(value, validation){
            if(value !== this[compare]){
                return false;
            }
            return true;
        }
    }
}

VueValidator2.validDate = function(message, stopNext) {
    return {
        name: "validDate",
        message: message || "Field {fieldName} must be a valid date.",
        break: stopNext || true,
        validator: function(value, validation){
            if(moment(value).isValid() === false){ // Not a valid moment date
                return false;
            }
            return true;
        }
    }
}

/**
 * 
 * @param {Date} age Instance of moment()
 * @param {String} message 
 * @param {Boolean} stopNext 
 */
VueValidator2.minAge = function(age, message, stopNext) {
    return {
        name: "minAge",
        message: message || "Field {fieldName} invalid.",
        break: stopNext || false,
        validator: function(value, validation){
            if(moment().diff(value, 'years') < age){
                return false;
            }
            return true;
        }
    }
}

/**
 * 
 * @param {Date} age Instance of moment()
 * @param {String} message 
 * @param {Boolean} stopNext 
 */
VueValidator2.maxAge = function(age, message, stopNext) {
    return {
        name: "maxAge",
        message: message || "Field {fieldName} invalid.",
        break: stopNext || false,
        validator: function(value, validation){
            if(moment().diff(value, 'years') > age){
                return false;
            }
            return true;
        }
    }
}
