import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const convertToHLS = (input, output) => {

  return new Promise((resolve, reject) => {

    ffmpeg(input)

      .outputOptions([
        "-c:v libx264",
        "-c:a aac",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls",
        "-hls_segment_filename",
        `${output}/segment_%03d.ts`,
      ])

      .output(`${output}/index.m3u8`)

      .on("end", () => {
        resolve();
      })

      .on("error", (err, stdout, stderr) => {
        console.error("FFmpeg error:", err);
        console.error("FFmpeg stderr:", stderr);
        reject(err);
      })

      .run();
  });
};

export default convertToHLS;