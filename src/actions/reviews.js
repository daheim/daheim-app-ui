export const SEND_REVIEW = 'review.sendReview'
export const sendReview = (body) => {
  return {
    type: SEND_REVIEW,
    meta: {
      api: {body}
    }
  }
}
