export const responseHandler = {
  success: (res: any, data: any, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },
  error: (res: any, message = 'Internal Server Error', statusCode = 500, error: any = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  },
};
