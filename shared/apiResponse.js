class ApiResponse {
  constructor(status, message, data = null, pagination = null, meta = null) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
    this.meta = meta;
  }

  // To format the response in a standard way
  send(res) {
    return res.status(this.status).json({
      status: this.status,
      message: this.message,
      data: this.data,
      pagination: this.pagination,
      meta: this.meta
    });
  }
}

export default ApiResponse;