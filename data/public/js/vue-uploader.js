// Define a new component
function VueUploader() {

}
VueUploader.bootstrap = {
    data: function () {
        return {
            UPLOADER_STATUS: { // Constants
                READY: "queued", // No file in queue.
                QUEUED: "queued", // At least 1 file queued.
                UPLOADING: "uploading",
            },
            FILE_STATUS: { // Constants
                QUEUED: "queued", // File queued and ready to be uploaded
                UPLOADING: "uploading", // 
                ERROR: "error", // An error occured during upload
                UPLOADED: "uploaded" // On server
            },
            disabled: false,
            files: []
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
        label: {
            default: 'Choose File',
            type: String
        },
        className: {
            default: 'vue-uploader',
            type: String
        },
        accept: {
            default: 'image/jpeg,image/png,application/pdf',
            type: String
        },
        fileIcon: {
            default: 'data:image/jpeg;base64,/9j/4QCuRXhpZgAASUkqAAgAAAADADEBAgAeAAAAMgAAADIBAgAaAAAAUAAAAGmHBAABAAAAagAAAAAAAABBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cwAyMDE4LTA1LTA1VDEwOjIyOjUzKzA4OjAwAAQAAJAHAAQAAAAwMjIwCZIDAAEAAABhAAAAAqAEAAEAAAD6AAAAA6AEAAEAAAD6AAAAAAAAAPoAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QQ/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MSA2NC4xNDA5NDksIDIwMTAvMTIvMDctMTA6NTc6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA1LTA1VDA3OjU2OjIxKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wNS0wNVQxMDoyMjo1MyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNS0wNVQx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',
            type: String
        },
        max: {
            default: "-1",
            type: String
        },
        fileSize: {
            default: "10000000", // 10MB (10,000,000 bytes)
            type: String
        },
        multiple: {
            default: "false",
            type: String
        },
        defaultFiles: {
            default: [],
            type: Array
        }
    },
    created: function(){
        for(var i = 0; i < this.defaultFiles.length; i++){
            
            var imageData = this.defaultFiles[i];
            if(this.defaultFiles[i].indexOf('.pdf')!==-1){
                imageData = this.fileIcon
            }
            this.defaultFiles[i] = {
                uid: this.genUid(),
                imageData: imageData,
                status: this.FILE_STATUS.UPLOADED
            };
        }
        this.defaultFiles = this.defaultFiles;
    },
    computed: {
        fileSizeLimit: function(){
            return parseInt(this.fileSize);
        },
        maxCount: function(){
            return parseInt(this.max);
        },
        isMultiple: function(){
            return (this.multiple) ? true : false;
        }
    },
    methods: {
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
                name: file.name, // File.name for example "myfile.gif".
                type: file.type, // File.type, e.g image/jpeg
                size: file.size, // Original file size in bytes.
                uploaded: 0, // Number of bytes uploaded of the files total size.
                percent: 0, // Number of percentage uploaded of the file.
                status: me.FILE_STATUS.QUEUED, // See constants
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
            var files = [];
            if('target' in event){
                if('files' in event.target){
                    files = event.target.files
                }
            }
            
            if(files){
                // Remove all from component
                me.files = [];

                // If max count is not -1 and selected is more than max count
                if(me.maxCount !== -1 && files.length > me.maxCount){
                    
                    // Remove all FileList content
                    event.target.value = "";
                    return alert('Maximum of '+ this.maxCount + ' file(s) only');
                }

                var count = files.length;
                var accepted = me.accept.split(',');
                // If one file is bigger than allowed bytes, abort
                for(var i = 0; i < count; i++){
                    if(files[i].size > me.fileSizeLimit){
                        // Remove all FileList content
                        event.target.value = "";
                        return alert('File must not exceed '+ this.fileSizeLimit / 1000000 + ' MB');
                    }
                    if(accepted.indexOf(files[i].type)===-1){
                        // Remove all FileList content
                        event.target.value = "";
                        return alert('File type not allowed. Must be one of the following: '+me.accept);
                    }
                }


                for(var i = 0; i < count; i++){
                    me.addFile(files[i])
                }
                
            }
        },
    },
    template: '' +
'<div v-bind:class="className">'+
    '<div class="vup-files row">'+
        '<div class="vup-file col ml-auto mr-auto"><div v-for="file in defaultFiles" class="vup-file col ml-auto mr-auto" v-bind:data-status="file.status" style="max-width:150px">'+
            '<div class="vup-info">'+
                '<img v-bind:src="file.imageData" alt="Preview" style="max-width:100%; margin-bottom: 10px">'+
            '</div>'+
        '</div></div>'+
        '<div v-for="file in files" class="vup-file col ml-auto mr-auto" v-bind:data-status="file.status" style="max-width:150px">'+
            '<div class="vup-info">'+
                '<img v-bind:src="file.imageData" alt="Preview" style="max-width:100%; margin-bottom: 10px">'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="custom-file">'+
        '<input v-on:change="browseFile" type="file" class="custom-file-input" v-bind:id="id" v-bind:name="name" v-bind:multiple="isMultiple" v-bind:accept="accept">'+
        '<label class="custom-file-label" v-bind:for="id">{{label}}</label>'+
    '</div>'+
'</div>'
};

