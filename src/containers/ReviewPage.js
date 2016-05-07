import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
// import StarRating from 'react-star-rating'
import RadioButton, {RadioButtonGroup} from 'material-ui/RadioButton'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import {load} from '../actions/reviews'
import LoadingPanel from '../components/LoadingPanel'

console.warn('get new star rating component in ReviewPage')
class StarRating extends React.Component {
  render () {
    return <div>stars</div>
  }
}

console.warn('handle save in ReviewPage')

export class ProficiencyRating extends React.Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    itemStyle: React.PropTypes.object,
    values: React.PropTypes.object,
    style: React.PropTypes.object,
    value: React.PropTypes.string
  }

  static defaultProps = {
    values: {
      1: 'Einige Wörter',
      2: 'Einige Sätze',
      3: 'Fähig, ein fließendes Gespräch über einfach Themen zu führen',
      4: 'Fähig, ein Gespräch über komplexe Themen zu führen',
      5: 'Deutsch-Profi'
    }
  }

  handleChange = (e) => {
    if (this.props.onChange) { this.props.onChange(e) }
  }

  render () {
    if (this.props.readOnly) {
      return <div style={this.props.itemStyle}>{this.props.values[this.props.value] || 'N/A'}</div>
    }

    return (
      <RadioButtonGroup style={this.props.style} name='shipSpeed' valueSelected={this.props.value} onChange={this.handleChange}>
        {Object.keys(this.props.values).map((key) =>
          <RadioButton key={key} style={this.props.itemStyle} value={key} label={this.props.values[key]} />
        )}
      </RadioButtonGroup>
    )
  }
}

export class PersonalRating extends React.Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    data: React.PropTypes.shape({
      overall: React.PropTypes.number,
      language: React.PropTypes.number
    })
  }

  handleOverallChange = (eIgnored, {rating}) => {
    if (this.props.onChange) {
      this.props.onChange(Object.assign({}, this.props.data, {overall: rating}))
    }
  }

  handleLanguageChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(Object.assign({}, this.props.data, {language: parseInt(e.target.value)}))
    }
  }

  render () {
    if (this.props.readOnly && !this.props.data) {
      return <p>No review given yet</p>
    }

    let data = this.props.data || {}

    return (
      <div>
        <div>
          Overall experience:
          <div>
            <StarRating name='overall' totalStars={5} disabled={this.props.readOnly} rating={data.overall} onRatingClick={this.handleOverallChange} />
          </div>
        </div>
        <div style={{paddingTop: 10}}>
          Language Proficiency:
          <div>
            <ProficiencyRating itemStyle={{paddingTop: 6}} readOnly={this.props.readOnly} value={String(data.language)} onChange={this.handleLanguageChange} />
          </div>
        </div>
      </div>
    )
  }
}

export class LessonReview extends React.Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    data: React.PropTypes.shape({
      overall: React.PropTypes.number,
      words: React.PropTypes.string,
      good: React.PropTypes.string,
      bad: React.PropTypes.string
    })
  }

  handleOverallChange = (eIgnored, {rating}) => {
    if (this.props.onChange) {
      this.props.onChange(Object.assign({}, this.props.data, {overall: rating}))
    }
  }

  handleWordsChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(Object.assign({}, this.props.data, {words: e.target.value}))
    }
  }

  handleGoodChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(Object.assign({}, this.props.data, {good: e.target.value}))
    }
  }

  handleBadChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(Object.assign({}, this.props.data, {bad: e.target.value}))
    }
  }

  render () {
    if (this.props.readOnly && !this.props.data) {
      return <p>No review given yet</p>
    }

    let data = this.props.data || {}

    return (
      <div>
        <div>
          Overall experience:
          <div>
            <StarRating name='overall' disabled={this.props.readOnly} rating={data.overall} onRatingClick={this.handleOverallChange} />
          </div>
        </div>
        <div>
          <TextField
            hintText='Welche deutschen Wörter habt ihr besonders häufig verwendet?'
            floatingLabelText='Häufig verwendete Wörter'
            multiLine
            rows={1}
            rowsMax={4}
            fullWidth
            value={data.words}
            onChange={this.handleWordsChange}
          />
        </div>
        <div>
          <TextField
            hintText='Welche deutschen Wörter habt ihr besonders häufig verwendet?'
            floatingLabelText='Gut gefallen'
            multiLine
            rows={1}
            rowsMax={4}
            fullWidth
            onChange={this.handleGoodChange}
          />
        </div>
        <div>
          <TextField
            hintText='Was hat dir nicht an dem Gespräch gefallen?'
            floatingLabelText='Nicht gefallen'
            multiLine
            rows={1}
            rowsMax={4}
            fullWidth
            onChange={this.handleBadChange}
          />
        </div>
      </div>
    )
  }

}

