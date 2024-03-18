import type { TextProps } from 'ink';
import { extendTheme, defaultTheme } from '@inkjs/ui';
import { colors } from './colors.js';

export const inkTheme = extendTheme(defaultTheme, {
  components: {
    Select: {
      styles: {
        focusIndicator: () => ({ color: colors.focusIndicator }),
        label: ({ isFocused, isSelected }) => ({
          color: isFocused || isSelected ? colors.focusIndicator : undefined,
        }),
      },
    },
    Spinner: {
      styles: {
        frame: (): TextProps => ({
          color: colors.assistant,
        }),
        label: (): TextProps => ({
          color: colors.assistant,
        }),
      },
    },
  },
});
