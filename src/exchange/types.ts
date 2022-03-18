import { PublicKey } from "@safecoin/web3.js";
import BN from "bn.js";
import { Order as SerumOrder } from "@safely-project/serum/lib/market";

export type Coin = string;
export type Exchange = string;

export class Pair {
  coin;
  priceCurrency;

  constructor(coin: Coin, priceCurrency: Coin) {
    this.coin = coin;
    this.priceCurrency = priceCurrency;
  }

  static key(coin: Coin, priceCurrency: Coin): string {
    return `${coin}/${priceCurrency}`;
  }

  key(): string {
    return Pair.key(this.coin, this.priceCurrency);
  }

  static fromKey(key: string): Pair {
    const [coin, priceCurrency] = key.split("/");
    return new Pair(coin, priceCurrency);
  }

  equals(other: Pair): boolean {
    return (
      other.coin === this.coin && other.priceCurrency === this.priceCurrency
    );
  }
}

export enum Dir {
  B = 1,
  S = -1,
}

export enum OrderType {
  limit = "limit",
  ioc = "ioc",
  postOnly = "postOnly",
}

export enum Liquidity {
  T = "T",
  M = "M",
}

export class Order<T = any> {
  exchange: Exchange;
  coin: Coin;
  priceCurrency: Coin;
  side: Dir;
  price: number;
  quantity: number;
  info: T;

  constructor(
    exchange: Exchange,
    coin: Coin,
    priceCurrency: Coin,
    side: Dir,
    price: number,
    quantity: number,
    info: T
  ) {
    this.exchange = exchange;
    this.coin = coin;
    this.priceCurrency = priceCurrency;
    this.side = side;
    this.price = price;
    this.quantity = quantity;
    this.info = info;
  }
}

export class OrderInfo {
  orderId: string;
  openOrdersAddress: string;
  openOrdersSlot: number;
  price: number;
  priceLots: string;
  size: number;
  sizeLots: string;
  side: "buy" | "sell";
  clientId: string;
  feeTier: number;

  constructor(
    orderId: string,
    openOrdersAddress: string,
    openOrdersSlot: number,
    price: number,
    priceLots: string,
    size: number,
    sizeLots: string,
    side: "buy" | "sell",
    clientId: string,
    feeTier: number
  ) {
    this.orderId = orderId;
    this.openOrdersAddress = openOrdersAddress;
    this.openOrdersSlot = openOrdersSlot;
    this.price = price;
    this.priceLots = priceLots;
    this.size = size;
    this.sizeLots = sizeLots;
    this.side = side;
    this.clientId = clientId;
    this.feeTier = feeTier;
  }

  static fromSerumOrder(order: SerumOrder): OrderInfo {
    return new OrderInfo(
      order.orderId.toString(),
      order.openOrdersAddress.toBase58(),
      order.openOrdersSlot,
      order.price,
      order.priceLots.toString(),
      order.size,
      order.sizeLots.toString(),
      order.side,
      order.clientId ? order.clientId.toString() : "",
      order.feeTier
    );
  }

  toSerumOrder(): SerumOrder {
    return {
      orderId: new BN(this.orderId),
      openOrdersAddress: new PublicKey(this.openOrdersAddress),
      openOrdersSlot: this.openOrdersSlot,
      price: this.price,
      priceLots: new BN(this.priceLots),
      size: this.size,
      sizeLots: new BN(this.sizeLots),
      side: this.side,
      clientId: new BN(this.clientId),
      feeTier: this.feeTier,
    };
  }
}

export interface Trade<T = any> {
  exchange: Exchange;
  coin: Coin;
  priceCurrency: Coin;
  id: string;
  orderId: string;
  price: number;
  quantity: number;
  time: number;
  side: Dir;
  info?: T;
}

export interface Fill<T = any> {
  exchange: Exchange;
  coin: Coin;
  priceCurrency: Coin;
  side: Dir;
  price: number;
  quantity: number;
  time: number;
  orderId: string;
  fee: number;
  info?: T;
}

export interface L2OrderBook {
  bids: [number, number][];
  asks: [number, number][];
  market: Pair;
  validAt: number;
  receivedAt: number;
}

export interface OwnOrders<T = Order> {
  [orderId: string]: T;
}

export interface MarketInfo {
  address: PublicKey;
  baseMint: PublicKey;
  quoteMint: PublicKey;
  minOrderSize: number;
  tickSize: number;
  programId: PublicKey;
  [propName: string]: unknown;
}

export interface RawTrade {
  size: number;
  price: number;
  side: string;
  eventFlags: {
    fill: boolean;
    out: boolean;
    bid: boolean;
    maker: boolean;
  };
  orderId: BN;
  openOrders: PublicKey;
  openOrdersSlot: number;
  feeTier: number;
  nativeQuantityReleased: BN;
  nativeQuantityPaid: BN;
  nativeFeeOrRebate: BN;
}

export interface TimestampedL2Levels {
  orderbook: [number, number][];
  receivedAt: number;
}

export type TokenAccountInfo = {
  pubkey: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: number;
};