VueUploader.ajax = {
    data: function () {
        return {
            UPLOADER_STATUS: { // Constants
                READY: "queued", // No file in queue.
                QUEUED: "queued", // At least 1 file queued.
                UPLOADING: "uploading",
            },
            FILE_STATUS: { // Constants
                QUEUED: "queued", // File queued and ready to be uploaded
                UPLOADING: "uploading", // 
                ERROR: "error", // An error occured during upload
                UPLOADED: "uploaded" // On server
            },
            disabled: false,
            fileField: null, // The <input type="file" element
            files: []
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
        label: {
            default: 'Choose File',
            type: String
        },
        className: {
            default: 'vue-uploader',
            type: String
        },
        accept: {
            default: 'image/jpeg,image/png,application/pdf',
            type: String
        },
        fileIcon: {
            default: 'data:image/jpeg;base64,/9j/4QCuRXhpZgAASUkqAAgAAAADADEBAgAeAAAAMgAAADIBAgAaAAAAUAAAAGmHBAABAAAAagAAAAAAAABBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cwAyMDE4LTA1LTA1VDEwOjIyOjUzKzA4OjAwAAQAAJAHAAQAAAAwMjIwCZIDAAEAAABhAAAAAqAEAAEAAAD6AAAAA6AEAAEAAAD6AAAAAAAAAPoAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QQ/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MSA2NC4xNDA5NDksIDIwMTAvMTIvMDctMTA6NTc6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA1LTA1VDA3OjU2OjIxKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wNS0wNVQxMDoyMjo1MyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNS0wNVQx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',
            type: String
        },
        max: {
            default: "-1",
            type: String
        },
        fileSize: {
            default: "1000000", // 1MB (1,000,000 bytes)
            type: String
        },
        multiple: {
            default: "false",
            type: String
        },
        defaultFiles: {
            default: [],
            type: Array
        }
    },
    created: function(){
        for(var i = 0; i < this.defaultFiles.length; i++){
            this.defaultFiles[i] = {
                uid: this.genUid(),
                imageData: this.defaultFiles[i],
                status: this.FILE_STATUS.UPLOADED
            };
        }
        this.defaultFiles = this.defaultFiles;
    },
    computed: {
        fileSizeLimit: function(){
            return parseInt(this.fileSize);
        },
        maxCount: function(){
            return parseInt(this.max);
        },
        isMultiple: function(){
            return (this.multiple) ? true : false;
        }
    },
    methods: {
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
                name: file.name, // File.name for example "myfile.gif".
                type: file.type, // File.type, e.g image/jpeg
                size: file.size, // Original file size in bytes.
                uploaded: 0, // Number of bytes uploaded of the files total size.
                percent: 0, // Number of percentage uploaded of the file.
                status: me.FILE_STATUS.QUEUED, // See constants
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
            var files = [];
            if('target' in event){
                if('files' in event.target){
                    files = event.target.files
                }
            }
            
            if(files){
                me.fileField = event.target;

                // Remove all from component
                me.files = [];

                // If max count is not -1 and selected is more than max count
                if(me.maxCount !== -1 && files.length > me.maxCount){
                    
                    // Remove all FileList content
                    event.target.value = "";
                    return alert('Maximum of '+ this.maxCount + ' file(s) only');
                }

                var count = files.length;
                var accepted = me.accept.split(',');
                // If one file is bigger than allowed bytes, abort
                for(var i = 0; i < count; i++){
                    if(files[i].size > me.fileSizeLimit){
                        // Remove all FileList content
                        event.target.value = "";
                        return alert('File must not exceed '+ this.fileSizeLimit / 1000000 + ' MB');
                    }
                    if(accepted.indexOf(files[i].type)===-1){
                        // Remove all FileList content
                        event.target.value = "";
                        return alert('File type not allowed. Must be one of the following: '+me.accept);
                    }
                }


                for(var i = 0; i < count; i++){
                    me.addFile(files[i])
                }
                
            }
        },
        uploadFile: function(file, index){
            var me = this;
            if(file.status===me.FILE_STATUS.UPLOADED || file.status===me.FILE_STATUS.UPLOADING) return;

            var xhr = new XMLHttpRequest();
            
            (xhr.upload || xhr).addEventListener('progress', function(e) {
                var current = e.position || e.loaded
                var total = e.totalSize || e.total;
                
                file.status = me.FILE_STATUS.UPLOADING;
                file.uploaded = current;
                file.percent = Math.round(current/total*100);
            });
            xhr.addEventListener('error', function(e) {
                
                file.status = me.FILE_STATUS.ERROR;
                me.$emit('file-error', file, me.name, e);
            });
            xhr.addEventListener('load', function(e) {
                var response = this.responseText;
                file.status = me.FILE_STATUS.UPLOADED;
                me.$emit('file-uploaded', file, me.name, response); // response
                
                var count = me.files.length;
                var done = true;
                for(var x =0; x < count; x++){
                    var f = me.files[x];
                    if (f.status !== me.FILE_STATUS.UPLOADED){
                        done = false; // If at least one is not uploaded, not done!
                    }
                }
                
                if(done){
                    me.fileField.value = ""; // Remove contents
                    me.$emit('upload-complete', me.files, me.name)
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
            
            var count = me.files.length;
            for(var x = 0; x < count; x++){
                var file = me.files[x];
                me.uploadFile(file, x);
            }
        },
    },
    template: '' +
'<div v-bind:class="className">'+
    '<div class="vup-files row" style="margin-bottom:5px;">'+
        '<div v-for="file in defaultFiles" class="vup-file col-3" v-bind:data-status="file.status" style="max-width:100px">'+
            '<div class="vup-info">'+
                '<img v-bind:src="file.imageData" alt="Preview" style="max-width:100%">'+
            '</div>'+
        '</div>'+
        '<div v-for="file in files" class="vup-file col-3" v-bind:data-status="file.status" style="max-width:100px">'+
            '<div class="vup-info">'+
                '<img v-bind:src="file.imageData" alt="Preview" style="max-width:100%">'+
                '<div style="position:relative; height: 3px">'+
                    '<div v-bind:style="\'position:absolute; background:orange; height:3px; left: 0; top: 0; width:\'+file.percent+\'%\'"></div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="custom-file">'+
        '<input v-on:change="browseFile" type="file" class="custom-file-input" v-bind:id="id" v-bind:name="name" v-bind:multiple="isMultiple" v-bind:accept="accept">'+
        '<label class="custom-file-label" v-bind:for="id">{{label}}</label>'+
    '</div>'+
'</div>'
};