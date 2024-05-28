const types = {
  archive: { type: 'archive', path: require('assets/svg/files/archive.svg') },
  audio: { type: 'audio', path: require('assets/svg/files/audio.svg') },
  doc: { type: 'doc', path: require('assets/svg/files/doc.svg') },
  illustrator: { type: 'illustrator', path: require('assets/svg/files/illustrator.svg') },
  img: { type: 'image', path: require('assets/svg/files/img.svg') },
  pdf: { type: 'pdf', path: require('assets/svg/files/pdf.svg') },
  photoshop: { type: 'photoshop', path: require('assets/svg/files/photoshop.svg') },
  numbers: { type: 'numbers', path: require('assets/svg/files/numbers.svg') },
  pages: { type: 'pages', path: require('assets/svg/files/pages.svg') },
  presentation: { type: 'presentation', path: require('assets/svg/files/presentation.svg') },
  sketch: { type: 'sketch', path: require('assets/svg/files/sketch.svg') },
  spreadsheets: { type: 'spreadsheets', path: require('assets/svg/files/spreadsheets.svg') },
  txt: { type: 'txt', path: require('assets/svg/files/txt.svg') },
  unknown: { type: 'unknown', path: require('assets/svg/files/unknown.svg') },
  video: { type: 'video', path: require('assets/svg/files/video.svg') },
  xd: { type: 'xd', path: require('assets/svg/files/xd.svg') }
};

export const fileType = (mime_type, extension) => {
  let type = 'unknown';
  let pref = '';

  extension = (extension || '').toLowerCase();

  if (mime_type || extension) pref = mime_type.match(/^(.*)\//);
  else return types[type];

  if (extension) {
    switch (extension) {
      case 'svg':
        type = 'img';
        break;

      case 'pdf':
        type = 'pdf';
        break;

      case 'doc':
      case 'docm':
      case 'docx':
        type = 'doc';
        break;

      case 'odt':
      case 'ods':
      case 'xls':
      case 'xlsx':
      case 'xlsm':
      case 'xlsb':
      case 'xltx':
      case 'xltm':
      case 'xlml':
      case 'xlt':
      case 'dbf':
      case 'dif':
      case 'csv':
        type = 'spreadsheets';
        break;

      case 'numbers':
        type = 'numbers';
        break;

      case 'pages':
        type = 'pages';
        break;

      case 'odp':
      case 'pps':
      case 'ppsm':
      case 'ppsx':
      case 'ppt':
      case 'pptm':
      case 'pptx':
        type = 'presentation';
        break;

      case 'rtf':
      case 'prn':
      case 'txt':
        type = 'txt';
        break;

      case '3gp':
      case '3gpp':
      case '3gpp2':
      case 'asf':
      case 'avi':
      case 'dv':
      case 'flv':
      case 'm2t':
      case 'm4v':
      case 'mkv':
      case 'mov':
      case 'mp4':
      case 'mpeg':
      case 'mpg':
      case 'mts':
      case 'oggtheora':
      case 'ogv':
      case 'rm':
      case 'ts':
      case 'vob':
      case 'webm':
      case 'wmv':
        type = 'video';
        break;

      case 'aac':
      case 'm4a':
      case 'mp3':
      case 'oga':
      case 'wav':
        type = 'audio';
        break;

      case 'sketch':
        type = 'sketch';
        break;

      case 'xd':
        type = 'xd';
        break;

      case 'ai':
        type = 'illustrator';
        break;

      case 'url':
      case 'webloc':
      case 'website':

      default:
        type = 'unknown';
    }
  }

  if (pref && pref[0] && type == 'unknown') {
    switch (pref[0]) {
      case 'image/':
        switch (mime_type) {
          case 'image/vnd.adobe.photoshop':
          case 'image/psd':
            type = 'photoshop';
            break;
          default:
            type = 'img';
            break;
        }

        break;

      case 'video/':
        type = 'video';
        break;

      case 'audio/':
        type = 'audio';
        break;

      case 'application/':
        switch (mime_type) {
          case 'application/x-photoshop':
          case 'application/photoshop':
          case 'application/psd':
            type = 'photoshop';
            break;

          case 'application/octet-stream':
          case 'application/x-bzip':
          case 'application/x-bzip2':
          case 'application/java-archive':
          case 'application/x-rar-compressed':
          case 'application/x-tar':
          case 'application/zip':
          case 'application/x-7z-compressed':
            type = 'archive';
            break;

          default:
            type = 'unknown';
            break;
        }

        break;
      case 'text/':
        type = 'txt';
        break;

      default:
        type = 'unknown';
        break;
    }
  }

  return types[type];
};

export const icon = (mime_type, extension) => {
  return fileType(mime_type, extension).path;
};

export const fileSize = bytes => {
  var thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
};
