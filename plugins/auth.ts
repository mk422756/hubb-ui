import { auth } from '~/plugins/firebase'

export default ({ app, store }: { app: any; store: any }): void => {
  auth.onAuthStateChanged(
    async (user): Promise<void> => {
      if (user) {
        store.dispatch('user/fetchUser', { uid: user.uid }).catch((): void => {
          // 5回リトライしてユーザー情報を取得できなければエラー
          let count = 0
          const id = setInterval(function(): void {
            store
              .dispatch('user/fetchUser', { uid: user.uid })
              .then((): void => {
                clearInterval(id)
              })
            if (count > 5) {
              clearInterval(id)
            }
            count++
          }, 1000)
        })

        const idToken = await user.getIdToken(/* forceRefresh */ true)
        await app.$apolloHelpers.onLogin(idToken)
      } else {
        store.dispatch('user/resetUser')
        await app.$apolloHelpers.onLogout()
      }
    }
  )
}
