export const sendJson = (status: boolean, message: string, data: any = []) => {
    return {
        status: status,
        message: message,
        data: data,
    };
};