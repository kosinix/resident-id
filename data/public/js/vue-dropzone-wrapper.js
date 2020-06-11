// Define a new component
// Dropzone must be included before
Vue.component('vue-file-wrapper', {
    delimiters: ["${", "}"],
    data: function () {
        return {
            images: [],
            image: ""
        }
    },
    mounted: function(){
        
        
        
    },
    computed:{
        
    },
    props: {
        
    },
    methods: {
        onFileChange: function(e){
            var files = e.target.files || e.dataTransfer.files;
            if(!files.length) return;

            this.createImage(files[0]);
        },
        createImage: function(file) {
            var me = this;
            // Check if FileReader exist
            if (typeof FileReader !== "undefined" && ['image/png', 'image/jpeg', 'image/jpg'].indexOf(file.type) !== -1){
                var reader = new FileReader();
                reader.onload = function(e) {
                    me.image = e.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                me.image = "";
            }
        }
    },
    template: '<div>'+
'<div v-if="image"><img v-bind:src="image" /></div>'+
'<input type="file" v-on:change="onFileChange" />'+
'</div>'
});