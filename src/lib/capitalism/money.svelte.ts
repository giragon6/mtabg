import Card from "$lib/models/card"
import { MTabGStorage } from "$lib/storage/storage"
import { capitalismState } from './capitalismMode.svelte'

export namespace Money {
  // will ask for confirmation if selling cards w val >= this amt
  export const SELL_WARN_THRESHOLD = 5.00; 

  export async function sellCard(card: Card): Promise<number | null> {
    const moneyAdded = await addMoneyAndUpdateState(card.price);
    if (!moneyAdded) {
      console.error("Failed to add money and set money state!");
      return null
    }
    const success = await MTabGStorage.removeCard(Card.hash(card));
    if (success) {
      return card.price;
    } else {
      console.error("Failed to remove sold card!");
      return null
    }
  }

  export async function addMoneyAndUpdateState(num: number): Promise<boolean> {
    const moneyAdded = await MTabGStorage.addMoney(num);
    if (moneyAdded) {
      const curMoney = await MTabGStorage.getMoney();
      if (curMoney !== null) {
        capitalismState.money = curMoney;
        return true
      } else {
        console.error("Failed to set money state!")
        return false
      }
    } else {
      console.error("Failed to add money!")
      return false
    }
  }
}