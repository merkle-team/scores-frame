const MIN_SCORE_FORMATTER_TARGET = 1e3 / 2;

function formatScore({ score }: { score: number }) {
  return score.toLocaleString();
}

export { formatScore };
