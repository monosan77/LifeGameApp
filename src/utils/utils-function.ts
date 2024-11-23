export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const formatMoney = (value: number) => {
  const realValue = value * 10000; // 「1」を「1万円」に変換
  if (realValue >= 100000000) {
    // 1億以上なら「億円」でフォーマット
    const billionPart = Math.floor(realValue / 100000000); // 億の部分
    const millionPart = Math.floor((realValue % 100000000) / 10000); // 万の部分
    return `${billionPart}億${millionPart}`;
  } else {
    // 1億未満なら「万円」でフォーマット
    return `${realValue / 10000}`;
  }
};
