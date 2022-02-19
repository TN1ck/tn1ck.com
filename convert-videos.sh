set -e

cd ./public/videos
for i in *.mov;
  do name=`echo "${i%.*}"`;
  echo $name;
  ffmpeg -i "$i" -vcodec h264 -acodec aac -strict -2 -vf scale=1280:-2 "${name}.mp4";
  ffmpeg -i "${name}.mp4" -ss 00:00:00 -vframes 1 "${name}.png";
done
