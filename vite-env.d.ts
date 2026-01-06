// Fix for "Cannot redeclare block-scoped variable 'process'"
// Instead of redeclaring 'process' (which conflicts with existing definitions),
// we augment the NodeJS namespace to include our custom environment variables.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
