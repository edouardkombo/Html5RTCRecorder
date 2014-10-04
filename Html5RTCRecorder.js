/**
 * Object:  Html5RTCRecorder
 * Version: master
 * Author:  Edouard Kombo
 * Twitter: @EdouardKombo
 * Github:  https://github.com/edouardkombo
 * Blog:    http://creativcoders.wordpress.com
 * Url:     https://github.com/edouardkombo/Html5RTCRecorder
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Record audio+video in html5 with webRTC, and convert them in single mp4 (or any other format) file with ffmpeg.
 */

var Html5RTCRecorder = function(){};

Html5RTCRecorder.prototype = {
    audioContext: '',
    url: '',
    fileName: '',
    mediaStream: '',
    recordAudio: '',
    recordVideo: '',
    videoTagIdHost: '',    
    videoTagId: '',
    audioTagId: '',
    width: '',
    height: '',
    callback: '',
    urlToStream: '',
    callbackType: '',
    hideWebcamWhileRecording: '',
    videoExtension: '',
    phpFile: '',
    mediaPath: '',
    deleteSeparatedFiles: true,
    rtc: '',
    frameRate: 60,
    quality: 10,
    client: '',
    
    /**
     * Init all objects
     * 
     * @returns {undefined}
     */
    init: function (){
        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.AudioContext     = window.AudioContext || window.webkitAudioContext;
        window.URL              = window.URL || window.webkitURL;
        
        this.getUserMedia = navigator.getUserMedia;
        this.audioContext = window.AudioContext;
        this.url          = window.URL;
        
        window.onload = this.onload(); 
    },
    
    /**
     * Load getUserMedia
     * 
     * @returns {undefined}
     */
    onload: function () {
        navigator.getUserMedia({
            audio: true, 
            video: true         
        }, this.onStream.bind(this), function(e) {
            console.log('No live audio input or video stream: ' + e);
        });        
    },    
    
    /**
     * Send stream to video tag
     * 
     * @param {Object} stream
     * @returns {undefined}
     */
    onStream: function(stream) {
        this.resetTags();
                
        this.mediaStream        = stream;

        this.videoTag.src       = this.url.createObjectURL(stream);
        this.videoTag.muted     = true;        
        this.videoTag.play();
    },

    /**
     * Begin both audio and video record
     * 
     * @returns {undefined}
     */
    startRecording: function () {
        
        //Close previous xmlHttpRequest connection, so we avoid memory limit
        this.client = '';
        
        if (this.hideWebcamWhileRecording) {
            this.showHideStream('hide');
        }
        
        this.recordAudio = '';
        this.recordVideo = '';        
        
        this.recordAudio = this.rtc(this.mediaStream, {
            // bufferSize: 16384,
            onAudioProcessStarted: function() {
                this.recordVideo.startRecording();
            }.bind(this)
        });

        var options = {
            type: 'video',
            video: {
              width: this.width,
              height: this.height
            },
            canvas: {
              width: this.width,
              height: this.height
            },
            frameRate: this.frameRate,
            quality: this.quality            
        };

        this.recordVideo = this.rtc(this.mediaStream, options);

        this.recordAudio.startRecording();        
    },    
    
    /**
     * Set current id (timestamp)
     * 
     * @returns {undefined}
     */
    setFileName: function () {
        this.fileName = Date.now();        
    },
    
    /**
     * Stop both audio and video record
     * 
     * @returns {undefined}
     */
    stopRecording: function () {
        this.setFileName();

        this.recordAudio.stopRecording(function() {
            this.recordVideo.stopRecording(function() {
                this.postBlob(
                    this.recordAudio.getBlob(), 
                    this.recordVideo.getBlob(), 
                    this.fileName
                );
            }.bind(this));
        }.bind(this));        
    },    
    
    /**
     * Show or hide video stream on demand
     * 
     * @param {String} status
     * @returns {undefined}
     */
    showHideStream: function(status)
    {
        if (status === 'show') {
            this.videoTag.style.visibility  = 'visible';
            this.videoTag.style.display     = 'block';            
        } else if (status === 'hide') {
            this.videoTag.style.visibility  = 'hidden';
            this.videoTag.style.display     = 'none';           
        }
    },     
    
    /**
     * Recreate video and canvas tag
     * 
     * @returns {undefined}
     */
    resetTags: function()
    {
        //Create video and canvas tag if not exists
        this.createTag('video', this.videoTagId);
        this.createTag('canvas', this.canvasTagId);         
    },
    
    /**
     * Create html tag inside html document (video, canvas)
     * 
     * @param {String} tag
     * @param {String} tagId
     * @returns {jsHtml5Webcam.prototype@pro;videoTagmyTag|jsHtml5Webcam.prototype.createTag.myTag|jsHtml5Webcam.prototype.createTag.thisTag|Element}
     */
    createTag: function(tag, tagId) 
    {
        var myTag   = document.getElementById(tagId);
       
        if (myTag === null) {
            
            myTag = document.createElement(tag);
            
            if (tag === 'canvas') {
                myTag.width             = this.width;
                myTag.height            = this.height;
                myTag.id                = tagId;
                myTag.style.position    = 'absolute';
                myTag.style.visibility  = 'hidden';
                this.ctx                = myTag.getContext('2d');
                this.canvasTag          = this.ctx.canvas;
            
            } else if (tag === 'video') {    
                myTag.setAttribute('autoplay','true');
                myTag.width             = this.width;
                myTag.height            = this.height;
                myTag.id                = tagId;
                if (this.mediaStream !== '') {
                    myTag.src = window.URL.createObjectURL(this.mediaStream);
                }
                this.videoTag   = myTag;
            }
            
            document.getElementById(this.videoTagIdHost).appendChild(myTag);    
        
        } else {

            if (tag === 'canvas') {
               this.canvasTag   = myTag; 
            } else {
               this.videoTag   = myTag; 
            }
        }
    },      
    
    /**
     * Post audio, video and other informations to php file, and execute callback function
     * 
     * @returns {undefined}
     */
    postBlob: function () {        
        var formData = new FormData();
        formData.append('audio-blob', this.recordAudio.getBlob());
        formData.append('video-blob', this.recordVideo.getBlob());
        formData.append('videoExtension', this.videoExtension);
        formData.append('mediaPath', this.mediaPath);
        formData.append('filename', this.fileName);
        formData.append('deleteBaseFiles', this.deleteSeparatedFiles);
        formData.append('frameRate', this.frameRate);        

        this.client = new XMLHttpRequest();
        this.client.onreadystatechange = function() 
        {
            if ((this.client.readyState === 4) && (this.client.status === 200)) 
            {
                console.log(this.client.response);

                this.urlToStream = this.mediaPath + this.fileName + '/' + this.fileName + '.' + this.videoExtension;
                this.callbackType = 'video';
                var fn = window[this.callback];
                fn();
                this.showHideStream('show');
            }
        }.bind(this);
        this.client.open("post", this.phpFile);
        this.client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        this.client.setRequestHeader("cache-Control", "no-store, no-cache, must-revalidate");
        this.client.setRequestHeader("cache-Control", "post-check=0, pre-check=0");
        this.client.setRequestHeader("cache-Control", "max-age=0");
        this.client.setRequestHeader("Pragma", "no-cache");
        this.client.send(formData);
    }    
};