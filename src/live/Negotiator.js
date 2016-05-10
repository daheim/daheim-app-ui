import 'webrtc-adapter'

export default class Negotiator {

  static RELAY_TYPES = {offer: 1, answer: 1, ice: 1, error: 1}

  constructor ({negotiationId, relay}) {
    this.relay = relay
    this.negotiationId = negotiationId
  }

  start ({initiator}) {
    if (this.promise) return this.promise
    this.promise = this.negotiate({initiator})
    return this.promise
  }

  handleRelay (data) {
    const {type, negotiationId} = data
    if (negotiationId !== this.negotiationId) {
      throw new Error('invalidNegotiationId')
    }

    if (type === 'offer') {
      this.handleOffer(data.sdp)
    } else if (type === 'answer') {
      this.handleAnswer(data.sdp)
    } else if (type === 'ice') {
      if (!data.candidate) return
      this.ice(data.candidate)
    } else if (type === 'error') {
      this.handleError(data)
    } else {
      throw new Error('not handled relay type')
    }
  }

  handleError (err) {
    this.onError(err)
    this.close()
  }

  setProgress (progress) {
    this.progress = progress
    if (this.onProgress) this.onProgress()
  }

  async relayNoThrow (...args) {
    try {
      await this.relay(...args)
    } catch (err) {
      // ignore
    }
  }

  handleTimeoutError () {
    const err = new Error('negotiation timeout')
    this.relayNoThrow({type: 'error', negotiationId: this.negotiationId, message: err.message || err})
    this.handleError(err)
  }

  async negotiate ({initiator}) {
    const {negotiationId, relay, relayNoThrow} = this
    const timeout = setTimeout(() => this.handleTimeoutError(), 60000)

    try {
      const offerPromise = new Promise((resolve) => { this.handleOffer = (offer) => resolve(offer) })
      const answerPromise = new Promise((resolve) => { this.handleAnswer = (answer) => resolve(answer) })

      const iceBox = []
      this.ice = (candidate) => iceBox.push(candidate)

      const pc = this.pc = new window.RTCPeerConnection({iceServers: [{url: 'stun:stun.easyrtc.com:3478'}]})

      //
      // this is the first point of return
      //

      // get media stream
      const localStream = this.localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
      if (this.closed) throw this.freeResourcesAndThrow()

      // initialize RTCPeerConnection
      const remoteStreamPromise = new Promise((resolve) => { pc.onaddstream = (e) => resolve(e.stream) })
      pc.onicecandidate = (e) => relayNoThrow({type: 'ice', negotiationId, candidate: e.candidate})
      pc.addStream(localStream)
      pc.oniceconnectionstatechange = (e) => {
        const ice = e.target.iceConnectionState
        if (ice === 'failed' || ice === 'disconnected') {
          this.onError(new Error('ice disconnected'))
        }
      }

      // do the dance
      if (initiator) {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        await relay({type: 'offer', negotiationId, sdp: offer.sdp})

        const answerSdp = await answerPromise
        const answer = new RTCSessionDescription({sdp: answerSdp, type: 'answer'})
        pc.setRemoteDescription(answer)
      } else {
        const offerSdp = await offerPromise
        const offer = new RTCSessionDescription({sdp: offerSdp, type: 'offer'})
        await pc.setRemoteDescription(offer)

        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        await relay({type: 'answer', negotiationId, sdp: answer.sdp})
      }

      // change ice function to real one and replay cached candidates
      this.ice = (candidate) => pc.addIceCandidate(new RTCIceCandidate(candidate))
      for (let candidate of iceBox) this.ice(candidate)

      // wait for remote stream
      this.remoteStream = await remoteStreamPromise

      clearTimeout(timeout)
      if (this.closed) this.freeResourcesAndThrow()

      return pc
    } catch (err) {
      relayNoThrow({type: 'error', negotiationId, message: err.message || err})
      this.handleError(err)
      throw err
    }
  }

  freeResourcesAndThrow () {
    this.close()
    throw new Error('negotiator closed')
  }

  close () {
    this.closed = true

    if (this.localStream) {
      for (let track of this.localStream.getTracks()) track.stop()
    }

    if (this.pc && this.pc.signalingState !== 'closed') this.pc.close()
  }

}
