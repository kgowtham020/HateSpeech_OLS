// Removed reference to vite/client as it was causing type definition errors

declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
