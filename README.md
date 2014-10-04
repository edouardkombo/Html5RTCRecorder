Html5 RTC Recorder
==================

Html5RTCRecorder helps you record audio and video via webRTC and convert them into one single file via ffmpeg, in any extension you need, with black video result.
Make sure you have the latest FFMPEG version.


1) How to install
---------------------

    bower install html5-rtc-recorder


2) How to use it?
-----------------

Inside your html file:

    //If you have downloaded the script from bower
    <script src="bower_components/html5-rtc-recorder/RecordRTC.js"></script>         
    <script src="bower_components/html5-rtc-recorder/Html5RTCRecorder.js"></script>

    //Otherwhise
    <script src="RecordRTC.js"></script>         
    <script src="Html5RTCRecorder.js"></script>
 

Inside your javascript file

    //Instantiate the object
    var rtcRecorder                         = new Html5RTCRecorder();
    
    //Set Parameters
    rtcRecorder.rtc                         = RecordRTC;            //RecordRTC object
    rtcRecorder.width                       = '640';                //Width of the canvas and video tag element
    rtcRecorder.height                      = '480';                //Height of the canvas and video tag element

    rtcRecorder.videoTagIdHost              = 'testVideo';          //Div id where to store (video and canvas html tag element)
    rtcRecorder.videoTagId                  = 'video';              //Id of the video tag element
    rtcRecorder.canvasTagId                 = 'canvas';             //Id of the canvas tag element

    rtcRecorder.videoExtension              = 'mp4';                //Desired single file format (webm, mp4, avi, ogv, wmv)
    rtcRecorder.hideWebcamWhileRecording    = true;                 //Hide webcam while recording, strongly improves performance
    
    rtcRecorder.callback                    = 'my_call_function';   //Name of the function to call after php conversion
    rtcRecorder.mediaPath                   = "/medias/";           //Where to save the files on the disk
    
    //If you are using bower
    rtcRecorder.phpFile                     = "bower_components/html5-rtc-recorder/form/save.php";  //Php file to process conversion
    //Otherwhise
    rtcRecorder.phpFile                     = "/form/save.php";     //Php file to process conversion

    //Optional
    rtcRecorder.frameRate                   = 60;                   //Set the video fps
    rtcRecorder.quality                     = 10;                   //Set the video quality (max = 10)

    //Init rtcRecorder object
    rtcRecorder.init();

    function startRecording() {
        rtcRecorder.startRecording();
    }

    function stopRecording() {
        rtcRecorder.stopRecording();            
    }

    //Show the converted media
    function my_call_function() {
        var videoResult = document.createElement('video');
        videoResult.src = rtcRecorder.urlToStream;
        videoResult.setAttribute('autoplay', false);         
        videoResult.setAttribute('controls', true);        
        videoResult.id  = 'result';

        document.getElementById('containerId').appendChild(videoResult);

        videoResult.pause();             
    }
    

Contributing
-------------

If you do contribute, please make sure it conforms to the PSR coding standard. The easiest way to contribute is to work on a checkout of the repository, or your own fork, rather than an installed version.

Want to learn more? Visit my blog http://creativcoders.wordpress.com


Issues
------

Bug reports and feature requests can be submitted on the [Github issues tracker](https://github.com/edouardkombo/Html5RTCRecorder/issues).

For further informations, contact me directly at edouard.kombo@gmail.com.
