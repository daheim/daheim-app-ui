
export const LOAD_USER = 'users.loadUser'
export const loadUser = ({id}) => {
  return {
    type: LOAD_USER,
    meta: {
      api: {
        body: {id}
      }
    }
  }
}
