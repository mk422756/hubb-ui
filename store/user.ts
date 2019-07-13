/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import gql from 'graphql-tag'
import { User } from '..'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface UsersState {
  user: User
}

export const state = () => ({
  user: null
})

export const actions: ActionTree<UsersState, RootState> = {
  fetchUser({ commit }, { uid }) {
    return new Promise(async (resolve, reject) => {
      try {
        let client = (this as any).app.apolloProvider.defaultClient
        const ret = await client.query({
          query: gql`
            query findUser($uid: String!) {
              user(uid: $uid) {
                uid
                id
                name
                accountId
                image
                description
                twitter
                facebook
                instagram
                homepage
                image
                birthday
              }
            }
          `,
          variables: {
            uid: uid
          }
        })
        commit('updateUser', ret.data.user)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  updateUser({ commit }, { user }) {
    commit('updateUser', user)
  },

  resetUser({ commit }) {
    commit('updateUser', null)
  }
}

export const mutations: MutationTree<UsersState> = {
  updateUser(state, user: User) {
    state.user = user
  }
}

export const getters: GetterTree<UsersState, RootState> = {
  isLogin: state => {
    return state.user ? true : false
  },

  isMyAccountId: state => (accountId: string) => {
    if (!state.user) {
      return false
    }
    return state.user.accountId === accountId
  }
}
