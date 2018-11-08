$(document).ready(() => {
  $('#pause').hide()
  $('#play').hide()

  function disableToggle (btn, op) {
    $(btn).prop('disabled', op)
  }
  function downloadLinkSetup (url, ext, type) {
    const downloadBtn = $('#download-btn')
    downloadBtn.html(`Download ${type}`)
    downloadBtn.prop('href', url)
    downloadBtn.prop('download', `test.${ext}`)
    downloadBtn.show('slow')
  }
  $('#download-btn').click(function () {
    $(this).hide('slow')
  })
  function setupRecorder () {
    window.recordedBlobs = []
    window.recorder = new MediaRecorder(window.stream)
    window.recorder.ondataavailable = blob => {
      window.recordedBlobs.push(blob.data)
    }

    window.recorder.onstop = e => {
      const url = window.URL.createObjectURL(
        new Blob(window.recordedBlobs, { type: 'video/webm' })
      )
      $('#local-video')[0].srcObject = null
      $('#local-video').attr('src', url)

      window.recordedBlobs = []
      downloadLinkSetup(url, 'webm', 'Video')
    }
  }

  function handleError (err) {
    console.log(err)
  }

  $('#fullscreen-btn').click(function (e) {
    let video = $('.video')[0]

    if (e.target.innerHTML === 'FullScreen') {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      }
      $('#cam-btn').hide()
      $(this).html('Exit FullScreen')
    } else {
      if (video.requestFullscreen) {
        document.exitFullscreen()
      } else if (video.mozRequestFullScreen) {
        document.mozExitFullScreen()
      } else if (video.webkitRequestFullscreen) {
        document.webkitExitFullscreen()
      }
      $('#cam-btn').show()

      $(this).html('FullScreen')
    }
  })

  $('#rec').click(function (e) {
    if ($('#rec').is(':visible')) {
      if (!window.recorder) {
        setupRecorder()
      }

      window.recorder.start(500)
      $('#rec').hide()
      $('#pause').show()
      disableToggle('#snap-btn', false)
      $('#cam-btn').hide('slow')
    }
  })

  $('#pause').click(function () {
    if (window.recorder.state === 'recording') {
      $('#pause').attr('fill', '#0095ff')
      $('#pause').attr('stroke', '#0095ff')

      window.recorder.pause()
    } else if (window.recorder.state === 'paused') {
      $('#pause').attr('fill', '#fff')
      $('#pause').attr('stroke', '#fff')
      window.recorder.resume()
    } else if ($('#local-video')[0].srcObject === null) {
      $('#local-video')[0].pause()
      $('#pause').hide()

      $('#play').show()
    }
  })
  $('#play').click(function () {
    console.log($('#local-video')[0].state)
  })
  $('#stop-btn').click(function () {
    if (window.recorder && window.recorder.state !== 'inactive') {
      window.recorder.stop()
    }
  })
  $('#cam-btn').click(async function (e) {
    if (!window.stream) {
      await navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          console.log('got stream')

          window.stream = stream
          console.log(window.stream)
          $('#local-video')[0].srcObject = window.stream
        })
        .catch(handleError)
    }
    if (e.target.innerHTML === 'Show Cam') {
      $(this).html('Hide Cam')
      disableToggle('#snap-btn', false)
      disableToggle('#fullscreen-btn', false)
      window.stream.getVideoTracks()[0].enabled = true
    } else {
      $(this).html('Show Cam')
      disableToggle('#snap-btn', true)
      disableToggle('#fullscreen-btn', true)

      window.stream.getVideoTracks()[0].enabled = false
    }
  })
  $('#setting-btn').click(function () {
    $('#settings').slideToggle()
  })
  $('#snap-btn').click(e => {
    const type = $('#image-type').val()
    const video = $('#local-video')[0]
    $('#preview-canvas').attr('height', video.videoHeight)
    $('#preview-canvas').attr('width', video.videoWidth)
    context = $('#preview-canvas')[0].getContext('2d')
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    const url = $('#preview-canvas')[0].toDataURL(`image/${type}`, 1.0)
    downloadLinkSetup(url, type, 'Photo')
  })
})
const green = () => {
  pixels = context.getImageData(0, 0, video.videoWidth, video.videoHeight)

  for (let i = 0; i < pixels.data.length; i = i + 4) {
  }

  context.putImageData(pixels, 0, 0)
}
