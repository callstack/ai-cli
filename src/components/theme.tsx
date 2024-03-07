import { extendTheme, defaultTheme } from '@inkjs/ui';
import { colors } from './colors.js';

export const theme = extendTheme(defaultTheme, {
  components: {
    Select: {
      styles: {
        focusIndicator: () => ({ color: colors.focusIndicator }),
        label: ({ isFocused, isSelected }) => ({
          color: isFocused || isSelected ? colors.focusIndicator : undefined,
        }),
      },
    },
  },
});
