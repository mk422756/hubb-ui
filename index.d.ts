// references.d.ts
/**
 * Extends interfaces in Vue.js
 */

import Vue, { ComponentOptions } from 'vue'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // This adds the `middleware` property to the existing `vue/types/options/ComponentOptions` type
    apollo?: string | any
  }
}
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Time: any
}

export interface Mutation {
  __typename?: 'Mutation'
  createUser: User
  updateUser: User
  deleteUser: Scalars['Boolean']
  createPage: Page
  updatePage: Page
  deletePage: Scalars['Boolean']
}

export interface MutationCreateUserArgs {
  input: NewUser
}

export interface MutationUpdateUserArgs {
  id: Scalars['ID']
  input: UpdateUser
}

export interface MutationDeleteUserArgs {
  id: Scalars['ID']
}

export interface MutationCreatePageArgs {
  input: NewPage
}

export interface MutationUpdatePageArgs {
  id: Scalars['ID']
  input: UpdatePage
}

export interface MutationDeletePageArgs {
  id: Scalars['ID']
}

export interface NewPage {
  text: Scalars['String']
  name: Scalars['String']
  userId: Scalars['ID']
  tags?: Maybe<Maybe<Scalars['String']>[]>
}

export interface NewUser {
  name: Scalars['String']
  accountId: Scalars['String']
  uid: Scalars['String']
}

export interface Page {
  __typename?: 'Page'
  id: Scalars['ID']
  name: Scalars['String']
  text: Scalars['String']
  user: User
  image: Scalars['String']
  tags: Tag[]
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
}

export interface Query {
  __typename?: 'Query'
  users: User[]
  user: User
  pages: Page[]
  page: Page
  tags: Tag[]
  tag: Tag
}

export interface QueryUserArgs {
  id?: Maybe<Scalars['ID']>
  accountId?: Maybe<Scalars['String']>
  uid?: Maybe<Scalars['String']>
}

export interface QueryPageArgs {
  id?: Maybe<Scalars['ID']>
}

export interface QueryTagArgs {
  id?: Maybe<Scalars['ID']>
}

export interface Tag {
  __typename?: 'Tag'
  id: Scalars['ID']
  name: Scalars['String']
  pages: Page[]
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
}

export interface UpdatePage {
  text?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  tags?: Maybe<Maybe<Scalars['String']>[]>
}

export interface UpdateUser {
  name?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  twitter?: Maybe<Scalars['String']>
  instagram?: Maybe<Scalars['String']>
  facebook?: Maybe<Scalars['String']>
  homepage?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
}

export interface User {
  __typename?: 'User'
  id: Scalars['ID']
  uid: Scalars['String']
  name: Scalars['String']
  accountId: Scalars['String']
  image: Scalars['String']
  description: Scalars['String']
  twitter: Scalars['String']
  instagram: Scalars['String']
  facebook: Scalars['String']
  homepage: Scalars['String']
  pages: Page[]
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
}