class ReviewPage extends React.Component {

  static propTypes = {
    params: React.PropTypes.shape({
      reviewId: React.PropTypes.string.isRequired
    }).isRequired,
    style: React.PropTypes.object,
    push: React.PropTypes.func.isRequired,
    load: React.PropTypes.func.isRequired,
    review: React.PropTypes.object,
    loading: React.PropTypes.bool
  }

  state = {
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

  handleRatingChange = (data) => {
    this.state.data.myRating = data
    this.forceUpdate()
  }

  handleReviewChange = (data) => {
    this.state.data.myReview = data
    this.forceUpdate()
  }

  handleSave = async (eIgnored) => {
    // this.setState({loading: true})
    // try {
    //   this.state.data = await $.ajax({
    //     method: 'post',
    //     url: '/api/encounters/' + encodeURIComponent(this.props.params.reviewId),
    //     contentType: 'application/json',
    //     data: JSON.stringify({
    //       myRating: this.state.data.myRating,
    //       myReview: this.state.data.myReview,
    //     }),
    //     headers: {Authorization: interop.auth.authHeader()},
    //   })
    //   this.props.push('/')
    // } catch (err) {
    //   alert(this.errorToText(err))
    // } finally {
    //   this.setState({loading: false})
    // }
  }

  goBack = (eIgnored) => {
    this.props.push('/')
  }

  render () {
    const {review, loading} = this.props

    return (
      <div style={Object.assign({background: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 20, paddingTop: 12, maxWidth: 1000, margin: '0 auto'}, this.props.style)}>
        <LoadingPanel loading={loading}>
          {false ? (
            <p style={{textAlign: 'center', color: 'red'}}>{this.errorToText(this.state.error)}</p>
          ) : (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <div style={{flex: '1 1 300px', padding: 10}}>
                <h2>Your Review of the Partner</h2>
                <PersonalRating data={review && review.myRating} onChange={this.handleRatingChange} />

                <h2>Your Review of the Lesson</h2>
                <LessonReview data={review && review.myReview} onChange={this.handleReviewChange} />

                <div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: 10}}>
                  <FlatButton style={{flex: '0 1 auto', marginRight: 10}} label='Zurück' onClick={this.goBack} />
                  <RaisedButton style={{flex: '0 1 auto', marginLeft: 10}} label='Speichern' secondary onClick={this.handleSave} />
                </div>
              </div>

              <div style={{flex: '1 1 150px', padding: 10}}>
                <h2>Partner's Review of You</h2>
                <PersonalRating readOnly data={review && review.partnerRating} />

                <h2>Partner's Review of the Lesson</h2>
                <LessonReview readOnly data={review && review.partnerReview} />
              </div>

            </div>
          )}
        </LoadingPanel>
      </div>
    )
  }
}

export default connect((state, props) => {
  const {params: {reviewId} = {}} = props
  const {reviews, loading} = state.reviews
  const review = reviews.find((review) => review.id === reviewId)
  return {review, loading}
}, {push, load})(ReviewPage)

