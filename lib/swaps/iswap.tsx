
export type Token = {
    address: string
    decimals: number
    symbol: string
    name: string
}

export interface ISwap {
    getBestAmountIn(from: Token, to: Token, amountOut: string);
    getBestAmountOut(from: Token, to: Token, amountIn: string);
    getTokenList(networkId: string);
    getToken(env: string, token: Token);
    getRouterAddress(env: string);
    getWONEToken(env: string);
    getTokenBalance(token: Token);
    swapToken(from: Token, to: Token, amountOut: string, amountIn: string);
}