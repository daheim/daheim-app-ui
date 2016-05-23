import React, {PropTypes, Component} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import loader from '../../loader'
import {loadUser} from '../../actions/users'
import {sendReview} from '../../actions/reviews'

import Review from './Review'
import SendReview from './SendReview'

import css from './ProfilePage.style'

function roleToTitle (role) {
  switch (role) {
    case 'student': return 'Daheim SchülerIn'
    case 'teacher': return 'Daheim SprachcoachIn'
    default: return 'Daheim BenutzerIn'
  }
}

class ProfilePage extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    me: PropTypes.bool
  }

  state = {
    editorOpen: false
  }

  handleEditorRequestClose = () => {
    this.setState({editorOpen: false})
  }

  handleOpenEditor = () => {
    this.setState({editorOpen: true})
  }

  render () {
    const {user, me} = this.props
    const {id, name, picture, role, myReview, receivedReviews} = user

    const editorOpen = !me && (!myReview || this.state.editorOpen)

    return (
      <div key={id} style={{margin: 16}}>

        <div style={{lineHeight: '150%', display: 'flex', alignItems: 'center', marginBottom: 20, maxWidth: '100%', padding: 10, borderBottom: 'solid 1px #EEE'}}>
          <img src={picture} style={{width: 68, height: 68, borderRadius: '50%', marginTop: 6, boxShadow: '0 1px 1px 1px rgba(0,0,0,.1)', border: 'solid 2px white'}} />
          <div style={{marginLeft: 20}}>
            <div style={{fontSize: 30, fontWeight: 600, fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>{name}</div>
            <div style={{fontSize: 14, fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>{roleToTitle(role)}</div>
          </div>
        </div>

        <div style={{minHeight: 200}}>

          <div className={css.section}>
            <div className={css.sectionTitle}>Personendaten</div>
            <div>
              <div className={css.field}>
                <div className={css.fieldTitle}>Ein Paar Worte über mich</div>
                <div className={css.fieldText}>Personal quote</div>
              </div>
              <div className={css.field}>
                <div className={css.fieldTitle}>Ich wohne in Deutschland seit</div>
                <div className={css.fieldText}>2016</div>
              </div>
            </div>
          </div>

          <div className={css.section}>
            <div className={css.sectionTitle}>Erfahrung</div>
            <div>
              <div className={css.field}>
                <div className={css.fieldTitle}>Ich nutze Daheim seit</div>
                <div className={css.fieldText}>17. Febr. 2016</div>
              </div>
              <div className={css.field}>
                <div className={css.fieldTitle}>Daheim Lektionen</div>
                <div className={css.fieldText}>4 Lektionen, 1 Stunde 47 Minuten</div>
              </div>
            </div>
          </div>

          <div className={css.section}>
            <div className={css.sectionTitle}>Feedback</div>
            <div className={css.sectionContent}>
              {editorOpen ? (
                <div className={css.field}>
                  <div className={css.fieldTitle}>Dein Feedback</div>
                  <div className={css.fieldText}>
                    <SendReview {...this.props} onRequestClose={this.handleEditorRequestClose} />
                  </div>
                </div>
              ) : undefined}

              {myReview ? <Review key={myReview.from} {...this.props} mine review={myReview} onRequestEdit={this.handleOpenEditor} /> : undefined}

              {receivedReviews.map((review) => {
                if (myReview && review.from === myReview.from) return
                return <Review key={review.from} {...this.props} review={review} />
              })}

            </div>
          </div>

        </div>
      </div>
    )
  }
}

const loaded = loader({
  shouldReload (prevProps, nextProps) {
    return prevProps.userId !== nextProps.userId
  },

  isLoaded (props) {
    return props.user
  },

  load (nextProps) {
    const {userMeta} = nextProps
    const {loading} = userMeta || {}

    if (!loading) nextProps.loadUser({id: nextProps.userId})
  },

  key (props) {
    return props.user.id
  }
})(ProfilePage)

export default connect((state, props) => {
  let {userId} = props.params
  userId = userId.toLowerCase()

  const user = state.users.users[userId]
  const userMeta = state.users.usersMeta[userId]
  const {profile: {profile}} = state
  const me = profile.id === userId
  return {me, user, userMeta, userId}
}, {push, loadUser, sendReview})(loaded)
