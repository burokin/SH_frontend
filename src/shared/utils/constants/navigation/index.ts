export const ROOT_PATH = '/';
export const LOGIN_PAGE_PATH = 'login';
export const REGISTER_PAGE_PATH = 'register';
export const NO_MATCH_PATH = '*';

export const MAIN_VIEW_PATH = 'main';
export const ANALYTICS_VIEW_PATH = 'analytics';
export const DEALS_VIEW_PATH = 'deals';
export const HISTORY_VIEW_PATH = 'history';
export const ACCOUNTS_VIEW_PATH = 'accounts';
export const PROFILE_VIEW_PATH = 'profile';

export const Path = {
  ROOT: ROOT_PATH,
  MAIN_PAGE: ROOT_PATH,
  LOGIN_PAGE: LOGIN_PAGE_PATH,
  REGISTER_PAGE: REGISTER_PAGE_PATH,
  NO_MATCH: NO_MATCH_PATH,
} as const;

export const ViewPath = {
  MAIN: MAIN_VIEW_PATH,
  ANALYTICS: ANALYTICS_VIEW_PATH,
  DEALS: DEALS_VIEW_PATH,
  HISTORY: HISTORY_VIEW_PATH,
  ACCOUNTS: ACCOUNTS_VIEW_PATH,
  PROFILE: PROFILE_VIEW_PATH,
} as const;
