import React from 'react'
import moment from 'moment'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import LoadingPanel from '../LoadingPanel'
import {load} from '../../actions/reviews'

import css from './ReviewList.style'

class ReviewList extends React.Component {

  static propTypes = {
    style: React.PropTypes.object,
    load: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    reviews: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
    error: React.PropTypes.string
  }

  componentDidMount () {
    this.props.load()
  }

  retry = (e) => {
    e.preventDefault()
    this.props.load()
  }

  msToString (ms) {
    if (typeof ms !== 'number') {
      return ''
    }
    let secs = Math.floor((ms / 1000) % 60)
    let mins = Math.floor(ms / 1000 / 60)
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  handleRowClick (e, encounter) {
    this.props.push(`/reviews/${encounter.id}`)
  }

  render () {
    const {loading, reviews, error, style} = this.props
    const mergedStyle = {
      maxWidth: 600,
      ...style
    }

    return (
      <div {...this.props} style={mergedStyle}>
        <h2>Vorherige Lektionen</h2>
        <LoadingPanel loading={loading}>
          {error ? (
            <p style={{textAlign: 'center', color: 'darkred'}}>{error}. <a href='#' onClick={this.retry}>nochmal versuchen</a></p>
          ) : (
            reviews.length ? (
              <table style={{width: '100%', borderCollapse: 'collapse'}} spacing='0'>
                <thead>
                  <tr>
                    <th style={{textAlign: 'left'}}>Datum</th>
                    <th style={{textAlign: 'left'}}>Partner</th>
                    <th style={{textAlign: 'left'}}>Länge</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((encounter) => {
                    const handler = (e) => this.handleRowClick(e, encounter)
                    return (
                      <tr key={encounter.id} className={css.line} onClick={handler}>
                        <td style={{padding: '4px 0'}}>{moment(encounter.date).format('lll')}</td>
                        <td>{encounter.partnerName || '[kein Name]'}</td>
                        <td>{this.msToString(encounter.length)}</td>
                        <td style={{textAlign: 'right'}}>{encounter.myReview ? 'reviewed' : 'needs review'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{textAlign: 'center'}}>Du hast noch keine vorherige Lektionen.</p>
            )
          )}
        </LoadingPanel>
      </div>
    )
  }
}

export default connect((state) => {
  const {reviews, loading, error} = state.reviews
  return {reviews, loading, error}
}, {load, push})(ReviewList)
