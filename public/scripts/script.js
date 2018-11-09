// to do
// fix transitions from recorded preview back to live view
// add replay button
// add preview button for snapshots
// add transition from still preview to live view

$(document).ready(() => {
  $('#fullscreen-btn').find('path:even').hide()
  $('#pause').hide()
  $('#play').hide()
  $('#local-video')[0].onended = function () {
    $('#play').show('slow')
    $('#pause').hide('slow')
  }
  jQuery.fn.rotate = function (deg) {
    $(this).css({
      '-webkit-transform': 'rotate(' + deg + 'deg)',
      '-moz-transform': 'rotate(' + deg + 'deg)',
      '-ms-transform': 'rotate(' + deg + 'deg)',
      transform: 'rotate(' + deg + 'deg)'
    })
    return $(this)
  }
  function disableToggle (btn, op) {
    $(btn).prop('disabled', op)
  }
  function downloadLinkSetup (url, ext, type) {
    $('#download-btn')
      .html(`Download ${type}`)
      .prop('href', url)
      .prop('download', `test.${ext}`)
      .show('slow')
  }
  $('#download-btn').click(function () {
    $(this).hide('slow')
    if ($('#local-video').is(':hidden')) {
      $('#preview-canvas').hide()
      $('#local-video').show()
    } else {
      $('#local-video').prop('srcObject', window.stream)
    }
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
      $('#local-video').prop('srcObject', null).attr('src', url)
      window.recordedBlobs = []
      downloadLinkSetup(url, 'webm', 'Video')
    }
  }

  function handleError (err) {
    console.log(err)
  }

  $('#fullscreen-btn').click(function (e) {
    let video = $('.video')[0]

    if ($(this).attr('fill') === '#fff') {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      }
      $('#fullscreen-btn').attr('fill', '#0095ff').attr('stroke', '#0095ff')
      $('#cam-btn').hide('slow')
    } else {
      if (video.requestFullscreen) {
        document.exitFullscreen()
      } else if (video.mozRequestFullScreen) {
        document.mozExitFullScreen()
      } else if (video.webkitRequestFullscreen) {
        document.webkitExitFullscreen()
      }
      $('#fullscreen-btn').attr('fill', '#fff').attr('stroke', '#fff')
      $('#cam-btn').show('slow')
    }
    $('#fullscreen-btn').find('path').toggle('slow')
  })

  $('#rec').click(function (e) {
    if (!window.recorder) {
      setupRecorder()
    }
    window.recorder.start(500)
    $(this).hide()
    $('#pause').show('slow')
    disableToggle('#snap-btn', false)
    $('#cam-btn').hide('slow')
  })

  $('#pause').click(function () {
    if (window.recorder.state === 'recording') {
      $(this).attr('fill', '#0095ff').attr('stroke', '#0095ff')
      window.recorder.pause()
    } else if (window.recorder.state === 'paused') {
      $(this).attr('fill', '#fff').attr('stroke', '#fff')
      window.recorder.resume()
    } else if ($('#local-video').prop('srcObject') === null) {
      $('#local-video')[0].pause()
      $(this).hide('slow')
      $('#play').show('slow')
    }
  })
  $('#play').click(function () {
    $('#pause').attr('fill', '#fff').attr('stroke', '#fff').show('slow')
    $(this).hide('slow')
    $('#local-video')[0].play()
  })

  $('#stop-btn').click(function () {
    if (window.recorder && window.recorder.state !== 'inactive') {
      window.recorder.stop()
    } else if ($('#local-video')[0].paused || $('#local-video')[0].playing) {
      $('#local-video')[0].stop()
    }
  })
  $('#cam-btn').click(async function (e) {
    if (!window.stream) {
      await navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          window.stream = stream
          $('#local-video').prop('srcObject', window.stream)
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
    downloadLinkSetup(url, type, 'Photo')
  })
})
// const green = () => {
//   pixels = context.getImageData(0, 0, video.videoWidth, video.videoHeight)

//   for (let i = 0; i < pixels.data.length; i = i + 4) {
//   }

//   context.putImageData(pixels, 0, 0)
// }
