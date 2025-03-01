import { Order } from "./order";
import { User } from "./user";

export interface OrderWithUser {
    order: Order,
    user: User
  }
  