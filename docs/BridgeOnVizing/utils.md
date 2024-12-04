---
sidebar_position: 5
---

# Utils

## string to hex

```typescript
export const toHex = (str: string): string => {
    const encoder = new TextEncoder();
    const value = encoder.encode(str);
    const hexes = Array.from({ length: 256 }, (_v, i) =>
      i.toString(16).padStart(2, '0'),
    );

    let string = '';
    for (let i = 0; i < value.length; i++) {
      string += hexes[value[i]];
    }
    const hex = `0x${string}` as const;
    return hex;
  }
```
