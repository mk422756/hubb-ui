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
  createPage: Page
}

export interface MutationCreateUserArgs {
  input: NewUser
}

export interface MutationUpdateUserArgs {
  id: Scalars['ID']
  input: UpdateUser
}

export interface MutationCreatePageArgs {
  input: NewPage
}

export interface NewPage {
  text: Scalars['String']
  name: Scalars['String']
  userId: Scalars['ID']
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
}

export interface Query {
  __typename?: 'Query'
  users: User[]
  user: User
  pages: Page[]
  page: Page
}

export interface QueryUserArgs {
  id?: Maybe<Scalars['ID']>
  accountId?: Maybe<Scalars['String']>
  uid?: Maybe<Scalars['String']>
}

export interface QueryPageArgs {
  id?: Maybe<Scalars['ID']>
}

export interface UpdateUser {
  name?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  twitter?: Maybe<Scalars['String']>
  instagram?: Maybe<Scalars['String']>
  facebook?: Maybe<Scalars['String']>
  homepage?: Maybe<Scalars['String']>
  birthday?: Maybe<Scalars['String']>
}

export interface User {
  __typename?: 'User'
  id: Scalars['ID']
  name: Scalars['String']
  accountId: Scalars['String']
  image: Scalars['String']
  description: Scalars['String']
  twitter: Scalars['String']
  instagram: Scalars['String']
  facebook: Scalars['String']
  homepage: Scalars['String']
  birthday: Scalars['String']
  pages: Page[]
}
