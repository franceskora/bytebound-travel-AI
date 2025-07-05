/**
 * Standard API response formatter
 * Ensures consistent response structure across all endpoints
 */

class ResponseFormatter {
    /**
     * Success response
     * @param {Object} res - Express response object
     * @param {Object} data - Response data
     * @param {String} message - Success message
     * @param {Number} statusCode - HTTP status code
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        const response = {
            status: 'success',
            message,
            timestamp: new Date().toISOString()
        };

        if (data !== null) {
            response.data = data;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Error response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     * @param {Number} statusCode - HTTP status code
     * @param {Array} errors - Detailed error array
     */
    static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
        const response = {
            status: 'error',
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Paginated response
     * @param {Object} res - Express response object
     * @param {Array} data - Array of data items
     * @param {Object} pagination - Pagination info
     * @param {String} message - Success message
     */
    static paginated(res, data, pagination, message = 'Data retrieved successfully') {
        return res.status(200).json({
            status: 'success',
            message,
            count: data.length,
            pagination,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Created response
     * @param {Object} res - Express response object
     * @param {Object} data - Created resource data
     * @param {String} message - Success message
     */
    static created(res, data, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    /**
     * No content response
     * @param {Object} res - Express response object
     * @param {String} message - Success message
     */
    static noContent(res, message = 'Operation completed successfully') {
        return res.status(204).json({
            status: 'success',
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Validation error response
     * @param {Object} res - Express response object
     * @param {Array} errors - Validation errors
     */
    static validationError(res, errors) {
        return this.error(res, 'Validation failed', 400, errors);
    }

    /**
     * Not found response
     * @param {Object} res - Express response object
     * @param {String} resource - Resource name
     */
    static notFound(res, resource = 'Resource') {
        return this.error(res, `${resource} not found`, 404);
    }

    /**
     * Unauthorized response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, message, 401);
    }

    /**
     * Forbidden response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static forbidden(res, message = 'Access forbidden') {
        return this.error(res, message, 403);
    }
}

module.exports = ResponseFormatter;