/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type BankDto = {
  id: Scalars['Float']['input'];
  ngay_den_han?: InputMaybe<Scalars['Float']['input']>;
  ngay_sao_ke?: InputMaybe<Scalars['Int']['input']>;
  noi_dung: Scalars['String']['input'];
  so_tien?: InputMaybe<Scalars['Float']['input']>;
};

export type BankEntity = {
  __typename?: 'BankEntity';
  chiTieus: Array<ChiTieuEntity>;
  id: Scalars['Int']['output'];
  ngay_den_han: Scalars['Float']['output'];
  ngay_sao_ke: Scalars['Float']['output'];
  noi_dung: Scalars['String']['output'];
};

export type ChiTieuDto = {
  bank?: InputMaybe<BankDto>;
  bank_id?: InputMaybe<Scalars['Int']['input']>;
  ghi_chu?: InputMaybe<Scalars['String']['input']>;
  noi_dung: Scalars['String']['input'];
  so_tien?: InputMaybe<Scalars['Float']['input']>;
};

export type ChiTieuEntity = {
  __typename?: 'ChiTieuEntity';
  bank?: Maybe<BankEntity>;
  ghi_chu: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  noi_dung: Scalars['String']['output'];
  so_tien: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createChiTieu: ChiTieuEntity;
  updateChiTieu: ChiTieuEntity;
};


export type MutationCreateChiTieuArgs = {
  chiTieuDto: ChiTieuDto;
};


export type MutationUpdateChiTieuArgs = {
  chiTieuDto: ChiTieuDto;
  id: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  data: Array<ChiTieuEntity>;
  getChiTieu: ChiTieuEntity;
};


export type QueryGetChiTieuArgs = {
  id: Scalars['Float']['input'];
};

export type GetChiTieusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChiTieusQuery = { __typename?: 'Query', data: Array<{ __typename?: 'ChiTieuEntity', id: number, noi_dung: string, so_tien: number, ghi_chu: string }> };

export type CreateChiTieuMutationVariables = Exact<{
  chiTieuDto: ChiTieuDto;
}>;


export type CreateChiTieuMutation = { __typename?: 'Mutation', createChiTieu: { __typename?: 'ChiTieuEntity', id: number, noi_dung: string, so_tien: number, ghi_chu: string } };


export const GetChiTieusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChiTieus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noi_dung"}},{"kind":"Field","name":{"kind":"Name","value":"so_tien"}},{"kind":"Field","name":{"kind":"Name","value":"ghi_chu"}}]}}]}}]} as unknown as DocumentNode<GetChiTieusQuery, GetChiTieusQueryVariables>;
export const CreateChiTieuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChiTieu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chiTieuDto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChiTieuDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChiTieu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chiTieuDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chiTieuDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noi_dung"}},{"kind":"Field","name":{"kind":"Name","value":"so_tien"}},{"kind":"Field","name":{"kind":"Name","value":"ghi_chu"}}]}}]}}]} as unknown as DocumentNode<CreateChiTieuMutation, CreateChiTieuMutationVariables>;