import { auth } from '~/plugins/firebase'

export default ({ app, store }: { app: any; store: any }): void => {
  auth.onAuthStateChanged(
    async (user): Promise<void> => {
      if (user) {
        console.log('login success')
        const idToken = await user.getIdToken(/* forceRefresh */ true)
        await app.$apolloHelpers.onLogin(idToken)
        store.dispatch('user/updateUser', { uid: user.uid })
      } else {
        await app.$apolloHelpers.onLogout()
        store.dispatch('user/resetUser')
      }
    }
  )
}
