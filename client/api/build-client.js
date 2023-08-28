export default ({ req }) => {
    if (typeof window === 'undefined') {
      // We are on the server
      return  async (url, options = {}) => {
        let res = await  fetch(
          `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${url}`,
          {
            ...options,
            headers: req.headers,
          }
        );

        return await res.json();
      };
    } else {
      // We must be on the browser
      return async (url, options = {}) => {
        let res = await  fetch(url, {
          ...options,
        });
        return await res.json();
        
      };
    }
  };
  