import { TypeWithID } from '../../config/types';
import { PaginatedDocs } from '../../../mongoose/types';
import { Document, Where } from '../../../types';
import { Payload } from '../../..';
import { PayloadRequest } from '../../../express/types';
import find from '../find';
import { getDataLoader } from '../../dataloader';

export type Options = {
  collection: string
  depth?: number
  currentDepth?: number
  page?: number
  limit?: number
  locale?: string
  fallbackLocale?: string
  user?: Document
  overrideAccess?: boolean
  disableErrors?: boolean
  showHiddenFields?: boolean
  pagination?: boolean
  sort?: string
  where?: Where
  draft?: boolean
  req?: PayloadRequest
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function findLocal<T extends TypeWithID = any>(payload: Payload, options: Options): Promise<PaginatedDocs<T>> {
  const {
    collection: collectionSlug,
    depth,
    currentDepth,
    page,
    limit,
    where,
    locale = payload.config.localization ? payload.config.localization?.defaultLocale : null,
    fallbackLocale = null,
    user,
    overrideAccess = true,
    disableErrors,
    showHiddenFields,
    sort,
    draft = false,
    pagination = true,
    req: incomingReq,
  } = options;

  const collection = payload.collections[collectionSlug];

  const req = {
    user: undefined,
    ...incomingReq || {},
    payloadAPI: 'local',
    locale: locale || incomingReq?.locale || (payload?.config?.localization ? payload?.config?.localization?.defaultLocale : null),
    fallbackLocale: fallbackLocale || incomingReq?.fallbackLocale || null,
    payload,
  } as PayloadRequest;

  if (!req.payloadDataLoader) req.payloadDataLoader = getDataLoader(req);

  if (typeof user !== 'undefined') req.user = user;

  return find({
    depth,
    currentDepth,
    sort,
    page,
    limit,
    where,
    collection,
    overrideAccess,
    disableErrors,
    showHiddenFields,
    draft,
    pagination,
    req,
  });
}
