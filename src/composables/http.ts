export const HTTP_BAD_REQUEST = 400
export const HTTP_CONFLICT = 409
export const HTTP_NOT_FOUND = 404
export const HTTP_NOT_IMPLEMENTED = 501
export const HTTP_UNPROCESSABLE_ENTITY = 422
export const HTTP_TOO_MANY_REQUESTS = 429
export const HTTP_INTERNAL_SERVER_ERROR = 500

export const statusMessages: Record<number, string> = {
  // 4xx Error Codes
  400: "Oops! Your request is invalid.", // Bad Request
  401: "Unauthorized access. Please authenticate or change roles to proceed.", // Unauthorized
  403: "Access denied. You don't have permission to view this resource.", // Forbidden
  404: "Sorry, the resource you're looking for could not be found.", // Not Found
  405: "Invalid request method.", // Method Not Allowed
  408: "Request timeout. Please try again later.", // Request Timeout
  409: "Your request could not be completed due to a conflict with the current state of the resource.", // Conflict
  422: "Hmm... some of your inputs look invalid.", // Unprocessable Entity
  429: "Slow down! You've exceeded the request limit.", // Too Many Requests

  // 5xx Error Codes
  500: "Something went wrong on our end. We're working to fix it.", // Internal Server Error
  501: "Feature not implemented yet. Stay tuned for updates!", // Not Implemented
  502: "Oops! There's a problem with the server gateway.", // Bad Gateway
  503: "Service temporarily unavailable. Please try again later.", // Service Unavailable
  504: "Gateway timeout. Our server is taking too long to respond.", // Gateway Timeout
}
