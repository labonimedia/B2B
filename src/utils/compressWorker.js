// const { exec } = require('child_process');

// process.on('message', ({ inputFilePath, outputFilePath }) => {
//     const command = `ffmpeg -i "${inputFilePath}" -vcodec libx264 -preset fast -crf 28 -y "${outputFilePath}"`;

//     exec(command, (error) => {
//         if (error) {
//             process.send({ success: false, error: error.message });
//         } else {
//             process.send({ success: true, outputFilePath });
//         }
//     });
// });


const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

process.on('message', ({ inputFilePath, outputFilePath }) => {
    ffmpeg(inputFilePath)
        .videoCodec('libx264')
        .outputOptions('-preset faster') // Use 'faster' instead of 'fast'
        .outputOptions('-crf 30') // Increase CRF for faster compression
        .size('640x?') // Reduce resolution
        .save(outputFilePath)
        .on('end', () => {
            process.send({ success: true, outputFilePath });
        })
        .on('error', (error) => {
            process.send({ success: false, error: error.message });
        });
});


