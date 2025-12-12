// This file is intended for documentation of the design system and data schemas.
// It is not actively used in the application's runtime code.

export const designTokens = {
    colors: {
        'brand-orange': '#F53D05',
        'brand-dark-blue': '#2B2936',
        'brand-light-blue': '#DCECFA',
        'brand-light-gray': '#C9C8D0',
        'brand-dark-gray': '#4B4957',
        'text-primary': '#2B2936',
        'text-secondary': '#4B4957',
        'background': '#F8F9FA',
        'surface': '#FFFFFF',
        'border-color': '#E9ECEF',
    },
    typography: {
        sans: ['"Inter"', 'sans-serif'],
    }
};

export const dataSchemas = {
    topInsight: {
        id: 'string',
        title: 'string',
        subtitle: 'string',
        value: 'number',
        delta: 'number',
        valueType: "'share' | 'currency' | 'count'",
        deltaType: "'pp' | 'rel'",
        provenance: 'PillType',
        detailData: 'object | undefined',
    },
    // ... other schemas can be documented here
};
