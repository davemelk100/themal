# Store Module

This directory contains all store/e-commerce related functionality. It has been structured to be easily extractable into its own repository.

## Directory Structure

```
store/
├── components/     # Store-specific components (currently empty, can be used for shared store components)
├── context/        # React contexts for store state management
│   ├── CartContext.tsx
│   └── StoreContext.tsx
├── data/          # Product data and static content
│   └── storeProducts.ts
├── pages/         # Store page components
│   ├── Store.tsx
│   ├── ProductDetail.tsx
│   ├── Checkout.tsx
│   └── CheckoutSuccess.tsx
├── types/         # TypeScript type definitions
│   └── index.ts
├── index.ts       # Main export file
└── README.md      # This file
```

## Dependencies

### Internal Dependencies (from parent project)

- `@/hooks/use-toast` - Toast notification hook
- `components/ui/*` - UI components (dropdown-menu, avatar, toast)
- `react-router-dom` - Routing
- `framer-motion` - Animations
- `lucide-react` - Icons

### External Dependencies

- `react`
- `react-dom`

## Usage in Main App

The store module is imported in `src/App.tsx`:

```typescript
import { CartProvider, StoreProvider } from "./store";
```

Routes are set up as:

```typescript
<Route path="/store" element={<Store />} />
<Route path="/store/product/:id" element={<ProductDetail />} />
<Route path="/store/checkout" element={<Checkout />} />
<Route path="/store/checkout/success" element={<CheckoutSuccess />} />
```

## Extracting to Standalone Repository

To extract this module into its own repository:

1. **Copy the entire `src/store/` directory** to the new repository
2. **Copy required dependencies:**
   - `components/ui/` - All UI components used by store pages
   - `hooks/use-toast.ts` - Toast notification hook
   - `hooks/use-toast.ts` dependencies (if any)
3. **Update import paths:**
   - Change `@/hooks/use-toast` to relative paths or configure path aliases
   - Update `../../../components/ui/*` paths to match new structure
4. **Set up routing:**
   - Create a new router setup in the standalone app
   - Ensure routes match: `/store`, `/store/product/:id`, `/store/checkout`, `/store/checkout/success`
5. **Copy required assets:**
   - Product images from `public/img/` (all images referenced in `storeProducts.ts`)
6. **Set up providers:**
   - Wrap app with `CartProvider` and `StoreProvider`
   - Add `Toaster` component for notifications
7. **Environment setup:**
   - Copy `netlify.toml` if using Netlify functions for checkout
   - Set up Stripe integration (if checkout uses Stripe)
8. **Update package.json:**
   - Include all dependencies: `react`, `react-dom`, `react-router-dom`, `framer-motion`, `lucide-react`, `@radix-ui/react-toast`, etc.

## Key Files

- **types/index.ts**: Centralized type definitions (`Product`, `CartItem`)
- **context/CartContext.tsx**: Shopping cart state management with localStorage persistence
- **context/StoreContext.tsx**: Store category filtering state
- **data/storeProducts.ts**: Product catalog data
- **pages/Store.tsx**: Main store page with product grid
- **pages/ProductDetail.tsx**: Individual product detail page
- **pages/Checkout.tsx**: Checkout page with cart summary
- **pages/CheckoutSuccess.tsx**: Post-checkout success page

## Notes

- Cart data is persisted in `localStorage` with key `"davemelk-cart"`
- The store uses a liquid glass design aesthetic with animated backgrounds
- All product images should be in `public/img/` directory
- Checkout integration may require backend functions (see `netlify/functions/` if applicable)
