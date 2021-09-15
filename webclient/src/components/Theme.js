import { MantineProvider, GlobalStyles, NormalizeCSS } from '@mantine/core';
import React, { Component } from 'react';

export default function Theme({children}) {
    console.log(children)
    return <MantineProvider theme={{
        colorScheme: 'light',
        colors: {
          // Add your color
        },
        fontFamily: '"Courier New", monospace ,Roboto, sans-serif',

        shadows: {
          // other shadows (xs, sm, lg) will be merged from default theme
          md: '1px 1px 3px rgba(0,0,0,.25)',
          xl: '5px 5px 3px rgba(0,0,0,.25)',
        },
        spacing: {
            xs: 12,
            sm: 16,
            md: 20,
            lg: 24,
            xl: 28,
          },
        headings: {
          fontFamily: '"Courier New", monospace ,Roboto, sans-serif',
          sizes: {
            h1: { fontSize: 30 },
          },
        },
      }}>
      <NormalizeCSS/>
      <GlobalStyles/>
    {children}
    </MantineProvider>
}