/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import gql from 'graphql-tag'
import { User } from '~/type'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface UsersState {
  user: User
}

export const state = () => ({
  user: null
})

export const actions: ActionTree<UsersState, RootState> = {
  updateUser({ commit }, { uid }) {
    return new Promise(async (resolve, reject) => {
      try {
        let client = (this as any).app.apolloProvider.defaultClient
        const ret = await client.query({
          query: gql`
            query findUser($uid: String!) {
              user(uid: $uid) {
                name
                accountId
                image
                description
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

  resetUser({ commit }) {
    commit('updateUser', null)
  }
  // updateUser({ state, commit, dispatch }) {
  //   return new Promise((resolve, reject) => {
  //     auth.onAuthStateChanged(async authUser => {
  //       if (authUser) {
  //         commit('updateId', authUser.uid)
  //         commit('updateEmail', authUser.email)
  //         dispatch('fetchUser')
  //         dispatch('fetchPages')
  //         dispatch('fetchTimeline')

  //         resolve()
  //       } else {
  //         reject()
  //       }
  //     })
  //   })
  // }
}

export const mutations: MutationTree<UsersState> = {
  updateUser(state, user: User) {
    state.user = user
  }
}

export const getters: GetterTree<UsersState, RootState> = {
  // getUser: (state): User => {
  //   return {
  //     id: state.id,
  //     data: state.data
  //   }
  // }
}
