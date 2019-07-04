import { auth } from '~/plugins/firebase'

export default ({ app, store }: { app: any; store: any }): void => {
  auth.onAuthStateChanged(
    async (user): Promise<void> => {
      if (user) {
        store.dispatch('user/fetchUser', { uid: user.uid })
        const idToken = await user.getIdToken(/* forceRefresh */ true)
        await app.$apolloHelpers.onLogin(idToken)
      } else {
        store.dispatch('user/resetUser')
        await app.$apolloHelpers.onLogout()
      }
    }
  )
}
