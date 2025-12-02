// Fuzzy matching and spell correction for typo tolerance
export const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export const findBestMatch = (input: string, options: string[]): string | null => {
  if (!options.length) return null;
  
  const inputWords = input.toLowerCase().split(/\s+/);
  let bestMatch = options[0];
  let bestDistance = Infinity;
  
  for (const option of options) {
    const optionWords = option.toLowerCase().split(/\s+/);
    let totalDistance = 0;
    
    for (const inputWord of inputWords) {
      let minDist = Infinity;
      for (const optWord of optionWords) {
        const dist = levenshteinDistance(inputWord, optWord);
        minDist = Math.min(minDist, dist);
      }
      totalDistance += minDist;
    }
    
    if (totalDistance < bestDistance) {
      bestDistance = totalDistance;
      bestMatch = option;
    }
  }
  
  // Only return match if distance is reasonable (less than 50% of input length)
  if (bestDistance <= Math.max(input.length * 0.5, 2)) {
    return bestMatch;
  }
  
  return null;
};

export const correctSpelling = (text: string): string => {
  // Common command corrections
  const corrections: { [key: string]: string } = {
    'kadanes': 'kadane',
    'algorithim': 'algorithm',
    'algo': 'algorithm',
    'pyramod': 'pyramid',
    'reciursive': 'recursive',
    'sory': 'sorry',
    'pls': 'please',
    'thx': 'thanks',
    'wht': 'what',
  };
  
  let corrected = text.toLowerCase();
  for (const [wrong, right] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, right);
  }
  
  return corrected;
};

// Expand abbreviations
export const expandAbbreviations = (text: string): string => {
  const expansions: { [key: string]: string } = {
    'algo': 'algorithm',
    'df': 'dataframe',
    'db': 'database',
    'api': 'API',
    'ui': 'user interface',
    'ux': 'user experience',
    'ml': 'machine learning',
    'ai': 'artificial intelligence',
    'io': 'input output',
    'cpu': 'processor',
  };
  
  let expanded = text;
  for (const [abbr, full] of Object.entries(expansions)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    expanded = expanded.replace(regex, full);
  }
  
  return expanded;
};
