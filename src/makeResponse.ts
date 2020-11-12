import { APIGatewayProxyResult } from "aws-lambda"

const makeResponse = (statusCode: number, message: string | object, headers?: { [header: string]: boolean | number | string }): APIGatewayProxyResult => ({
    statusCode,
    headers: {
        ...headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body:
        typeof message === 'object'
            ? JSON.stringify(message)
            : JSON.stringify(
                {
                    message
                }
            )
})

export const makeSuccessResponse = (message: string | object, headers?: { [header: string]: boolean | number | string }) => makeResponse(200, message, headers)

export const makeErrorResponse = (err: any, message?: any) => {
    if (err instanceof Error) {
        return makeResponse(500, err.message)
    }
    if (typeof err === 'number') {
        return makeResponse(err, message)
    }
    return makeResponse(500, message)
}

export const makePlaintextResponse = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Content-Encoding': 'UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: message
    }
}
