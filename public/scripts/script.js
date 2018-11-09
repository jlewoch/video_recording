// to do

// add a progressBar
// allow audio recording
// add selections for video types and quality

const recorder = {
  init: () => {
    window.recordedBlobs = []
    window.recorder = new MediaRecorder(window.stream)
    window.recorder.ondataavailable = blob => {
      window.recordedBlobs.push(blob.data)
    }
    window.recorder.onstart = () => {
      $('#stop-btn').show('slow')
      $('#rec').hide('slow')
      $('#pause').show('slow')
      $('#snap-btn').show('slow')
      $('#cam-btn').hide('slow')
    }
    window.recorder.onstop = () => {
      $('#stop-btn').hide()

      $('#pause').attr('fill', '#fff').attr('stroke', '#fff')

      const url = window.URL.createObjectURL(
        new Blob(window.recordedBlobs, { type: 'video/webm' })
      )
      $('#local-video').prop('srcObject', null).attr('src', url)
      window.recordedBlobs = []
      controls.setupDownloadLink(url, 'webm', 'Video')
    }
    window.recorder.onpause = () => {
      $('#pause').attr('fill', '#0095ff').attr('stroke', '#0095ff')
    }
    window.recorder.onresume = () => {
      $('#pause').attr('fill', '#fff').attr('stroke', '#fff')
    }
  }
}
const stream = {
  init: () => {
    return navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then(stream => {
        window.stream = stream
        $('#local-video').prop('srcObject', window.stream)
      })
      .catch(console.log)
  },

  enableStream: () => {
    window.stream.getVideoTracks()[0].enabled = true
    $('#cam-btn').html('Hide Cam')
    $('#fullscreen-btn').show('slow')
    $('#rec').show('slow')
    $('#snap-btn').show('slow')
  },
  disableStream: () => {
    window.stream.getVideoTracks()[0].enabled = false
    $('#cam-btn').html('Show Cam')
    $('#snap-btn').hide('slow')
    $('#rec').hide('slow')
    $('#fullscreen-btn').hide('slow')
  }
}

const controls = {
  enableFullscreen: video => {
    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen()
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen()
    }
    $('#fullscreen-btn').attr('fill', '#0095ff').attr('stroke', '#0095ff')
    $('#cam-btn').hide('slow')
  },
  disableFullscreen: video => {
    if (video.requestFullscreen) {
      document.exitFullscreen()
    } else if (video.mozRequestFullScreen) {
      document.mozExitFullScreen()
    } else if (video.webkitRequestFullscreen) {
      document.webkitExitFullscreen()
    }
    $('#fullscreen-btn').attr('fill', '#fff').attr('stroke', '#fff')
    $('#cam-btn').show('slow')
  },
  toggleFullscreenBtn: () => {
    $('#fullscreen-btn').find('path').toggle('slow')
  },
  takeSnapShot: () => {
    const type = $('#image-type').val()
    const video = $('#local-video')
    const canvas = $('#preview-canvas')
    canvas
      .attr('height', video[0].videoHeight)
      .attr('width', video[0].videoWidth)
    window.context = canvas[0]
      .getContext('2d')
      .drawImage(video[0], 0, 0, video[0].videoWidth, video[0].videoHeight)
    video.hide()
    canvas.show()
    const url = canvas[0].toDataURL(`image/${type}`, 1.0)
    controls.setupDownloadLink(url, type, 'Image')
  },
  setupDownloadLink: (url, ext, type) => {
    $('#trash').show('slow')
    $('#download-btn')
      .html(`Save ${type}`)
      .prop('href', url)
      .prop('download', `test.${ext}`)
      .show('slow')
  }
}

const media = {
  init: () => {
    $('#local-video')[0].onended = () => {
      $('#play').show('slow')
      $('#pause').hide('slow')
    }
    $('#local-video')[0].onpause = () => {
      $('#play').show('slow')
      $('#pause').hide('slow')
    }
    $('#local-video')[0].onplay = e => {
      if ($('#local-video').prop('srcObject') === null) {
        $('#pause').show('slow')
      }
      $('#play').hide('slow')
    }
  },
  backToLiveFromSnap: () => {
    $('#cam-btn').show('slow')
    $('#trash').hide('slow')
    $('#download-btn').hide('slow')
    $('#rec').show('slow')
    $('#preview-canvas').hide()
    $('#local-video').show()
  },
  backToLiveFromRec: () => {
    $('#cam-btn').show('slow')
    $('#trash').hide('slow')
    $('#rec').show('slow')
    $('#download-btn').hide('slow')
    $('#local-video').prop('srcObject', window.stream).prop('src', null)
  }
}

const application = {
  init: () => {
    $('#fullscreen-btn').find('path:even').hide()
    $('#pause').hide()
    $('#play').hide()
    $('#trash').hide()
    $('#rec').hide()
    $('#snap-btn').hide()
    $('#fullscreen-btn').hide()
    $('#stop-btn').hide()
    $('#rec').click(function (e) {
      if (!window.recorder) {
        recorder.init()
      }
      window.recorder.start(500)
    })

    $('#download-btn').click(function () {
      $(this).text().includes('Image')
        ? media.backToLiveFromSnap()
        : media.backToLiveFromRec()
    })
    $('#trash').click(function () {
      $('#download-btn').text().includes('Image')
        ? media.backToLiveFromSnap()
        : media.backToLiveFromRec()
    })
    $('#fullscreen-btn').click(function (e) {
      const video = $('.video')[0]
      if ($(this).attr('fill') === '#fff') {
        controls.enableFullscreen(video)
      } else {
        controls.disableFullscreen(video)
      }
      controls.toggleFullscreenBtn()
    })

    $('#pause').click(function () {
      if (window.recorder.state === 'recording') {
        window.recorder.pause()
      } else if (window.recorder.state === 'paused') {
        window.recorder.resume()
      } else if ($('#local-video').prop('srcObject') === null) {
        $('#local-video')[0].pause()
      }
    })
    $('#play').click(function () {
      $('#local-video')[0].play()
    })

    $('#stop-btn').click(function () {
      window.recorder.stop()
    })
    $('#cam-btn').click(async function (e) {
      if (!window.stream) {
        await stream.init()
      }
      if (e.target.innerHTML === 'Show Cam') {
        stream.enableStream()
      } else {
        stream.disableStream()
      }
    })
    $('#setting-btn').click(function () {
      $('#settings').slideToggle()
    })
    $('#snap-btn').click(e => {
      controls.takeSnapShot()
    })
  }
}
$(document).ready(() => {
  application.init()
  media.init()
})
// const green = () => {
//   pixels = context.getImageData(0, 0, video.videoWidth, video.videoHeight)

//   for (let i = 0; i < pixels.data.length; i = i + 4) {
//   }

//   context.putImageData(pixels, 0, 0)
// }
