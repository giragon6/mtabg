/**
 * Returns an index from 0 to length of weights - 1 based on given weights
 * (cumulative sum)
 * @param { number[] } weights 
 */ 
function weightedRandom(weights: number[]): number {

  const cumulativeWeights = [];
  for (let i = 0; i < weights.length; i++) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i-1] || 0);
  }
  const max = cumulativeWeights[cumulativeWeights.length-1]
  const rand = max * Math.random()
  for (let j = 0; j < weights.length; j++) {
    if (cumulativeWeights[j] >= rand) return j;
  }
  throw new Error('Error generating weighted random number')
}