function isEnoughCapacity(products, containerSize) {
  // Object.values ile ürün adetlerini al, sonra reduce ile topla
  const totalItems = Object.values(products).reduce((sum, quantity) => sum + quantity, 0);
  // Toplam ürün adeti konteyner kapasitesinden küçük/eşitse true, değilse false döndür
  return totalItems <= containerSize;
}

// Test çağrıları
console.log(isEnoughCapacity({ apples: 2, grapes: 3, carrots: 1 }, 8)); // true
console.log(isEnoughCapacity({ apples: 4, grapes: 6, lime: 16 }, 12)); // false
console.log(isEnoughCapacity({ apples: 1, lime: 5, tomatos: 3 }, 14)); // true
console.log(isEnoughCapacity({ apples: 18, potatos: 5, oranges: 2 }, 7)); // false