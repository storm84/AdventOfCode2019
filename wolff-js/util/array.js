Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b);
};

Array.prototype.max = function() {
  return Math.max(...this);
};
Array.prototype.min = function() {
  return Math.min(...this);
};

Array.prototype.groupBy = function(predicate) {
  const map = new Map();
  for (const item of this) {
    const key = predicate(item);
    if (!map.has(key)) {
      map.set(key, [item]);
    } else {
      map.get(key).push(item);
    }
  }

  return [...map].map(([key, values]) => {
    values.key = key;
    return values;
  });
};

Array.prototype.orderBy = function(predicate) {
  return this.map(item => ({ item, value: predicate(item) }))
    .sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    })
    .map(x => x.item);
};

Array.prototype.orderByDesc = function(predicate) {
  return this.map(item => ({ item, value: predicate(item) }))
    .sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    })
    .map(x => x.item);
};
