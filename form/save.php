<?php


// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Documentation     - github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC

// Modified by Edouard Kombo - edouard.kombo@gmail.com
// make sure that you're using newest ffmpeg version!

ini_set('memory_limit', '44096M');
ini_set('max_input_time', '100800');
ini_set('max_execution_time', '100800');
ini_set('upload_max_filesize', '55000M');
ini_set('post_max_size', '55000M');

$mediaPath      = (string) filter_input(INPUT_POST, 'mediaPath');
$filename       = (string) filter_input(INPUT_POST, 'filename');
$frameRate      = (string) filter_input(INPUT_POST, 'frameRate');
$deleteBaseFiles= (string) filter_input(INPUT_POST, 'deleteBaseFiles');
$videoExtension = (string) filter_input(INPUT_POST, 'videoExtension');
$rootPath       = (string) filter_input(INPUT_SERVER, 'DOCUMENT_ROOT');
$newFilename    = $filename + 1;
$_fullPath      = $rootPath . $mediaPath . $filename . '/';

$firstArray     = array("\\", "/");
$secondArray    = array(DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR);
$fullPath       = str_replace($firstArray, $secondArray , $_fullPath);

mkdir($fullPath, 0777, true);

// if it is audio-blob
if (isset($_FILES["audio-blob"])) {
    
    $uploadDirectory = $fullPath . $filename.'.wav';
    if (!move_uploaded_file($_FILES["audio-blob"]["tmp_name"], $uploadDirectory)) {
        echo("Problem writing audio file to disk!");      
    } else {        
        // if it is video-blob
        if (isset($_FILES["video-blob"])) {
            $uploadDirectory = $fullPath . $newFilename .'.webm';
            if (!move_uploaded_file($_FILES["video-blob"]["tmp_name"], $uploadDirectory)) {
                echo("Problem writing video file to disk!");
            } else {
                
                $audioFile  = $fullPath . $filename.'.wav';
                $videoFile  = $fullPath . $newFilename .'.webm';
                $mergedFile = $fullPath . $filename . '.' . $videoExtension;
                
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    $command = "ffmpeg -i $videoFile -i $audioFile -map 0:0 -map 1:0 -r $frameRate $mergedFile";
                } else {
                    $command  = "ffmpeg -i $videoFile -i $audioFile -map 0:0 -map 1:0 -strict experimental -r $frameRate $mergedFile";
                }
                exec($command, $output, $ret);

                if ($ret){
                    echo "There was a problem!\n";
                    print_r($command.'\n');
                    print_r($out);
                } else {
                    if ($deleteBaseFiles === 'true') {
                        unlink($audioFile);
                        unlink($videoFile);
                    }
                }
            }
        }
    }
}
