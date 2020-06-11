// Define a new component
Vue.component('vue-uploader', {
    data: function () {
        return {
            STATUS: {
                ADDED: 'added',
                UPLOADING: 'uploading',
                FAILED: 'failed',
                DONE: 'done'
            },
            disabled: false,
            files: []
        }
    },
    computed:{
        status: function(){
            var me = this;
            let res = _.find(me.files, function(file){
                return file.status===me.STATUS.ADDED;
            });
            if(res!==undefined){
                return me.STATUS.ADDED;
            }

            res = _.find(me.files, function(file){
                return file.status===me.STATUS.UPLOADING;
            });
            if(res!==undefined){
                return me.STATUS.UPLOADING;
            }

            return me.STATUS.DONE;
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
        url: {
            default: '',
            type: String,
            required: true
        },
        className: {
            default: 'vue-file-selector',
            type: String
        },
        accept: {
            default: 'image/*,application/pdf',
            type: String
        },
        fileIcon: {
            default: '/images/file-icon.jpg',
            type: String
        },
        maxCount: {
            default: -1,
            type: Number
        },
        multiple: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        cloneFile: function(file){
            var me = this;
            return {
                uid: file.uid, // a globally unique id for the specific file.
                file: file.file, // Native instance of File
                imageData: file.imageData, // Data for image preview
                name: file.name, // File name for example "myfile.gif".
                type: file.type, // File type, e.g image/jpeg
                size: file.size, // Original file size in bytes.
                uploaded: file.uploaded, // Number of bytes uploaded of the files total size.
                percent: file.percent, // Number of percentage uploaded of the file.
                status: file.status, // Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
                lastModifiedDate: file.lastModifiedDate // Last modified date. Instance of native Date
            };
        },
        genUid: function (len) {
            if(!len) len = 16;

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < len; i++){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        },
        addFile: function(file){
            var me = this;


            var uid = this.genUid();
            var fileWrapper = {
                uid: uid, // a globally unique id for the specific file.
                file: file, // Native instance of File
                imageData: me.fileIcon, // Data for image preview
                name: file.name, // File name for example "myfile.gif".
                type: file.type, // File type, e.g image/jpeg
                size: file.size, // Original file size in bytes.
                uploaded: 0, // Number of bytes uploaded of the files total size.
                percent: 0, // Number of percentage uploaded of the file.
                status: me.STATUS.ADDED, // Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
                lastModifiedDate: file.lastModifiedDate // Last modified date. Instance of native Date
            };
            me.files.push(fileWrapper);
            
            var uploaderRep = {
                id: me.id,
                name: me.name,
                status: me.status
            };

            // Check if FileReader exist
            if (typeof FileReader !== "undefined" && ['image/png', 'image/jpeg', 'image/jpg'].indexOf(file.type) !== -1){
                var reader = new FileReader();
                reader.onload = function(e) {
                    fileWrapper.imageData = e.target.result;
                    me.$emit('file-added', fileWrapper, uploaderRep);
                }
                reader.readAsDataURL(file);
            } else {
                me.$emit('file-added', fileWrapper, uploaderRep);
            }
        },
        browseFile: function (event){
            
            var me = this;
            var files = _.get(event, 'target.files',[]);
            
            // If max count is not -1 and max count is less than selected
            if(me.maxCount !== -1 && me.files.length + files.length > me.maxCount){
                return alert('Maximum of '+ this.maxCount + ' file(s) only');
            }
            if(me.status===me.STATUS.UPLOADING) return;
            
            if(files){
                _.each(files, me.addFile);
            }
        },
        deleteFile: function(uid){
            var me = this;
            var index = _.findIndex(me.files, function(o) { return o.uid == uid; });
            var fileWrapper = me.cloneFile(me.files[index]);
            var uploaderRep = {
                id: me.id,
                name: me.name,
                status: me.status
            };
            Vue.delete(me.files, index);
            me.$emit('file-deleted', uid, fileWrapper, uploaderRep);
        },
        uploadFile: function(file, index){
            var me = this;
            if(file.status===me.STATUS.DONE || file.status===me.STATUS.UPLOADING) return;

            var xhr = new XMLHttpRequest();
            
            (xhr.upload || xhr).addEventListener('progress', function(e) {
                var current = e.position || e.loaded
                var total = e.totalSize || e.total;
                
                file.status = me.STATUS.UPLOADING;
                file.uploaded = current;
                file.percent = Math.round(current/total*100);
            });
            xhr.addEventListener('error', function(e) {
                
                file.status = me.STATUS.FAILED;
                me.$emit('file-error', me.name, file);
            });
            xhr.addEventListener('load', function(e) {
                var response = JSON.parse(this.responseText);
                file.status = me.STATUS.DONE;
                me.$emit('file-uploaded', me.cloneFile(file), me.name, response); // response
                
                var r = _.find(me.files, function(f){
                    return f.status !== me.STATUS.DONE;
                });
                if(r===undefined){
                    me.$emit('upload-complete', me.name, me.files)
                    // me.disabled = true; // TODO: Optional?
                }
            });
            xhr.open('post', me.url, true); // Async 3rd arg
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // For express req.xhr

            var formData = new FormData();
            formData.append(file.uid, file.file);
            
            xhr.send(formData);
        },
        uploadBatch: function(){
            var me = this;
            if(me.disabled) return; // TODO: better
            _.each(me.files, function(file, index){
                me.uploadFile(file, index);
            });
        },
    },
    template: '<div v-bind:class="className">'+
'<ul class="vfs-files row">'+
    '<li v-if="file.status!==STATUS.DONE" v-for="(file, index) in files" class="col-md-4 col-sm-12">'+
        '<div class="photo-box">'+
            '<button v-if="file.status===STATUS.ADDED" v-on:click="deleteFile(file.uid)" type="button" class="delete">x</button>'+
            '<img v-if="file.imageData" v-bind:src="file.imageData" alt="Preview">'+
            '<div class="status">'+
                '<div class="bar">'+
                    '<div class="inner" v-bind:style="\'width: \'+file.percent+\'%\'"></div>'+
                '</div>'+
                '<div v-if="file.status===\'uploading\'" class="text">{{file.percent}}%</div>'+
                '<div class="text">{{file.status}}</div>'+
            '</div>'+
        '</div>'+
    '</li>'+
'</ul>'+
'<div class="vfs-button">'+
    '<input v-bind:disabled="disabled" onclick="this.value=null" v-on:change="browseFile($event)" v-bind:id="id" v-bind:name="name" v-bind:accept="accept" v-bind:multiple="multiple" class="vfs-file" type="file">'+
    '<label class="vfs-label" v-bind:for="id">Choose file</label>'+
'</div>'+
'</div>'
});