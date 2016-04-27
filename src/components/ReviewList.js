import React from 'react'
import moment from 'moment'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import LoadingPanel from './LoadingPanel'
import Panel from './Panel'
import {load} from '../actions/reviews'

class ReviewList extends React.Component {

  static propTypes = {
    style: React.PropTypes.object,
    load: React.PropTypes.func.isRequired,
    reviews: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  async componentDidMount () {
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

  errorToText (error) {
    if (!error.status) {
      return 'No network'
    } else {
      let text = error.statusText
      try {
        text = JSON.parse(error.responseText).error
      } catch (errIgnored) {
        // ignored
      }
      return `${error.status}: ${text}`
    }
  }

  render () {
    const {loading, reviews} = this.props

    return (
      <Panel style={this.props.style}>
        <h1 className='md-headline'>Recent Lessons</h1>
        <LoadingPanel loading={loading}>
          {false ? (
            <p style={{textAlign: 'center', color: 'red'}}>{this.errorToText(this.state.error)}</p>
          ) : (
            reviews.length ? (
              <table style={{width: '100%'}}>
                <thead>
                  <tr>
                    <th style={{textAlign: 'left'}}>Date</th>
                    <th style={{textAlign: 'left'}}>Partner</th>
                    <th style={{textAlign: 'left'}}>Length</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((encounter) => {
                    return (
                      <tr key={encounter.id}>
                        <td><Link to={'/reviews/' + encounter.id}>{moment(encounter.date).format('lll')}</Link></td>
                        <td>{encounter.partnerName || '[kein Name]'}</td>
                        <td>{this.msToString(encounter.length)}</td>
                        <td style={{textAlign: 'right'}}>{encounter.myReview ? 'reviewed' : 'needs review'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{textAlign: 'center'}}>Haven't yet had any lessons. <Link to='/video'>Start one now.</Link></p>
            )
          )}
        </LoadingPanel>
      </Panel>
    )
  }
}

export default connect((state) => {
  const {reviews, loading} = state.reviews
  return {reviews, loading}
}, {load})(ReviewList)
