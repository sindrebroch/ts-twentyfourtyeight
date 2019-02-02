// NumberUtils.ts

/**
 * Calculated a random number between fromNumber and toNumber
 * 
 * @param fromNumber 
 * @param toNumber 
 */
export const getRandomNumberBetween = (fromNumber:number, toNumber:number):number => {
    return Math.floor(Math.random() * toNumber) + fromNumber;
}