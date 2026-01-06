
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Explicitly serve index.html for root path to ensure the app loads
    if (url.pathname === '/') {
       const response = await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
       if (response.status === 200) return response;
    }

    // Attempt to fetch the requested asset from the uploaded 'dist' folder
    let response = await env.ASSETS.fetch(request);

    // If the asset is not found (404) and it looks like a page navigation (no file extension),
    // serve index.html to allow React Router to handle the route.
    if (response.status === 404 && !url.pathname.includes('.')) {
      response = await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
    }

    return response;
  },
};
